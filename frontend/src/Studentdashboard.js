import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Studentdashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/StudentLogin');
        }
    }, [navigate]);

    return (
        <div>
            <h1>Welcome to the Dashboard!</h1>
            {/* Add more dashboard content here */}
        </div>
    );
};

export default Studentdashboard;