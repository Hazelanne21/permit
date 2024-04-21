import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faDownload, faClipboardList, faChartBar, faInfoCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import './Studentdashboard.css';
import logoImage from '../images/CCS.png';
import Image from '../images/ncf.png';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Ai from '../images/Aii.png';

const StudentDashboard = () => {
    // eslint-disable-next-line
    const [studentInfo, setStudentInfo] = useState(null);
    // eslint-disable-next-line
    const [permits, setPermits] = useState([]);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isProfileModalOpen, setProfileModalOpen] = useState(false); 
    const [isDropdownOpen, setDropdownOpen] = useState(false); 
    const [isPermitModalOpen, setPermitModalOpen] = useState(false);
    const navigate = useNavigate(); 

    const token = sessionStorage.getItem("token");
    const decodedStudentName = jwtDecode(token).name;




  
    // LOGOUT
    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/');
    };


    // DROPDOWN PROFILE
    const toggleDropdown = () => {
        if (!isProfileModalOpen) {
            setDropdownOpen(!isDropdownOpen);
        }
    };


    // PERMIT
    
    const [permitFormData, setPermitFormData] = useState({
        examType: "",
        semester: "",
    });

    const handlePermitInputChange = (e) => {
        const { name, value } = e.target;
        setPermitFormData({ ...permitFormData, [name]: value });
    };

    const togglePermitModal = () => {
        console.log("Toggling permit modal");
        setPermitModalOpen(!isPermitModalOpen);
    };

    const handleSubmitPermit = () => {
        // Handle permit submission
        console.log("Permit submitted:", permitFormData);
        // Close the modal after submission
        setPermitModalOpen(false);
    };

    const [isPermitExampleOpen, setPermitExampleOpen] = useState(false);

    const togglePermitExample = () => {
        setPermitExampleOpen(!isPermitExampleOpen);
    };

    

    // PROFILE MODAL
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

    const toggleProfileModal = () => {
        console.log("Toggling profile modal");
        setProfileModalOpen(!isProfileModalOpen);
        setDropdownOpen(false);
    };

    const handleDownloadPermit = () => {
        // Implement the logic to download the permit
        console.log("Permit downloaded");
    };
    
    
    
    
    // COLLAPSE SIDE BAR
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

    // SIDE BAR
    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    

     
