import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../contexts/TripContext'; 
import '../css/ProfileScreenStyles.css';
import profileIcon from '../assets/images/profileIcon.png'; 

const ProfileScreen = () => {
    const { trips } = useTrip(); 
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Logging out...");
        navigate('/login'); 
    };

    return (
        <div className="profile-screen">
            <div className="profile-header">
                <img src={profileIcon} alt="Profile" className="profile-logo" />
                <h1>John Doe</h1>
                <p>Email: john.doe@example.com</p>
                <p>Member since: January 2020</p>
                <p>Planned Trips: {trips.length}</p>
            </div>
            <div className="profile-info">
                <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
                <button onClick={() => navigate('/change-password')}>Change Password</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default ProfileScreen;
