import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Studentdashboard.css';
import logoImage from '../images/CCS.png';

const StudentDashboard = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [permits, setPermits] = useState([]);
    const [activeSection, setActiveSection] = useState('dashboard');
    const navigate = useNavigate(); 

    useEffect(() => {
        // Fetch student info and permits using backend API
        fetchStudentInfo();
        fetchPermits();
    }, []);

    const fetchStudentInfo = async () => {
        try {
            const response = await fetch('/students/getStudents', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setStudentInfo(data);
            } else {
                throw new Error('Failed to fetch student info');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPermits = async () => {
        try {
            const response = await fetch('/permits/getPermits', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPermits(data);
            } else {
                throw new Error('Failed to fetch permits');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        
        navigate('/'); 
    };

    return (
        <div>
            <nav className="navdashboard-container">
            <img src={logoImage} alt="Logo" className="logo-image" />
            <span className="logo-text">College of Computer Studies</span>
                <button onClick={() => handleSectionChange('dashboard')}>Dashboard</button>
                <button onClick={() => handleSectionChange('profile')}>Profile {studentInfo && studentInfo.Student_Name}</button>
                <button onClick={() => handleSectionChange('permits')}>Permits</button>
                <button onClick={handleLogout}>Logout</button>
            </nav>
            <div className="dashboard-container">
                {activeSection === 'dashboard' && (
                    <h1>Welcome to the Dashboard, {studentInfo && studentInfo.Student_Name}!</h1>
                )}
                {activeSection === 'profile' && (
                    <h1>Profile Content Goes Here</h1>
                )}
                {activeSection === 'permits' && (
                    <ul>
                        {permits.map((permit, index) => (
                            <li key={index}>
                                Exam: {permit.Exam}, Date Release: {permit.Date_Release}
                            </li>
                        ))}
                    </ul>
                )}
              
            </div>
        </div>
    );
};

export default StudentDashboard;