// FETCH STUDENT INFO & FETCH PERMIT
    const fetchStudentInfo = async () => {
    };

    const fetchPermits = async () => {
        try {
            const response = await axios.get('/permits/getPermits');
            setPermits(response.data);
        } catch (error) {
            console.error("Error fetching permits:", error);
            // Handle error, such as showing an error message to the user
        }
    };

    
  useEffect(() => {
    fetchStudentInfo();
    fetchPermits();
}, []);


    return (
        <div>
            {/* DROPDOWN */}
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
                {/* COLLAPSE SIDE BAR */}
                <div className="collapse-btn" onClick={toggleCollapse}>
                    <span></span>
                    <span></span>
                    <span></span>
                    </div>
                <img src={logoImage} alt="Logo" className="logo-image" />
                <span className="logo-text" style={{ fontFamily: 'Verdana', fontSize: '18px', fontWeight: 'bold', color: 'black', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>College of Computer Studies</span>
                <button className="dashboard-button" onClick={() => handleSectionChange('dashboard')} style={{ backgroundColor: '#80ED99' }}><FontAwesomeIcon icon={faChartBar} /> Dashboard </button>
                <button className="dashboard-button" onClick={() => handleSectionChange('permits')} style={{ backgroundColor: '#80ED99' }}><FontAwesomeIcon icon={faClipboardList} /> Permits </button>
                <button className= "dashboard-button" onClick={() => handleSectionChange('student')} style={{ backgroundColor: '#80ED99'}}> <FontAwesomeIcon icon={faInfoCircle} />  Students </button>
                <button onClick={handleLogout} style={{ marginTop: '190px' }}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</button>
             </nav>
             
            <div className="dashboard-container" style={{ textAlign: "center" }}>
            
            {activeSection === 'dashboard' && (
            <div>
                {/* <h1 style={{ fontFamily: 'Verdana', fontSize: '40px', fontWeight: 'bold', color: '#344e41', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                    Welcome to the Dashboard, {decodedStudentName}!
                    </h1> */}
                    <div style={{ backgroundColor: '#FDFFB6', borderRadius: '20px', padding: '90px', marginRight: '10px' }}>
                    <h2 style={{ fontFamily: 'Verdana', fontSize: '20px', fontWeight: 'bold', color: '#344e41' }}>
                      Welcome to the Dashboard, {decodedStudentName}!
                    </h2>
                    <img src={Ai} alt="jpg" style={{ maxWidth: '200px', borderRadius: '20px', marginLeft: '20px' }} />
                </div>
             </div>
            )}


                {activeSection === 'permits' && (
                    <div>
                        <h1 style={{ fontFamily: 'Verdana', fontSize: '40px', fontWeight: 'bold', color: '#344e41', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>Permits <FontAwesomeIcon icon={faDownload} className="download-icon" onClick={togglePermitExample} /></h1> 
                        <button onClick={togglePermitModal}>Request Permit</button>
                    </div>
                )}

{activeSection === 'student' && (
    <div>
        <h1 style={{ fontFamily: 'Verdana', fontSize: '40px', fontWeight: 'bold', color: '#344e41', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>Update Student Info</h1>
        
        <form style={{ maxWidth: '400px', margin: '0 auto' }}>
             <label style={{ display: 'block', marginTop: '10px' }}>Password:</label>
             <input type="password" name="password" style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '10px'}} />

             <label style={{ display: 'block', marginBottom: '10px'}}>Mobile Number:</label>
             <input type="tel" name="mobileNumber" style={{ width: '95%', padding: '8px', marginBottom: '15px', borderRadius: '10px'}} />

             <label style={{ display: 'block', marginBottom: '10px' }}>Year Level:</label>
             <input type="text" name="yearLevel" style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '10px' }} />

             <label style={{ display: 'block', marginBottom: '10px' }}>Semester:</label>
             <input type="text" name="semester" style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '10px'}} />
            
             <button type="submit" style={{ marginTop: '30px', width: '70%', padding: '10px', backgroundColor: '#344e41', color: 'white', border: 'none', borderRadius: '10px' }}>Submit</button>
        </form>

    </div>
)}

            </div>

            {isPermitExampleOpen && (
    <div className="modal">
        <div className="permit-content">
            <span className="permit-close" onClick={togglePermitExample}>&times;</span>
            <div className="modal-address">
                <img src={Image} alt="Logo" className="modal-logo" />
                <div>
                    <p className="address-text">Naga College Foundation</p>
                    <p className="address-text">Naga City, Camarines Sur</p>
                </div>
            </div>
            {permits.map((permit, index) => (
                <div key={index}>
                    <p>ID number of the student: {permit.Student_Number}</p>
                    <p>Examination: {permit.Exam}</p>
                    <p>Student's name: {permit.Student_Name}</p>
                    <p>Course and level: {permit.Year}</p >
                    <p>Semester: {permit.Semester}</p>
                    <p>List of Subjects:</p>
                    <ul>
                        {permit.Subjects.map((subject, index) => (
                            <li key={index}>{subject}</li>
                        ))}
                    </ul>
                    <p>Sequence number: {permit.SequenceNumber}</p>
                    <p>Released by: {permit.ReleasedBy}</p>
                    <button onClick={handleDownloadPermit}>Download Permit</button>
                </div>
            ))}
        </div>
    </div>
)}


                {/* PROFILE MODAL */}
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

            {/* REQUEST PERMIT MODAL */}
            {isPermitModalOpen && (
                <div className="modal">
                    <div className="permit-modal-content">
                        <span className="permit-close" onClick={togglePermitModal}>&times;</span>
                        <h2>Request Permit</h2>
                        <form onSubmit={handleSubmitPermit}>
                            <label>Exam:</label>
                            <select name="examType" value={permitFormData.examType} onChange={handlePermitInputChange} required>
                                <option value="">Select Exam Type</option>
                                <option value="Prelim">Prelim</option>
                                <option value="Midterm">Midterm</option>
                                <option value="Semifinals">Semifinals</option>
                                <option value="Finals">Finals</option>
                            </select>
                            <label>Semester:</label>
                            <select name="semester" value={permitFormData.semester} onChange={handlePermitInputChange} required>
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
