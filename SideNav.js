import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SideNav.css";

const SideNav = ({ isAuthenticated, setIsAuthenticated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear the stored token
        setIsAuthenticated(false); // Update global auth state
        navigate("/"); // Redirect to the home page
        setIsOpen(false); // Close the side navigation
    };

    return (
        <>
            <img
                className="menu-icon"
                src="https://static-00.iconduck.com/assets.00/admission-tickets-emoji-512x512-l1i8c14a.png"
                alt="menu"
                onClick={toggleNav}
            />
            <div className={`side-nav ${isOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={toggleNav}>×</button>
                <Link to="/" onClick={toggleNav}>Home</Link>
                
                {isAuthenticated ? (
                    <>
                        <Link to="/profile" onClick={toggleNav}>Profile</Link>
                        <button onClick={handleLogout}>Log Out</button>
                    </>
                ) : (
                    <>
                        <Link to="/sign-in" onClick={toggleNav}>Sign In</Link>
                        <Link to="/sign-up" onClick={toggleNav}>Sign Up</Link>
                    </>
                )}
            </div>
        </>
    );
};

export default SideNav;