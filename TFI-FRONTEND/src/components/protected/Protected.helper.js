import { jwtDecode } from "jwt-decode";

export const IsTokenValid = (token, role = null, roleNeeded = null) => {
    if (!token) return false;

    if (roleNeeded !== null) {
        if (role !== roleNeeded) return false;
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return currentTime < decodedToken.exp;
    } catch (error) {
        console.error("Error decoding the token", error);
        return false;
    }
}
