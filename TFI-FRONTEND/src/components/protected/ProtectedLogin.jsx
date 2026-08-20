import { useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router"
import { AuthContext } from "../../services/authContext/AuthContext"
import { IsTokenValid } from "./Protected.helper"

const ProtectedLogin = () => {
    const { user, handleLogout } = useContext(AuthContext);
    const location = useLocation();

    if (!IsTokenValid(user?.token)) {
        // A visitor who never logged in isn't an expired session.
        const hadSession = Boolean(user)

        if (hadSession) {
            handleLogout()
        }

        return (
            <Navigate
                to='/login'
                replace
                state={{ sessionExpired: hadSession, from: location.pathname }}
            />
        )
    }
    return <Outlet />
}

export default ProtectedLogin
