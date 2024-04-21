import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Staffdashboard.css";
import logoImage from "../../images/CCS.png";
import Subjects from "./subjects";
import List from "./list";
import StudentCreateAccount from "../StudentCreateAccount";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faAdd, faBell, faUser, faMoneyCheckAlt, faBook } from '@fortawesome/free-solid-svg-icons';

const StaffDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const [showUpdateAdministratorModal, setShowUpdateAdministratorModal] = useState(false);
  // eslint-disable-next-line 
  const [staffInfo, setStaffInfo] = useState({});
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen] = useState(false); 
 

  // Decode the token
  const token = sessionStorage.getItem("token");
  const decodedStaffName = jwtDecode(token).name;
  const decodedStaffEmail = jwtDecode(token).email;

  useEffect(() => {
    fetchStaffInfo();
  }, []);

  const [updateAdminFormData, setUpdateAdminFormData] = useState({
    Staff_Name: "",
    Email: "",
    Password: "",
  });

  // INSTRUCTOR
  const [ishowModal, setIShowModal] = useState(false);
  const [instructorInput, setInstructorInput] = useState({
    name: "",
    position: "",
  });

  const handleOpenModal = (instructor) => {
    setIShowModal(true);
  };

  // eslint-disable-next-line 
  const handleCloseModal = () => {
    setIShowModal(false);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInstructorInput({ ...instructorInput, [name]: value });
  };




  // eslint-disable-next-line 
  const handleSaveInstructorToLocalStorage = (newInstructor) => {
    const updatedInstructors = [...instructors, newInstructor];
    setInstructors(updatedInstructors);
    localStorage.setItem("instructors", JSON.stringify(updatedInstructors));
  };



  const [instructors, setInstructors] = useState(() => {
    const storedInstructors = localStorage.getItem("instructors");
    return storedInstructors ? JSON.parse(storedInstructors) : [];
  });

  

  const handleSaveInstructor = () => {
    // Construct the new instructor object
    const newInstructor = {
      name: instructorInput.name,
      position: instructorInput.position
    };
  
    // Update the list of instructors
    const updatedInstructors = [...instructors, newInstructor];
    setInstructors(updatedInstructors);
  
    // Save to local storage
    localStorage.setItem("instructors", JSON.stringify(updatedInstructors));
  
    // Close the modal
    setIShowModal(false);
  };


  const handleDeleteInstructor = (index) => {
    const updatedInstructors = [...instructors];
    updatedInstructors.splice(index, 1); // Remove the instructor at the specified index
    setInstructors(updatedInstructors); // Update the state
  
    // Update local storage
    localStorage.setItem("instructors", JSON.stringify(updatedInstructors));
  };
  
  

  // COURSE
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseInput, setCourseInput] = useState({
    name: "",
  });

  const handleOpenCourseModal = () => {
    setCourseModalOpen(true);
  };

  const handleCloseCourseModal = () => {
    setCourseModalOpen(false);
  };

  const handleCourseInputChange = (e) => {
    const { name, value } = e.target;
    setCourseInput({ ...courseInput, [name]: value });
  };




  // Inside the StaffDashboard component

// COURSE
const [courses, setCourses] = useState([]);

const handleSaveCourse = () => {
  // Construct the new course object
  const newCourse = {
    name: courseInput.name
  };

  // Update the list of courses
  setCourses([...courses, newCourse]);

  // Save to local storage
  localStorage.setItem("courses", JSON.stringify([...courses, newCourse]));

  // Close the modal
  setCourseModalOpen(false);
};

const handleDeleteCourse = (index) => {
  const updatedCourses = [...courses];
  updatedCourses.splice(index, 1); // Remove the course at the specified index
  setCourses(updatedCourses); // Update the state

  // Update local storage
  localStorage.setItem("courses", JSON.stringify(updatedCourses));
};


