import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/NavBarStyles.css';
import logo from '../assets/images/logo.png';
import profileIcon from '../assets/images/profileIcon.png'; // Ensure this path is correct

const NavBar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <div className="navbar-container">
            <NavLink to="/" className="navbar-link">
                <img src={logo} alt="PlanIt Logo" className="navbar-logo" />
            </NavLink>
            <div className="navbar-right">
                <div onClick={toggleDropdown} className="navbar-link profile-menu">
                    <img src={profileIcon} alt="Profile" className="profile-icon" />
                    {dropdownOpen && (
                        <div className="dropdown">
                            <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
                            <NavLink to="/my-trips" className="dropdown-item">My Trips</NavLink>
                            <NavLink to="/logout" className="dropdown-item logout">Logout</NavLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavBar;
