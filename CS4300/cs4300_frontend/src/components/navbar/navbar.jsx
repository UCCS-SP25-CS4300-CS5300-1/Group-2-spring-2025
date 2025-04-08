import React from "react";
import { Link } from "react-router-dom"; // ✅ import Link
import "./navbar.css";
import Logout from "../pages/auth/logout/logout";

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-left">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/scanner">Scanner</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/history">History</Link></li>
            </ul>
            <ul className="navbar-right">
                <li><Logout /></li>
            </ul>
        </nav>
    );
}

export default Navbar;