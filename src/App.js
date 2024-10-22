// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TripProvider } from './contexts/TripContext';
import Layout from './components/Layout';
import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';
import ProfileScreen from './screens/ProfileScreen';
import BookScreen from './screens/BookScreen';
import MyTripsScreen from './screens/MyTripsScreen';

const App = () => {
    return (
        <Router>
            <TripProvider>  {/* Wrap everything inside TripProvider */}
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/create" element={<CreateScreen />} />
                        <Route path="/book" element={<BookScreen />} />
                        <Route path="/profile" element={<ProfileScreen />} />
                        <Route path="/my-trips" element={<MyTripsScreen />} />
                        {/* Add other routes here if needed */}
                    </Routes>
                </Layout>
            </TripProvider>
        </Router>
    );
};

export default App;
