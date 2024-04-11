import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Staffdashboard.css";
import logoImage from "../../images/CCS.png";
import axios from "axios";
import Subjects from "./subjects";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

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
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [students, setStudents] = useState([]);

  const [updateAdminFormData, setupdateAdminFormData] = useState({
    Staff_Name: "",
    Email: "",
  });

  const [studentFormData, setStudentFormData] = useState({
    Student_Number: "",
    Prelim_Status: "",
    Midterm_Status: "",
    SemiFinal_Status: "",
    Final_Status: "",
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

  const handleOpenCreateStudentModal = () => {
    setShowCreateStudentModal(true);
  };

  const handleCloseCreateStudentModal = () => {
    setShowCreateStudentModal(false);
  };

  const handleStudentInputChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData({ ...studentFormData, [name]: value });
  };

  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/staff/createTuitionList",
        studentFormData
      );
      if (response.status === 201) {
        console.log("Student created successfully");
        const newStudent = response.data;
        setStudents([...students, newStudent]); // Update students state with the new student
        handleCloseCreateStudentModal();
      } else {
        console.error("Failed to create student");
      }
    } catch (error) {
      console.error("Error creating student:", error);
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
        body: JSON.stringify(studentFormData),
      });
      if (response.ok) {
        console.log("Administrator updated successfully");
        handleCloseCreateStudentModal();
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
                  onClick={handleOpenUpdateAdministratorModal}
                    className="Update-button"
                    >
                    <FontAwesomeIcon icon={faEdit} />
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
            <h1>List Of Student</h1>
            <input className="search-bar" placeholder="Search" />
           
           
            <button
              className="Student-button"
              onClick={handleOpenCreateStudentModal}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
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

      {showCreateStudentModal && (
        <div className="smodal">
          <div className="smodal-content">
            <span className="sclose" onClick={handleCloseCreateStudentModal}>
              &times;
            </span>
            <h2>Student Already Paid</h2>
            <form onSubmit={handleSubmitStudent}>
              <label>Student Number:</label>
              <input
                type="text"
                name="Student_Number"
                value={studentFormData.Student_Number}
                onChange={handleStudentInputChange}
              />
              <label>Prelim Status:</label>
              <input
                type="checkbox"
                name="Prelim_Status"
                checked={studentFormData.Prelim_Status}
                onChange={() =>
                  setStudentFormData({
                    ...studentFormData,
                    Prelim_Status: !studentFormData.Prelim_Status,
                  })
                }
              />
              <label>Midterm Status:</label>
              <input
                type="checkbox"
                name="Midterm_Status"
                checked={studentFormData.Midterm_Status}
                onChange={() =>
                  setStudentFormData({
                    ...studentFormData,
                    Midterm_Status: !studentFormData.Midterm_Status,
                  })
                }
              />
              <label>SemiFinal Status:</label>
              <input
                type="checkbox"
                name="SemiFinal_Status"
                checked={studentFormData.SemiFinal_Status}
                onChange={() =>
                  setStudentFormData({
                    ...studentFormData,
                    SemiFinal_Status: !studentFormData.SemiFinal_Status,
                  })
                }
              />
              <label>Final Status:</label>
              <input
                type="checkbox"
                name="Final_Status"
                checked={studentFormData.Final_Status}
                onChange={() =>
                  setStudentFormData({
                    ...studentFormData,
                    Final_Status: !studentFormData.Final_Status,
                  })
                }
              />
              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default StaffDashboard;
