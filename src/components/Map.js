import React, { useEffect, useRef } from 'react';

const MapComponent = ({ latitude, longitude, activities, onMarkerClick }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null); // Holds the map instance
    const markersRef = useRef([]);

    useEffect(() => {
        // Function to initialize or update map center
        function initializeOrUpdateMap() {
            if (window.google && mapRef.current) {
                if (!mapInstanceRef.current) {
                    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                        center: { lat: latitude, lng: longitude },
                        zoom: 12,
                    });
                } else {
                    mapInstanceRef.current.setCenter(new window.google.maps.LatLng(latitude, longitude));
                }
            }
        }

        // Initialize or update map when latitude or longitude changes
        initializeOrUpdateMap();

        // Update markers whenever activities change
        if (mapInstanceRef.current) {
            // Clear existing markers
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
    
            // Create new markers
            activities.forEach((activity, index) => {
                const marker = new window.google.maps.Marker({
                    position: { lat: activity.latitude, lng: activity.longitude },
                    map: mapInstanceRef.current,
                    title: activity.name,
                });
    
                marker.addListener('click', () => onMarkerClick(index));
                markersRef.current.push(marker);
            });
        }
    }, [latitude, longitude, activities, onMarkerClick]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapComponent;
