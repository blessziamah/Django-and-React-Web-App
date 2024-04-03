import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../api.js";
import {REFRESH_TOKEN, ACCESS_TOKEN} from "../constants.js";
import {useEffect, useState} from "react";


const ProtectedRoute = ({children}) => {
    const [isAuthorized, setIsAuthorize] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuthorize(false))
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("api/token/refresh/", {refresh: refreshToken})

            if (res.stack === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorize(true)
            } else {
                setIsAuthorize(false)
            }
        } catch (error) {
            console.log(error)
            setIsAuthorize(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token) {
            setIsAuthorize(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 100

        if(tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthorize(true)
        }
    }

    if (isAuthorized) {
        return (
            <div>
                Loading....
            </div>
        )
    }

    return isAuthorized ? children : <Navigate to={"/login"} />
};

export default ProtectedRoute;