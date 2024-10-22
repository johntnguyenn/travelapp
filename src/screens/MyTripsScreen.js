import React from 'react';
import { useTrip } from '../contexts/TripContext';
import { useNavigate } from 'react-router-dom';  
import '../css/MyTripsScreenStyles.css';
import { FaTrashAlt } from 'react-icons/fa';

const MyTripsScreen = () => {
    const { trips, updateTripName, deleteTrip, loadTrip } = useTrip(); 
    const navigate = useNavigate();  

    const handleEditName = (id, e) => {
        e.stopPropagation(); 
        const newName = prompt('Enter new trip name:');
        if (newName) {
            updateTripName(id, newName);
        }
    };
    
    const handleDeleteTrip = (id) => {
        if (window.confirm("Are you sure you want to delete this trip?")) {
            deleteTrip(id);
        }
    };

    const handleSelectTrip = (trip) => {
        loadTrip(trip);  
        navigate('/create');
    };    

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="profile">
            <h1>My Saved Trips</h1>
            <div className="trip-list">
                {trips.map(trip => (
                    <div key={trip.id} className="trip-card" onClick={() => handleSelectTrip(trip)}>
                        <h2 className="editable-name" onClick={(e) => handleEditName(trip.id, e)}>
                            {trip.name || trip.destination}
                        </h2>
                        <p>Dates: {formatDate(trip.startDate)} to {formatDate(trip.endDate)}</p>
                        <FaTrashAlt className="delete-icon" onClick={(e) => {
                            e.stopPropagation();  
                            handleDeleteTrip(trip.id);
                        }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyTripsScreen;
