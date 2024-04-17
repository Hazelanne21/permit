import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Studentdashboard.css';
import logoImage from '../images/CCS.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

const StudentDashboard = () => {
    // eslint-disable-next-line
    const [studentInfo, setStudentInfo] = useState(null);
    // eslint-disable-next-line
    const [permits, setPermits] = useState([]);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isProfileModalOpen, setProfileModalOpen] = useState(false); 
    const [isDropdownOpen, setDropdownOpen] = useState(false); 
    const [isPermitModalOpen, setPermitModalOpen] = useState(false);
    const [permitFormData, setPermitFormData] = useState({
        examType: "",
        semester: "",
    });



    
    const token = sessionStorage.getItem("token");
    const decodedStudentName = jwtDecode(token).name;

    const navigate = useNavigate(); 

    useEffect(() => {
        fetchStudentInfo();
        fetchPermits();
    }, []);

    const fetchStudentInfo = async () => {
        // Fetch student info
    };

    const fetchPermits = async () => {
        // Fetch permits
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/');
    };


    const toggleDropdown = () => {
        if (!isProfileModalOpen) {
            setDropdownOpen(!isDropdownOpen);
        }
    };

    const [profileFormData, setProfileFormData] = useState({
        password: "",
        mobileNumber: "",
        yearLevel: "",
        semester: "",
        showPassword: false // Initialize showPassword to false
    });
    

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileFormData({ ...profileFormData, [name]: value });
    };
    

    const handleSubmitProfile = () => {
        // Handle profile update submission
        console.log("Profile data submitted:", profileFormData);
        // Close the modal after submission
        setProfileModalOpen(false);
    };


    const handlePermitInputChange = (e) => {
        const { name, value } = e.target;
        setPermitFormData({ ...permitFormData, [name]: value });
    };

    const handleSubmitPermit = () => {
        // Handle permit submission
        console.log("Permit submitted:", permitFormData);
        // Close the modal after submission
        setPermitModalOpen(false);
    };


    const toggleProfileModal = () => {
        console.log("Toggling profile modal");
        setProfileModalOpen(!isProfileModalOpen);
        setDropdownOpen(false);
    };
    
    const togglePermitModal = () => {
        console.log("Toggling permit modal");
        setPermitModalOpen(!isPermitModalOpen);
    };

    
  const toggleCollapse = () => {
    const navContainer = document.querySelector(".navdashboard-container");
    const dashboardContainer = document.querySelector(".dashboard-container");
  
    navContainer.classList.toggle("collapsed");
  
    const isCollapsed = navContainer.classList.contains("collapsed");
    if (isCollapsed) {
      dashboardContainer.style.width = "calc(100% - 90px)"; 
    } else {
      dashboardContainer.style.width = "calc(100% - 450px)"; 
    } 
  };
    
    return (
        <div>
            <div className={`dropdown ${isProfileModalOpen ? 'disabled-dropdown' : ''}`}>
                <button className="dropbtn" onClick={toggleDropdown}>{decodedStudentName} <FontAwesomeIcon icon={faUser} /></button>
                {isDropdownOpen && (
                    <div className="dropdown-content">
                        <a href="#profile" onClick={toggleProfileModal}>Student</a>
                        <a href="#logout" onClick={handleLogout}>Logout</a>
                    </div>
                )}
            </div>

            <nav className="navdashboard-container">
                <div className="collapse-btn" onClick={toggleCollapse}>
                    <span></span>
                    <span></span>
                    <span></span>
                    </div>
                <img src={logoImage} alt="Logo" className="logo-image" />
                <span className="logo-text">College of Computer Studies</span>
                <button onClick={() => handleSectionChange('dashboard')}>Dashboard</button>
                <button onClick={() => handleSectionChange('permits')}>Permits</button>
            </nav>

            <div className="dashboard-container" style={{ textAlign: "center" }}>
                {activeSection === 'dashboard' && (
                    <h1>Welcome to the Dashboard, {decodedStudentName}!</h1>
                )}
                {activeSection === 'permits' && (
                    <div>
                        <h1>Permits</h1>
                        <button onClick={togglePermitModal}>Request Permit</button>
                        <ul>
                            {permits.map((permit) => (
                                <li key={permit._id}>
                                    <p>Subject: {permit.Subject}</p>
                                    <p>Section: {permit.Section}</p>
                                    <p>Status: {permit.Status}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

               {isProfileModalOpen && (
                <div className="modal">
                    <div className="profile-modal-content">
                        <span className="profile-close" onClick={toggleProfileModal}>&times;</span>
                        <h2>Update Student Information</h2>
                        <form onSubmit={handleSubmitProfile}>
                        <label>Password:</label>
                            <div className="password-input-container">
                                <input type={profileFormData.showPassword ? "text" : "password"} name="password" value={profileFormData.password} onChange={handleProfileInputChange} />
                                <i className={`fas ${profileFormData.showPassword ? "fa-eye-slash" : "fa-eye"}`} onClick={() => setProfileFormData({ ...profileFormData, showPassword: !profileFormData.showPassword })}></i>
                            </div>


                            <label>Mobile Number:</label>
                            <input type="text" name="mobileNumber" value={profileFormData.mobileNumber} onChange={handleProfileInputChange} />
                            <label>Year Level:</label>
                            <input type="text" name="yearLevel" value={profileFormData.yearLevel} onChange={handleProfileInputChange} />
                            <label>Semester:</label>
                            <input type="text" name="semester" value={profileFormData.semester} onChange={handleProfileInputChange} />
                            <button className="student-submit-button" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Permit modal */}
            {isPermitModalOpen && (
                <div className="modal">
                    <div className="permit-modal-content">
                        <span className="permit-close" onClick={togglePermitModal}>&times;</span>
                        <h2>Request Permit</h2>
                        <form onSubmit={handleSubmitPermit}>
                            <label>Exam Type:</label>
                            <select name="examType" value={permitFormData.examType} onChange={handlePermitInputChange}>
                                <option value="">Select Exam Type</option>
                                <option value="Prelim">Prelim</option>
                                <option value="Midterm">Midterm</option>
                                <option value="Semifinals">Semifinals</option>
                                <option value="Finals">Finals</option>
                            </select>
                            <label>Semester:</label>
                            <select name="semester" value={permitFormData.semester} onChange={handlePermitInputChange}>
                                <option value="">Select Semester</option>
                                <option value="1">1st Semester</option>
                                <option value="2">2nd Semester</option>
                                <option value="3">Summer</option>
                            </select>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
