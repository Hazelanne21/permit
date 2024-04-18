import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Staffdashboard.css";
import logoImage from "../../images/CCS.png";
import Subjects from "./subjects";
import List from "./list";
import StudentCreateAccount from "../StudentCreateAccount";
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line
import { faBell, faUser, faMoneyCheckAlt, faBook } from '@fortawesome/free-solid-svg-icons';




const StaffDashboard = () => {
  const [showModal, ssetShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const [showUpdateAdministratorModal, setShowUpdateAdministratorModal] =
    useState(false);
  //eslint-disable-next-line
  const [staffInfo, setStaffInfo] = useState({});
  //eslint-disable-next-line
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen] = useState(false); 

  const [updateAdminFormData, setupdateAdminFormData] = useState({
    Staff_Name: "",
    Email: "",
    Password: "",
  });

  //decode the token
  const token = sessionStorage.getItem("token");
  const decodedStaffName = jwtDecode(token).name;
  const decodedStaffEmail = jwtDecode(token).email;

  useEffect(() => {
    fetchStaffInfo();
  }, []);

  
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

// eslint-disable-next-line
const toggleDropdown = () => {
  if (!isProfileModalOpen) {
      setDropdownOpen(!isDropdownOpen);
  }
};



  //Update Administrator
  const handleOpenUpdateAdministratorModal = () => {
    setShowUpdateAdministratorModal(true);
  };
  const handleCloseUpdateAdministratorModal = () => {
    setShowUpdateAdministratorModal(false);
  };
  const handleUpdateAdminInputChange = (e) => {
    const { name, value } = e.target;
    setupdateAdminFormData({ ...updateAdminFormData, [name]: value });
  };

  const handleSubmitUpdateAdministrator = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/staff/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateAdminFormData),
      });
      if (response.ok) {
        console.log("Administrator updated successfully");
        handleCloseUpdateAdministratorModal();
      } else {
        console.error("Failed to update Administrator");
      }
    } catch (error) {
      console.error("Error updating administrator:", error);
    }
  };

  const fetchStaffInfo = async () => {
    try {
      const response = await fetch("/staff/getallstaff");
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setStaffInfo(data[0]);
        }
      } else {
        console.error("Failed to fetch staff info");
      }
    } catch (error) {
      console.error("Error fetching staff info:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");

    navigate("/");
  };


  const shandleCloseModal = () => {
    ssetShowModal(false);
  };
  
  const shandleCreateAccountClick = () => {
    ssetShowModal(true);
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
      <div className="nav-container">
          <div className={`dropdown ${isProfileModalOpen ? 'disabled-dropdown' : ''}`}>
                <button className="dropbtn" onClick={toggleDropdown}>{decodedStaffName}</button>
                {isDropdownOpen && (
                    <div className="dropdown-content">
                        <a href="#admin" onClick={handleOpenUpdateAdministratorModal}>Admin</a>
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
    <span className="logo-text" style={{ fontFamily: 'Verdana', fontSize: '18px', fontWeight: 'bold', color: 'black', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>College of Computer Studies</span>
    <button className="dashboard-button" onClick={() => handleSectionChange('dashboard')} style={{ backgroundColor: '#80ED99' }}>
      <FontAwesomeIcon icon={faBell} className="button-icon" />
      <span className="button-text">Announcement</span>
    </button>

      <button className="sa-button" onClick={shandleCreateAccountClick} style={{ backgroundColor: '#80ED99' }}>
        <FontAwesomeIcon icon={faUser} className="sa-icon" />  
        <span className="sa-text">Student Account </span>
      </button>
      <button className="sub-button" onClick={() => handleSectionChange("subject")} style={{ backgroundColor: '#80ED99' }}>
        <FontAwesomeIcon icon={faBook} className="sub-icon" />  
        <span className="sub-text">Subjects </span>
      </button>
      <button className="ts-button" onClick={() => handleSectionChange("list")} style={{ backgroundColor: '#80ED99' }}>
        <FontAwesomeIcon icon={faMoneyCheckAlt} className="ts-icon" /> 
        <span className="ts-text">Tuition Status </span>
      </button>

      </nav>


      <div className="dashboard-container" style={{ textAlign: "center" }}>
            {activeSection === 'dashboard' && (
            <div>
                <h1 style={{ fontFamily: 'Verdana', fontSize: '40px', fontWeight: 'bold', color: '#344e41', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                    Welcome to the Dashboard, {decodedStaffName}!
                    </h1>
              <div className="Instructors-info">
                <h2>Instructors</h2>
                {/* Insert dynamic content for instructor information here */}
              </div>
              {/* Container for courses offered */}
              <div className="Courses-info">
                <h2>Courses Offered</h2>
                {/* Insert dynamic content for courses offered here */}
              </div>
              {/* Container for number of students */}
              <div className="Students-info">
                <h2>Number of Students</h2>
                {/* Insert dynamic content for number of students here */}
              </div>
            </div>
        )}
        {activeSection === "StudentCreateAccount" && (
          <div>
            <StudentCreateAccount />
          </div>
        )}

        {activeSection === "subject" && (
          <div>
            <Subjects />
          </div>
        )}

        {activeSection === "list" && (
          <div>
            <List />
          </div>
        )}

        {showUpdateAdministratorModal && (
          <div className="umodal">
            <div className="umodal-content">
              <span
                className="uclose"
                onClick={handleCloseUpdateAdministratorModal}
              >
                &times;
              </span>
              <h2>Administrator Information</h2>
              <form onSubmit={handleSubmitUpdateAdministrator}>
                <label>Staff Name:</label>
                <input
                  type="text"
                  name="Staff_Name"
                  value={updateAdminFormData.Staff_Name}
                  onChange={handleUpdateAdminInputChange}
                />

                <label>Email:</label>
                <input
                  type="text"
                  name="Email"
                  value={updateAdminFormData.Email}
                  onChange={handleUpdateAdminInputChange}
                />

                <label>Password:</label>
                <input
                  type="text"
                  name="Password"
                  value={updateAdminFormData.Password}
                  onChange={handleUpdateAdminInputChange}
                />
                <button type="submit">Update</button>
              </form>
            </div>
          </div>
        )}
      </div>
      {isProfileModalOpen && (
  <div className="modal">
    <div className="staffProfile-modal-content">
        <span className="staffProfile-close" onClick={handleOpenUpdateAdministratorModal}>&times;</span>
        <h2>Admin Information</h2>
        <p>Staff Name: {decodedStaffName}</p>
            <p>Email: {decodedStaffEmail}</p>
      </div>
    </div>
)}

{showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={shandleCloseModal}>
              &times;
            </span>
            <div className="modal-header">
              <h2>Student Account</h2>
            </div>
            <div className="modal-body">
              <StudentCreateAccount />
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default StaffDashboard;
