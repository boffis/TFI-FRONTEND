import { useContext, useState } from "react";
import { AuthContext } from "../services/authContext/AuthContext";
import { getApiUrl } from "../utils/apiUrl";
import { translateApiError, GENERIC_ERROR, NETWORK_ERROR } from "../utils/errorMessages";

const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);

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
                    // Errors are ProblemDetails ({ title, detail, status }), not { message } —
                    // though a few AuthController actions answer with a bare string.
                    let errData = {};
                    try {
                        errData = await res.json();
                    } catch {
                        // Non-JSON body (e.g. empty 401): fall through to the generic message.
                    }

                    const backendMessage = typeof errData === 'string'
                        ? errData
                        : errData.detail || errData.message || errData.title;

                    // The one place English becomes Spanish, so every caller gets it translated.
                    throw new Error(translateApiError(backendMessage));
                }

                const contentLength = res.headers.get('content-length')
                const contentType = res.headers.get('content-type') ?? ''
                const hasBody = contentType.includes('application/json') &&
                    contentLength !== '0' && res.status !== 204

                return hasBody ? res.json().catch(() => { throw new Error(GENERIC_ERROR) }) : null
            },
                // fetch() rejected, so there is no response to read a message from.
                () => { throw new Error(NETWORK_ERROR) })
            .then(onSucces)
            .catch(onError)
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