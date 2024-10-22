import React, { createContext, useState, useContext } from 'react';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [trips, setTrips] = useState([]);
    const [activities, setActivities] = useState([]);
    const [itinerary, setItinerary] = useState({});

    const updateCity = (city) => setCity(city);
    const updateDates = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    const updateTripName = (id, newName) => {
        setTrips(prevTrips => prevTrips.map(trip => {
            if (trip.id === id) {
                return { ...trip, name: newName };
            }
            return trip;
        }));
    };

    const saveTrip = (trip) => setTrips(prev => [...prev, trip]);
    const deleteTrip = (id) => setTrips(prev => prev.filter(t => t.id !== id));
    const loadTrip = (trip) => {
        console.log("Loading trip:", trip);
        setCity(trip.destination);
        setStartDate(new Date(trip.startDate));
        setEndDate(new Date(trip.endDate));
        setActivities(trip.activities || []);
        setItinerary(trip.itinerary || {});
    };
    

    return (
        <TripContext.Provider value={{
            city, startDate, endDate, trips, activities, itinerary,
            updateCity, updateDates, saveTrip, deleteTrip, loadTrip, setActivities, updateTripName,
        }}>
            {children}
        </TripContext.Provider>
    );
};

export const useTrip = () => useContext(TripContext);
