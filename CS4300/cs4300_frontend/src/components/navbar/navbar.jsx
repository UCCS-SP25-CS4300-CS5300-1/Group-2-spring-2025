import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Logout from "../pages/auth/logout/logout";
import avatarIcon from "../../assets/avatar-icon.png";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isLoggedIn = localStorage.getItem("token") !== null;

  const location = useLocation();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">CS4300 Group 2</Link>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/live-scanner">Scanner</Link></li>
          <li><Link to="/compare">Compare</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/history">History</Link></li>

          <li className="dropdown" ref={dropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={toggleDropdown}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img src={avatarIcon} alt="User avatar" className="avatar-icon" />
              {isLoggedIn ? "My Account ▾" : "Account ▾"}
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu dropdown-active">
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
      </div>
    </nav>
  );
};

export default Navbar;
