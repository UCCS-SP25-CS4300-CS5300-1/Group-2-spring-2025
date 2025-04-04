const API_URL = import.meta.env.VITE_DJANGO_BASE_URL;

async function getCSRFToken() {
    try {
        const response = await fetch(`${API_URL}/csrf/`, {
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch CSRF token");
        }
        const data = await response.json();
        return data.csrfToken;
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
        throw error;
    }
}

export async function login(username, password) {
    try {
        const csrfToken = await getCSRFToken();
        console.log(csrfToken);

        const response = await fetch(`${API_URL}/login/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token); // Save the token in localStorage
            localStorage.setItem("isAuthenticated", "true"); // Save login state
            return { success: true, message: "Login successful", data };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error("Error during login:", error);
        return { success: false, error: "Login failed" };
    }
}

export async function logout() {
    try {
        await fetch(`${API_URL}/logout/`, {
            method: "POST",
            credentials: "include",
        });

        localStorage.removeItem("isAuthenticated");
    } catch (error) {
        console.error("Error during logout:", error);
    }
}

export async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_URL}/check-auth/`, {
            credentials: "include",
        });
        if (response.ok) {
            localStorage.setItem("isAuthenticated", "true");
            return true;
        } else {
            localStorage.removeItem("isAuthenticated");
            return false;
        }
    } catch (error) {
        console.error("Error checking authentication status:", error);
        localStorage.removeItem("isAuthenticated");
        return false;
    }
}

export async function register(username, password, email) {
    const csrfToken = await getCSRFToken();
    try {
        const response = await fetch(`${API_URL}/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, email }),
        });

        const data = await response.json();
        if (response.ok) {
            return { success: true, message: data.message };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return { success: false, error: "Registration failed" };
    }
}