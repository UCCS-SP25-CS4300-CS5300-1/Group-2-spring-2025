import React, { useContext, useState } from "react";
import { logout } from "../../../utils/auth_utils";
import { AuthContext } from "../../../../context/AuthContext";
import { Navigate } from "react-router-dom";

function Logout() {
    const { setIsAuthenticated } = useContext(AuthContext);
    const [redirect, setRedirect] = useState(false);

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setRedirect(true);
        console.log("User logged out");
    };

    if (redirect) {
        return <Navigate to="/login" />;
    }

    return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;