useEffect(() => {
  const storedCourses = localStorage.getItem("courses");
  if (storedCourses) {
    setCourses(JSON.parse(storedCourses));
  }
}, []);


  // STUDENTS
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [numberOfStudents, setNumberOfStudents] = useState("");

  const handleOpenStudentsModal = () => {
    setStudentsModalOpen(true);
  };

  const handleCloseStudentsModal = () => {
    setStudentsModalOpen(false);
  };

  const handleStudentsInputChange = (e) => {
    const { value } = e.target;
    setNumberOfStudents(value);
  };

  const handleSaveNumberOfStudents = () => {
    console.log("Number of Students:", numberOfStudents);
    setStudentsModalOpen(false);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const toggleDropdown = () => {
    if (!isProfileModalOpen) {
      setDropdownOpen(!isDropdownOpen);
    }
  };

  const handleOpenUpdateAdministratorModal = () => {
    setShowUpdateAdministratorModal(true);
  };

  const handleCloseUpdateAdministratorModal = () => {
    setShowUpdateAdministratorModal(false);
  };

  const handleUpdateAdminInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateAdminFormData({ ...updateAdminFormData, [name]: value });
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
    setShowModal(false);
    setIShowModal(false);
  };
  
  const shandleCreateAccountClick = () => {
    setShowModal(true);
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
          <span className="logo-text">College of Computer Studies</span>
          <button className="dashboard-button" onClick={() => handleSectionChange("dashboard")}>
            <FontAwesomeIcon icon={faBell} className="button-icon" />
            <span className="button-text">Dashboard</span>
          </button>
          <button className="sa-button" onClick={shandleCreateAccountClick}>
            <FontAwesomeIcon icon={faUser} className="sa-icon" />  
            <span className="sa-text">Student Account </span>
          </button>
          <button className="sub-button" onClick={() => handleSectionChange("subject")}>
            <FontAwesomeIcon icon={faBook} className="sub-icon" />  
            <span className="sub-text">Subjects </span>
          </button>
          <button className="ts-button" onClick={() => handleSectionChange("list")}>
            <FontAwesomeIcon icon={faMoneyCheckAlt} className="ts-icon" /> 
            <span className="ts-text">Tuition Status </span>
          </button>
        </nav>

        <div className="dashboard-container">
          {activeSection === "dashboard" && (
            <div>
              <h1>Welcome to the Dashboard, {decodedStaffName}!</h1>
              <div className="Instructors-info">
              <h2>Instructors   <FontAwesomeIcon
                icon={faAdd}
                className="info-icon"
                onClick={() => handleOpenModal("instructors")}
              /></h2>
              <ul>
                {instructors.map((instructor, index) => (
                  <li key={index}>{instructor.name} - {instructor.position}
                   <FontAwesomeIcon
                icon={faTrash}
                className="delete-icon"
                onClick={() => handleDeleteInstructor(index)}
              />
      </li>
                ))}
              </ul>
            </div>

            <div className="Courses-info">
      <h2>Courses Offered   <FontAwesomeIcon
        icon={faAdd}
        className="info-icon"
        onClick={handleOpenCourseModal}
      /></h2>
      <ul>
        {courses.map((course, index) => (
          <li key={index}>{course.name}
            <FontAwesomeIcon
              icon={faTrash}
              className="delete-icon"
              onClick={() => handleDeleteCourse(index)}
            />
          </li>
        ))}
      </ul>
    </div>

            <div className="Students-info">
              <h2>Number of Students       
                <FontAwesomeIcon
                icon={faAdd}
                className="info-icon"
                onClick={handleOpenStudentsModal}
              /></h2>
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

        {ishowModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={shandleCloseModal}>
                &times;
              </span>
              <div className="modal-header">
                <h2>Instructor Information</h2>
              </div>
              <div className="modal-body">
              <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={instructorInput.name}
                onChange={handleInputChange} required
              />
            </div>

                <div>
                  <label>Position:</label>
                  <input
                    type="text"
                    name="position"
                    value={instructorInput.position}
                    onChange={handleInputChange}
                  />
                </div>
                <button onClick={handleSaveInstructor}>Save</button>
              </div>
            </div>
          </div>
        )}

        {courseModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseCourseModal}>&times;</span>
              <div className="modal-header">
                <h2>Course Information</h2>
              </div>
              <div className="modal-body">
                <div>
                  <label>Course Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={courseInput.name}
                    onChange={handleCourseInputChange}
                    required
                  />

                  
                </div>
                {/* Add further input fields for course information as needed */}
                <button onClick={handleSaveCourse}>Save</button>
              </div>
            </div>
          </div>
        )}

        {studentsModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseStudentsModal}>&times;</span>
              <div className="modal-header">
                <h2>Number of Students</h2>
              </div>
              <div className="modal-body">
                <div>
                  <label>Number of Students:</label>
                  <input
                    type="text"
                    value={numberOfStudents}
                    onChange={handleStudentsInputChange}
                    required
                  />
                </div>
                {/* Add further input fields for students information as needed */}
                <button onClick={handleSaveNumberOfStudents}>Save</button>
              </div>
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
