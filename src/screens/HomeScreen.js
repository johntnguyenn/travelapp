import React, { useState, useEffect } from 'react';
import '../css/HomeScreenStyles.css';
import NavBar from '../components/NavBar';
import imageUrls from '../config/Images';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../contexts/TripContext'; // Assuming you've created this context

const HomeScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [startDate, setStartDate] = useState(null); // Define startDate state
    const [endDate, setEndDate] = useState(null); // Define endDate state
    const navigate = useNavigate();
    const today = new Date();
    const { updateCity, updateDates } = useTrip(); // Destructure context functions

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentImageIndex(currentIndex => (currentIndex + 1) % imageUrls.length);
                setFade(true);
            }, 500);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (searchTerm.length > 2) {
            fetch(`http://localhost:8000/api/place-suggestions/?input=${searchTerm}`)
                .then(response => response.json())
                .then(data => setSuggestions(data.predictions))
                .catch(error => console.error('Error fetching data:', error));
        } else {
            setSuggestions([]); // Clear suggestions if the search term is too short
        }
    }, [searchTerm]);

    const handleSelectSuggestion = (description) => {
        setSearchTerm(description); // Update the search term
        updateCity(description); // Update city in context
        setTimeout(() => setSuggestions([]), 500); // Clear suggestions with a delay
    };

    const handleCreateTrip = () => {
        if (!searchTerm || !startDate || !endDate) {
            alert("Please fill in all fields.");
            return;
        }
        updateDates(startDate, endDate); // Update dates in context
        navigate('/create');
    };

    return (
        <div className="home-screen">
            <NavBar />
            <div className="content">
                <h1 className="header">TRAVEL PLANNER</h1>
                <h2 className="sub-header">Plan your next vacation</h2>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search search-icon"></i>
                    {suggestions.length > 0 && (
                        <ul className="autocomplete-dropdown">
                            {suggestions.map(suggestion => (
                                <li key={suggestion.place_id} onClick={() => handleSelectSuggestion(suggestion.description)}>
                                    {suggestion.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="date-picker-container">
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                        minDate={today}
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="End Date"
                        minDate={startDate || today}
                    />
                </div>
                <button className="create-button" onClick={handleCreateTrip}>Create New Trip</button>
            </div>
            <div className={`background-image ${fade ? 'fade-in' : 'fade-out'}`} style={{ backgroundImage: `url(${imageUrls[currentImageIndex]})` }}>
            </div>
        </div>
    );
};

export default HomeScreen;
