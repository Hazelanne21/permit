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
import "./Studentdashboard.css";
import logoImage from "../images/CCS.png";
import Image from "../images/ncf.png";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import tiger from "../images/rawr.png";

const StudentDashboard = () => {
  // eslint-disable-next-line
  const [studentInfo, setStudentInfo] = useState(null);
  // eslint-disable-next-line
  const [permits, setPermits] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isPermitModalOpen, setPermitModalOpen] = useState(false);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const decodedStudentName = jwtDecode(token).name;

  // LOGOUT
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
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
    showPassword: false, // Initialize showPassword to false
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
    const dashboardContainer = document.querySelector(".dashboard-container");
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
  const fetchStudentInfo = async () => {};

  const fetchPermits = async () => {
    try {
      const response = await axios.get("/permits/getPermits");
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
                backgroundColor: "#FDFFB6",
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
      <h3>Prelim <img src={logoImage} alt="Logo" className="prelim-image" /></h3>
      <p>2nd Semester</p>
      <button className="permit-view-button">View</button>
    </div>
    <div className="permit-midterm">
      <h3>Midterm <img src={logoImage} alt="Logo" className="midterm-image" /></h3>
      <p>2nd Semester</p>
      <button className="permit-view-button">View</button>
    </div>
  </div>
  <div className="permit-row">
    <div className="permit-semi">
      <h3>Semi Finals <img src={logoImage} alt="Logo" className="semi-image" /></h3>
      <p>2nd Semester</p>
      <button className="permit-view-button">View</button>
    </div>
    <div className="permit-final">
      <h3>Finals <img src={logoImage} alt="Logo" className="final-image" /></h3>
      <p>2nd Semester</p>
      <button className="permit-view-button">View</button>
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

      {isPermitExampleOpen && (
        <div className="modal">
          <div className="permit-content">
            <span className="permit-close" onClick={togglePermitExample}>
              &times;
            </span>
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
                <p>Course and level: {permit.Year}</p>
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

      {/* REQUEST PERMIT MODAL */}
      {isPermitModalOpen && (
        <div className="modal">
          <div className="permit-modal-content">
            <span className="permit-close" onClick={togglePermitModal}>
              &times;
            </span>
            <h2>Request Permit</h2>
            <form onSubmit={handleSubmitPermit}>
              <label>Exam:</label>
              <select
                name="examType"
                value={permitFormData.examType}
                onChange={handlePermitInputChange}
                required
              >
                <option value="">Select Exam Type</option>
                <option value="Prelim">Prelim</option>
                <option value="Midterm">Midterm</option>
                <option value="Semifinals">Semifinals</option>
                <option value="Finals">Finals</option>
              </select>
              <label>Semester:</label>
              <select
                name="semester"
                value={permitFormData.semester}
                onChange={handlePermitInputChange}
                required
              >
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