import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Studentdashboard.css';
import logoImage from '../images/CCS.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faUser  } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

const StudentDashboard = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [permits, setPermits] = useState([]);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isProfileModalOpen, setProfileModalOpen] = useState(false); 
    const [isDropdownOpen, setDropdownOpen] = useState(false); 
    



    const token = sessionStorage.getItem("token");
    const decodedStudentName = jwtDecode(token).name;
    // const decodedStudentEmail = jwtDecode(token).email;


    const handleUpdateProfile = () => {
    };
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
        sessionStorage.removeItem('token');
        navigate('/');
    };


    // Function to toggle profile modal visibility
    const toggleProfileModal = () => {
        setProfileModalOpen(!isProfileModalOpen);
        // Close dropdown when profile modal is opened
        setDropdownOpen(false);
    };

    // Function to toggle dropdown visibility
    const toggleDropdown = () => {
        // Allow dropdown to be toggled only if profile modal is not open
        if (!isProfileModalOpen) {
            setDropdownOpen(!isDropdownOpen);
        }
    };

    return (
        <div>
            <div className={`dropdown ${isProfileModalOpen ? 'disabled-dropdown' : ''}`}>
                <button className="dropbtn" onClick={toggleDropdown}>{decodedStudentName} <FontAwesomeIcon icon={faUser} /></button>
                {isDropdownOpen && (
                    <div className="dropdown-content">
                        <a href="#profile" onClick={toggleProfileModal}>Profile</a>
                        <a href="#logout" onClick={handleLogout}>Logout</a>
                    </div>
                )}
            </div>

    

            <nav className="navdashboard-container">
                <img src={logoImage} alt="Logo" className="logo-image" />
                <span className="logo-text">College of Computer Studies</span>
                <button onClick={() => handleSectionChange('dashboard')}>Dashboard</button>
                <button onClick={() => handleSectionChange('permits')}>Permits</button>
    
            </nav>

            <div className="dashboard-container">
                {activeSection === 'dashboard' && (
                    <h1>Welcome to the Dashboard, {decodedStudentName}!</h1>
                )}
                {activeSection === 'permits' && (
                    
                    <ul>
                         <h1>Exam Permit   <FontAwesomeIcon icon={faEdit}/> </h1>
                        {permits.map((permit, index) => (
                            <li key={index}>
                                    
                                Exam: {permit.Exam}, Date Release: {permit.Date_Release}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Profile modal */}
            {isProfileModalOpen && (
    <div className="modal">
        <div className="studentProfile-modal-content">
            <span className="studentProfile-close" onClick={toggleProfileModal}>&times;</span>
            <h2>Profile  <i
                        onClick={() => handleUpdateProfile(studentInfo)}
                        className="StudentProfile-update-button"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </i></h2>
    
            <p>Student Name: {studentInfo && studentInfo.Student_Name}</p>
            <p>Gbox: {studentInfo && studentInfo.Gbox}</p>
            <p>Mobile Number: {studentInfo && studentInfo.Mobile_Number}</p>
            <p>Year: {studentInfo && studentInfo.Year_level}</p>
            {/* Add the update icon */}
          
        </div>
    </div>
)}
        </div>
    );
};

export default StudentDashboard;
