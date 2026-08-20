import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "../services/authContext/AuthContext";
import { getApiUrl } from "../utils/apiUrl";
import {
    translateApiErrorDetailed,
    isSessionRejected,
    ABORTED_ERROR,
    GENERIC_ERROR,
    NETWORK_ERROR,
    OFFLINE_ERROR,
    PARSE_ERROR,
} from "../utils/errorMessages";

/**
 * A plain Error whose `message` is the Spanish string components render, plus the response context
 * they need to branch on the kind of failure (`err.status === 401`) rather than on wording.
 */
const apiError = (message, { cause, ...context } = {}) =>
    Object.assign(new Error(message || GENERIC_ERROR, { cause }), {
        isApiError: true,
        status: 0,
        statusText: '',
        kind: 'http',
        raw: '',
        fieldErrors: null,
        isSpecific: false,
        isSessionRejected: false,
        url: '',
        method: '',
        ...context,
    });

/** One line for the console: enough to find the failure in the backend logs. */
const logLine = (err) =>
    `${err.method || 'REQUEST'} ${err.url || '(sin url)'} → ` +
    `${err.status ? `${err.status} ${err.statusText}`.trim() : err.kind}` +
    `${err.raw ? ` — ${err.raw}` : ''}`;

/**
 * Reads the body once as text, parsing it if it's JSON. Errors arrive as ProblemDetails, JSON
 * strings, or bare text/plain — `res.json()` throws on the last of those.
 */
const readBody = async (res) => {
    const text = await res.text().catch(() => '');
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};

/** Guards against showing a proxy's HTML error page or a stack trace as if it were a message. */
const isShowableText = (value) =>
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.trim().length <= 300 &&
    !value.trim().startsWith('<');

const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user, handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const call = (url, method, isPrivate, header, body, onSucces, onError) => {
        setIsLoading(true);

        fetch(getApiUrl(url), {
            method,
            headers: {
                ...header,
                "Authorization": isPrivate ? `Bearer ${user?.token}` : ''
            },
            body: body && JSON.stringify(body)
        })
            .then(async res => {
                if (!res.ok) {
                    // ProblemDetails, a bare string from AuthController, or nothing at all.
                    const parsed = await readBody(res);
                    const problem = parsed && typeof parsed === 'object' ? parsed : {};

                    const backendMessage = isShowableText(parsed)
                        ? parsed
                        : problem.detail || problem.message || problem.title;

                    // Model binding's per-field detail: { "ClassName": ["...is required."] }.
                    const fieldErrors = problem.errors && typeof problem.errors === 'object'
                        ? problem.errors
                        : null;

                    // The one place English becomes Spanish, so every caller gets it translated.
                    const translated = translateApiErrorDetailed(backendMessage, {
                        status: res.status,
                        fieldErrors,
                        isPrivate,
                    });

                    const raw = typeof backendMessage === 'string' ? backendMessage : '';

                    throw apiError(translated.message, {
                        status: res.status,
                        statusText: res.statusText,
                        kind: 'http',
                        raw,
                        fieldErrors,
                        isSpecific: translated.isSpecific,
                        isSessionRejected: isSessionRejected(res.status, raw),
                        url,
                        method,
                    });
                }

                const contentLength = res.headers.get('content-length')
                const contentType = res.headers.get('content-type') ?? ''
                const hasBody = contentType.includes('application/json') &&
                    contentLength !== '0' && res.status !== 204

                if (!hasBody) return null

                return res.json().catch((cause) => {
                    throw apiError(PARSE_ERROR, {
                        status: res.status,
                        statusText: res.statusText,
                        kind: 'parse',
                        url,
                        method,
                        cause,
                    })
                })
            },
                // fetch() rejected, so there is no response to read a message from.
                (cause) => {
                    const isAborted = cause?.name === 'AbortError'
                    const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false

                    throw apiError(
                        isAborted ? ABORTED_ERROR : isOffline ? OFFLINE_ERROR : NETWORK_ERROR,
                        {
                            kind: isAborted ? 'aborted' : 'network',
                            raw: cause instanceof Error ? cause.message : '',
                            url,
                            method,
                            cause,
                        }
                    )
                })
            .then(onSucces)
            .catch(error => {
                // Wrap anything that isn't ours (a bug inside onSucces, say) so its English JS
                // message never reaches the screen as if the API had said it.
                const failure = error?.isApiError
                    ? error
                    : apiError(GENERIC_ERROR, {
                        kind: 'unexpected',
                        raw: error instanceof Error ? error.message : String(error ?? ''),
                        url,
                        method,
                        cause: error,
                    })

                console.error(`[api] ${logLine(failure)}`, failure)

                // Catches a token the server rejects while it still looks valid to ProtectedLogin,
                // which only checks `exp`. Not every 401 qualifies — see isSessionRejected.
                if (failure.isSessionRejected && isPrivate) {
                    handleLogout()

                    if (location.pathname !== '/login') {
                        navigate('/login', {
                            replace: true,
                            state: { sessionExpired: true, from: location.pathname },
                        })
                    }
                }

                onError?.(failure)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const get = (url, isPrivate, onSucces, onError) =>
        call(url, "GET", isPrivate, null, null, onSucces, onError)

    const post = (url, isPrivate, body, onSucces, onError) =>
        call(url,
            "POST",
            isPrivate,
            {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body,
            onSucces,
            onError
        )


    const put = (url, isPrivate, body, onSucces, onError) =>
        call(url,
            "PUT",
            isPrivate,
            {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body,
            onSucces,
            onError
        )
    const dele = (url, isPrivate, onSucces, onError) =>
        call(url, "DELETE", isPrivate, null, null, onSucces, onError)

    const patch = (url, isPrivate, body, onSucces, onError) =>
        call(url,
            "PATCH",
            isPrivate,
            {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body,
            onSucces,
            onError
        )

    return {
        get,
        post,
        put,
        dele,
        patch,
        isLoading
    }

}

export default useFetch;
