import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logout from "../pages/auth/logout/logout";
import avatarIcon from "../../assets/avatar-icon.png";
import "./navbar.css";

function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Replace this with real auth logic
    const isLoggedIn = localStorage.getItem("token") !== null;

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <ul className="navbar-left">
                <li><Link to="/">Home</Link></li>
            </ul>

            <ul className="navbar-center">
                <li><Link to="/scanner">Scanner</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/compare">Compare</Link></li>
                <li><Link to="/history">History</Link></li>
            </ul>

            <ul className="navbar-right">
                <li className="dropdown" ref={dropdownRef}>
                    <button className="dropdown-toggle" onClick={toggleDropdown}>
                        <img
                            src={avatarIcon}
                            alt="User Avatar"
                            className="avatar-icon"
                        />
                        {isLoggedIn ? "My Account ▾" : "Account ▾"}
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            {isLoggedIn ? (
                                <>
                                    <Link to="/account" onClick={() => setDropdownOpen(false)}>Account</Link>
                                    <Logout />
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setDropdownOpen(false)}>Login</Link>
                                    <Link to="/register" onClick={() => setDropdownOpen(false)}>Register</Link>
                                </>
                            )}
                        </div>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
