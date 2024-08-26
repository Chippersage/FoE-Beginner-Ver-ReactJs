import React from 'react';
import "../../Styles/Header2.css";
import Logout from '../Logout/Logout';
import { useAuth } from '../Context/AuthContext';

const Header2 = () => {
    const { user } = useAuth();
    console.log("User data:", user);

    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logout clicked");
    };

    return (
        <div className="page-row header2">
            <h3 className="hellohead" style={{ fontSize: '18px', fontWeight: 'normal', color: '#262525' }}>
                {user ? `Hello, ${user.name}` : "Hello, Guest"}
            </h3>
            <div className="logout-button">
                {/* If you want to add a logout icon instead of the Logout component, uncomment the following line */}
                {/* <a href="#" className="logout-icon ui-link" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                </a> */}
            </div>
            {/* Include the Logout component */}
            <Logout />
        </div>
    );
};

export default Header2;
