import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Staffdashboard.css";
import logoImage from "../../images/CCS.png";
import Subjects from "./subjects";
import List from "./list";

const StaffDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const [showUpdateAdministratorModal, setShowUpdateAdministratorModal] =
    useState(false);
    //eslint-disable-next-line
  const [searchTerm, setSearchTerm] = useState("");
  //eslint-disable-next-line
  const [searchResults, setSearchResults] = useState([]);
  //eslint-disable-next-line
  const [staffInfo, setStaffInfo] = useState({});
  //eslint-disable-next-line
  const [errorMessage, setErrorMessage] = useState("");

  const [updateAdminFormData, setupdateAdminFormData] = useState({
    Staff_Name: "",
    Email: "",
  });


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
  const handleLogout = () => {
    localStorage.removeItem("authToken");

    navigate("/");
  };
  return (
    <div>
      <nav className="navdashboard-container">
        <img src={logoImage} alt="Logo" className="logo-image" />
        <span className="logo-text">College of Computer Studies</span>
        <button onClick={() => handleSectionChange("dashboard")}>
          Dashboard
        </button>
        <button onClick={() => handleSectionChange("profile")}>Profile</button>
        <button onClick={() => handleSectionChange("subject")}>Subjects</button>
        <button onClick={() => handleSectionChange("list")}>
          List of Student
        </button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <div className="dashboard-container">
        {activeSection === "dashboard" && <h1>Welcome to the Dashboard!</h1>}
        {activeSection === "profile" && (
          <div>
            <h1>Administrator Information</h1>
            <button
              className="Update-button"
              onClick={handleOpenUpdateAdministratorModal}
            >
              Update Administrator
            </button>
            <p>Staff Name: {staffInfo.Staff_Name}</p>
            <p>Email: {staffInfo.Email}</p>
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
            <h2>Update Administrator Information</h2>
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
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default StaffDashboard;
