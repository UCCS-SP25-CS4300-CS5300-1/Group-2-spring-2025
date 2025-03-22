import React from "react";
import "./navbar.css";
import Logout from "../pages/auth/logout/logout";

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-left">
                <li><a href="/">Home</a></li>
                <li><a href="/scanner">Scanner</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/register">Register</a></li>


            </ul>
            <ul className="navbar-right">
                <li><Logout /></li>
            </ul>
        </nav>
    );
}

export default Navbar;