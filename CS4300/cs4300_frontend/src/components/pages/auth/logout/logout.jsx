import React, { useContext, useState } from "react";
import { logout } from "../../../utils/auth_utils";
import { AuthContext } from "../../../../context/AuthContext";
import { Navigate } from "react-router-dom";

function Logout() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [redirect, setRedirect] = useState(false);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setRedirect(true);
    console.log("User logged out");
  };

  if (redirect) {
    return <Navigate to="/login" replace />;
  }

  return (
    <button
      onClick={handleLogout}
      type="button"
      className="logout-button"
      aria-label="Log out"
    >
      Logout
    </button>
  );
}

export default Logout;
