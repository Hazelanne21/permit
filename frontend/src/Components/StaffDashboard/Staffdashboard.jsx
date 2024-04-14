import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Staffdashboard.css";
import logoImage from "../../images/CCS.png";
import Subjects from "./subjects";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import List from "./list";
import { jwtDecode } from "jwt-decode";
import { faUser } from '@fortawesome/free-solid-svg-icons';

const StaffDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const [showUpdateAdministratorModal, setShowUpdateAdministratorModal] =
    useState(false);
  //eslint-disable-next-line
  const [searchTerm, setSearchTerm] = useState("");
  //eslint-disable-next-line
  const [staffInfo, setStaffInfo] = useState({});
  //eslint-disable-next-line
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false); 

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

  //search button
  //eslint-disable-next-line
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // PROFILE
// eslint-disable-next-line
const toggleDropdown = () => {
  if (!isProfileModalOpen) {
      setDropdownOpen(!isDropdownOpen);
  }
};


const toggleProfileModal = () => {
  setProfileModalOpen(!isProfileModalOpen);
  setDropdownOpen(false);
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
  
  return (
    <div>
          <div className={`dropdown ${isProfileModalOpen ? 'disabled-dropdown' : ''}`}>
                <button className="dropbtn" onClick={toggleDropdown}>{decodedStaffName}</button>
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
        <button onClick={() => handleSectionChange("dashboard")}>
          Dashboard
        </button>
        <button onClick={() => handleSectionChange("subject")}>Subjects</button>
        <button onClick={() => handleSectionChange("list")}>Tuition Status</button>
      </nav>

      <div className="dashboard-container">
        {activeSection === "dashboard" && <h1>Welcome to the Dashboard!</h1>}
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
        <span className="staffProfile-close" onClick={toggleProfileModal}>&times;</span>
        <h2>Administrator Information  <i
          onClick={handleOpenUpdateAdministratorModal}
          className="staffProfile-update-button"
        >
          <FontAwesomeIcon icon={faEdit} />
        </i></h2>
        <p>Staff Name: {decodedStaffName}</p>
            <p>Email: {decodedStaffEmail}</p>
      </div>
    </div>
)}
    </div>
  );
};

export default StaffDashboard;
