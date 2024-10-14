// src/components/header/Header.js
import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import SideNav from "../sideNav/SideNav";

const Header = () => {
    const isLoggedIn = !!localStorage.getItem("token"); // Check if the user is logged in

    return (
        <div className="header">
            <div className="headerLeft">
                <Link to="/">
                    <img className="header__icon" src="https://static-00.iconduck.com/assets.00/video-icon-510x512-ub3xoa11.png" alt="logo" />
                </Link>
                <Link to="/movies/popular" style={{ textDecoration: "none" }}><span>Popular</span></Link>
                <Link to="/movies/now_playing" style={{ textDecoration: "none" }}><span>Now Playing</span></Link>
            </div>
            <div className="headerRight">
                <Link to="/search">
                    <img className="search-icon" src="/images/pngtree-3d-glasses-vector-icon-on-a-white-background-vector-png-image_12538025.png" alt="search" />
                </Link>
                <SideNav /> {/* Include the SideNav component */}
            </div>
        </div>
    );
};

export default Header;