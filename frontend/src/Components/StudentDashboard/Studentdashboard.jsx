import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faUser,
  faClipboardList,
  faChartBar,
  faInfoCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../StudentDashboard/Studentdashboard.css";
import logoImage from "../../images/CCS.png";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import tiger from "../../images/rawr.png";

const StudentDashboard = () => {
  // eslint-disable-next-line
  const [studentInfo, setStudentInfo] = useState(null);
  // eslint-disable-next-line
  const [permits, setPermits] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const decodedStudentName = jwtDecode(token).name;
  const student_id = jwtDecode(token).studentId;

  // LOGOUT
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };



 
  // PROFILE MODAL
  const [profileFormData, setProfileFormData] = useState({
    password: "",
    mobileNumber: "",
    yearLevel: "",
    Course: "",
    semester: "",
    showPassword: false,
  });
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData({ ...profileFormData, [name]: value });
  };

  const toggleProfileModal = () => {
    console.log("Toggling profile modal");
    setProfileModalOpen(!isProfileModalOpen);
    setDropdownOpen(false);
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/upStudents`, profileFormData);
      console.log("Profile data updated:", response.data);
      // Optionally, show a success message or perform any other action upon successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error, such as showing an error message to the user
    }
  };

 


  const toggleCollapse = () => {
    const navContainer = document.querySelector(".navdashboard-container");
    const permitContainer = document.querySelector(".permit-container");
    const headerPermit = document.querySelector(".headerpermit");
    const studentSection = document.querySelector(".student-section");
    const permitsSection = document.querySelector(".permits-section");

    navContainer?.classList.toggle("collapsed");
    permitContainer?.classList.toggle("collapsed");
    headerPermit?.classList.toggle("collapsed");
    studentSection?.classList.toggle("collapsed");
    permitsSection?.classList.toggle("collapsed");

    const isCollapsed = navContainer?.classList.contains("collapsed");
    const sdashboardContainer = document.querySelector(".sdashboard-container");
    if (isCollapsed) {
      sdashboardContainer.style.width = "calc(100% - 90px)";
    } else {
      sdashboardContainer.style.width = "calc(100% - 450px)";
    }

    // Toggle expansion of permit items
    const permitItems = document.querySelectorAll(".permit-item");
    permitItems.forEach((item) => {
      item.classList.toggle("expanded", !isCollapsed);
    });
  };

  // SIDE BAR
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  useEffect(() => {
    const fetchPermits = async () => {
      try {
        const response = await axios.get(
          `/permits/getPermits?student_id=${student_id}`
        );
        setPermits(response.data);
        console.log("Permits fetched:", response.data);
      } catch (error) {
        console.error("Error fetching permits:", error);
        // Handle error, such as showing an error message to the user
      }
    };

    fetchPermits();
  }, [student_id]);

  // PROFILE

  const storedPhoto = localStorage.getItem("selectedPhoto");
  const [selectedPhoto, setSelectedPhoto] = useState(storedPhoto);

  useEffect(() => {
    if (selectedPhoto) {
      localStorage.setItem("selectedPhoto", selectedPhoto);
    }
  }, [selectedPhoto]);

  const handlePhotoSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedPhoto(reader.result);
        togglePhotoSelection(); // Close the dropdown after selecting a photo
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected, reset the selected photo
      setSelectedPhoto(null);
    }
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isPhotoSelectionOpen, setPhotoSelectionOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setPhotoSelectionOpen(false);
  };

  const togglePhotoSelection = () => {
    setPhotoSelectionOpen(!isPhotoSelectionOpen);
    setDropdownOpen(false);
  };



  return (
    <div>
      <div className={`dropdown ${isDropdownOpen ? "active" : ""}`}>
        <button className="dropbtn" onClick={toggleDropdown}>
          {selectedPhoto ? (
            <img
              src={selectedPhoto}
              alt="Selected"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          ) : (
            <>
              {decodedStudentName} <FontAwesomeIcon icon={faUser} />
            </>
          )}
          <FontAwesomeIcon icon={faAngleDown} />
        </button>
        {/* Photo Selection Dropdown */}
        {isDropdownOpen && (
          <div className="dropdown-content">
            <label className="browse-btn" htmlFor="photo-upload">
              Choose Photo
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoSelection}
              style={{ display: "none" }} // Hide the input element
            />
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
        <span className="logo-text">College of Computer Studies</span>
        <button
          className="dashboard-button"
          onClick={() => handleSectionChange("dashboard")}
        >
          <FontAwesomeIcon icon={faChartBar} /> Dashboard{" "}
        </button>
        <button
          className="dashboard-button"
          onClick={() => handleSectionChange("permits")}
        >
          <FontAwesomeIcon icon={faClipboardList} /> Permits{" "}
        </button>
        <button
          className="dashboard-button"
          onClick={() => handleSectionChange("student")}
        >
          {" "}
          <FontAwesomeIcon icon={faInfoCircle} /> Students{" "}
        </button>
        <button onClick={handleLogout} style={{ marginTop: "200px" }}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </nav>

      <div className="sdashboard-container" style={{ textAlign: "center" }}>
        {activeSection === "dashboard" && (
          <div>
            <div
              style={{
                backgroundColor: "#94929df6",
                borderRadius: "40px",
                padding: "50px",
                marginRight: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontFamily: "Verdana",
                  fontSize: "40px",
                  fontWeight: "bold",
                  color: "#344e41",
                }}
              >
                Welcome to the Dashboard, {decodedStudentName}!
              </h2>
              <img
                className="-image"
                src={tiger}
                alt="jpg"
                style={{
                  width: "180px",
                  borderRadius: "10px",
                  marginLeft: "200px",
                }}
              />
            </div>
          </div>
        )}
      </div>
      {activeSection === "permits" && (
  <div className="permits-section">
    <h1 className="headerpermit">Permits</h1>
    <div className="permit-container">
  <div className="permit-row">
    <div className="permit-prelim">
      <h3>Prelim </h3>
      <p>2nd Semester</p>
      <button className="prelim-view-button">View</button>
    </div>
    <div className="permit-midterm">
      <h3>Midterm </h3>
      <p>2nd Semester</p>
      <button className="midterm-view-button">View</button>
    </div>
  </div>
  <div className="permit-row">
    <div className="permit-semi">
      <h3>Semi Finals </h3>
      <p>2nd Semester</p>
      <button className="semi-view-button">View</button>
    </div>
    <div className="permit-final">
      <h3>Finals </h3>
      <p>2nd Semester</p>
      <button className="final-view-button">View</button>
    </div>
  </div>
</div>

  </div>
)}

      {activeSection === "student" && (
        <div className="student-section">
          <h2 className="headerstudent">Update Student Information</h2>

          <form>
            <label className="student-label">Password:</label>
            <input type="pass" name="password" className="student-input" />

            <label className="student-label">Mobile Number:</label>
            <input type="tel" name="mobileNumber" className="student-input" />

            <label className="student-label">Year Level:</label>
            <select name="yearLevel" className="student-input2">
              <option value="">Select Year Level</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>

            <label className="student-label">Course:</label>
            <select name="Course" className="student-input2">
              <option value="">Select Course</option>
              <option value="1">BSCS</option>
              <option value="2">BSIS</option>
            </select>

            <label className="student-label">Semester:</label>
            <select name="semester" className="student-input2">
              <option value="">Select Semester</option>
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
              <option value="3">Summer</option>
            </select>

            <button type="submit" className="student-submit-button">
              Submit
            </button>
          </form>
        </div>
      )}

     

      {/* PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="modal">
          <div className="profile-modal-content">
            <span className="profile-close" onClick={toggleProfileModal}>
              &times;
            </span>
            <h2>Update Student Information</h2>
            <form onSubmit={handleSubmitProfile}>
  <label>Password:</label>
  <div className="password-input-container">
    <input
      type={profileFormData.showPassword ? "text" : "password"}
      name="password"
      value={profileFormData.password}
      onChange={handleProfileInputChange}
    />
    <i
      className={`fas ${
        profileFormData.showPassword ? "fa-eye-slash" : "fa-eye"
      }`}
      onClick={() =>
        setProfileFormData({
          ...profileFormData,
          showPassword: !profileFormData.showPassword,
        })
      }
    ></i>
  </div>
  <label>Mobile Number:</label>
  <input
    type="text"
    name="mobileNumber"
    value={profileFormData.mobileNumber}
    onChange={handleProfileInputChange}
  />
  <label>Year Level:</label>
  <input
    type="text"
    name="yearLevel"
    value={profileFormData.yearLevel}
    onChange={handleProfileInputChange}
  />
  <label>Semester:</label>
  <input
    type="text"
    name="semester"
    value={profileFormData.semester}
    onChange={handleProfileInputChange}
  />
  <button className="student-submit-button" type="submit">
    Submit
  </button>
</form>

          </div>
        </div>
      )}

    
    </div>
  );
};

export default StudentDashboard;
