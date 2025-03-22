import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { login } from "../../../utils/auth_utils";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState(false);
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            setRedirect(true);
        }
    }, [isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result.success) {
            console.log("User logged in:", result.data);
            localStorage.setItem("authToken", result.data.token);
            setIsAuthenticated(true);
        } else {
            setError(result.error);
        }
    };

    if (redirect) {
        return <Navigate to="/scanner" />;
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Login;