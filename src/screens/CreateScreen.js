import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTrip } from '../contexts/TripContext';
import '../css/CreateScreenStyles.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import MapComponent from '../components/Map';

const CreateScreen = () => {
    const { city, startDate, endDate, saveTrip } = useTrip();
    const { activities, setActivities } = useTrip();
    const [itinerary, setItinerary] = useState({});
    const [localActivities, setLocalActivities] = useState(activities);
    const [localItinerary, setLocalItinerary] = useState(itinerary);
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState('Landmarks');
    const [tripName, setTripName] = useState('');
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const navigate = useNavigate();
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
    const activityRefs = useRef([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            console.log('Initial geolocation:', position.coords);
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, (error) => {
            console.error('Geolocation error:', error);
            setLocation({ latitude: 34.0522, longitude: -118.2437 }); // Los Angeles as a fallback
        });
    }, []);

    useEffect(() => {
        setLocalActivities(activities);
        setLocalItinerary(itinerary);
    }, [activities, itinerary]);

    useEffect(() => {
        if (city) {
            fetchCoordinates(city);
        } else {
            setLocation({ latitude: 34.0522, longitude: -118.2437 }); 
        }
    }, [city]);
    
    const fetchCoordinates = async (city) => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;
        ;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results && data.results[0]) {
                const { lat, lng } = data.results[0].geometry.location;
                console.log('Fetched city location:', { lat, lng });
                setLocation({ latitude: lat, longitude: lng });
            }
        } catch (error) {
            console.error('Failed to fetch coordinates:', error);
        }
    };    

    useEffect(() => {
        fetchActivities();
    }, [city, activeTab, page]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
                console.log("Near bottom!");  
                setPage(prevPage => prevPage + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setLocalActivities(activities);  
        setLocalItinerary(itinerary);   
    }, [activities, itinerary]);
    useEffect(() => {
        setActivities([]);
        setPage(1);
    }, [activeTab]);
    
    const fetchActivities = useCallback(() => {
        if (!city) {
            console.error('City is not defined!');
            return;
        }
        let type = activeTab.toLowerCase().slice(0, -1); 
        const endpoint = `http://localhost:8000/api/${type}s/?city=${encodeURIComponent(city)}&page=${page}`;
        fetch(endpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const newActivities = data.results.map((activity, index) => ({
                    ...activity,
                    ref: activityRefs.current[index] || React.createRef(),
                    image: activity.photos && activity.photos[0]
                        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${activity.photos[0].photo_reference}&key=${apiKey}`
                        : 'path/to/default/image.jpg'
                }));
                setActivities(prevActivities => [...prevActivities, ...newActivities]);
                activityRefs.current = activities.map(activity => activity.ref || React.createRef());
            })
            .catch(error => console.error('Error fetching places:', error));
        }, [city, page, apiKey, activeTab, activities]); 
   
    const handleMarkerClick = index => {
        activityRefs.current[index]?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const handleDrop = (item, date) => {
        const dateKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        setItinerary(prev => ({
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), { name: item.name, image: item.image }]
        }));
    };

    const clearItinerary = () => {
        if (window.confirm('Are you sure you want to clear all itinerary items?')) {
            setItinerary({});
        }
    };

    const generateDateList = () => {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= new Date(endDate)) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const dateList = generateDateList();
    
    const handleSaveTrip = () => {
        const name = prompt("Please enter a name for your trip:", tripName || city || "My Trip");
        if (name && city && startDate && endDate) {
            const newTrip = {
                id: Date.now(), 
                name, 
                destination: city,
                startDate: startDate.toISOString().substring(0, 10),
                endDate: endDate.toISOString().substring(0, 10),
                activities: localActivities,
                itinerary: localItinerary
            };
            
            saveTrip(newTrip);  
            alert('Trip saved successfully!');
            navigate('/my-trips');
        } else {
            alert("Please ensure all trip details are filled.");
        }
    };    

    useEffect(() => {
        fetchActivities();  
    }, [page]); 
    
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="create-screen-container">
                <div className="tabs">
                    <button className={`tab ${activeTab === 'Landmarks' ? 'active' : ''}`} onClick={() => setActiveTab('Landmarks')}>Landmarks</button>
                    <button className={`tab ${activeTab === 'Restaurants' ? 'active' : ''}`} onClick={() => setActiveTab('Restaurants')}>Restaurants</button>
                    <button className={`tab ${activeTab === 'Hotels' ? 'active' : ''}`} onClick={() => setActiveTab('Hotels')}>Hotels</button>
                </div>
                <div className="main-content">
                    {activeTab === 'Landmarks' && (
                        <div className="explore-section">
                            <h1>Explore Landmarks in {city}</h1>
                            <div className="activities-list">
                                {activities.map((activity, index) => (
                                    <DraggableActivity key={index} activity={activity} ref={activityRefs.current[index]} />
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'Restaurants' && (
                        <div className="explore-section">
                            <h1>Explore Restaurants in {city}</h1>
                            <div className="activities-list">
                                {activities.map((activity, index) => (
                                    <DraggableActivity key={index} activity={activity} ref={activityRefs.current[index]} />
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'Hotels' && (
                        <div className="explore-section">
                            <h1>Explore Hotels in {city}</h1>
                            <div className="activities-list">
                                {activities.map((activity, index) => (
                                    <DraggableActivity key={index} activity={activity} ref={activityRefs.current[index]} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="itinerary-sidebar">
                        <div className="itinerary-header">
                            <h2>Your Itinerary</h2>
                            <button onClick={() => handleSaveTrip({})} className="clear-button">Save</button>
                            <button onClick={() => clearItinerary({})} className="clear-button">Clear</button>
                        </div>
                        {dateList.map((date, index) => (
                            <DroppableDate key={index} date={date} handleDrop={handleDrop}>
                                {(itinerary[date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })] || []).map((item, idx) => (
                                    <div key={idx} className="itinerary-item">
                                        <img src={item.image} alt={item.name} style={{ width: 50, height: 50, marginRight: 10 }}/>
                                        <p>{item.name}</p>
                                    </div>
                                ))}
                            </DroppableDate>
                        ))}
                    </div>
                    <div className="maps-sidebar">
                        <MapComponent 
                        latitude={location.latitude} 
                        longitude={location.longitude} 
                        activities={activities} 
                        onMarkerClick={handleMarkerClick} />
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

const DraggableActivity = React.forwardRef(({ activity }, ref) => {
    const [isOpen, setIsOpen] = useState(false); // State to control the visibility of the dropdown
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'activity',
        item: activity,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} className="activity" onClick={toggleOpen}>
            <div className="activity-header">
                <img src={activity.image} alt={activity.name} className="activity-image" />
                <div className="activity-info">
                    <h3>{activity.name}</h3>
                </div>
                <span className="dropdown-icon">{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
                <div className="activity-details">
                    <p><strong>Address:</strong> {activity.address || 'No address available'}</p>
                    <p><strong>Hours:</strong> {activity.hours || 'No hours available'}</p>
                    <p><strong>Rating:</strong> {activity.rating ? `${activity.rating} / 5` : 'No rating available'}</p>
                </div>
            )}
        </div>
    );
});

const DroppableDate = ({ date, handleDrop, children }) => {
    const [, drop] = useDrop(() => ({
        accept: 'activity',
        drop: (item) => handleDrop(item, date),
    }));

    return (
        <details ref={drop} className="itinerary-details">
            <summary>{date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</summary>
            {children.length === 0 && <p>Nothing here yet</p>}
            {children}
        </details>
    );
};

export default CreateScreen;
