// src/components/Layout.js
import React from 'react';
import NavBar from './NavBar';

const Layout = ({ children }) => {
    return (
        <div>
            <NavBar />
            <div>{children}</div>  {/* This will render the content of the current page */}
        </div>
    );
};

export default Layout;
