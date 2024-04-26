import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Staffdashboard.css";
import logoImage from "../../images/CCS.png";
import Subjects from "./subjects";
import List from "./list";
import StudentCreateAccount from "../StudentCreateAccount";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import tiger from "../../images/rawr.png";
import {
  faSignOutAlt,
  faAngleDown,
  faTrash,
  faAdd,
  faBell,
  faUser,
  faMoneyCheckAlt,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const StaffDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const [showUpdateAdministratorModal, setShowUpdateAdministratorModal] =
    useState(false);
  // eslint-disable-next-line
  const [staffInfo, setStaffInfo] = useState({});
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

  const [instructors, setInstructors] = useState(() => {
    const storedInstructors = localStorage.getItem("instructors");
    return storedInstructors ? JSON.parse(storedInstructors) : [];
  });

  const handleSaveInstructor = () => {
    const existingInstructor = instructors.find(
      (instructor) => instructor.name === instructorInput.name
    );

    if (existingInstructor) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Instructor already exists!",
      });
      return;
    }
    const newInstructor = {
      name: instructorInput.name,
      position: instructorInput.position,
    };

    const updatedInstructors = [...instructors, newInstructor];
    setInstructors(updatedInstructors);

    localStorage.setItem("instructors", JSON.stringify(updatedInstructors));

    setIShowModal(false);

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Instructor saved successfully",
    });
  };

  const handleDeleteInstructor = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this instructor. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedInstructors = [...instructors];
        updatedInstructors.splice(index, 1);
        setInstructors(updatedInstructors);
        localStorage.setItem("instructors", JSON.stringify(updatedInstructors));
        Swal.fire("Deleted!", "The instructor has been deleted.", "success");
      }
    });
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
    const isCourseExist = courses.some(
      (course) => course.name === courseInput.name
    );
    if (isCourseExist) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "This course already exists!",
      });
      return; // Stop execution if the course already exists
    }
    const newCourse = {
      name: courseInput.name,
    };
    setCourses([...courses, newCourse]);
    localStorage.setItem("courses", JSON.stringify([...courses, newCourse]));
    setCourseModalOpen(false);

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Course saved successfully",
    });
  };

  const handleDeleteCourse = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this course. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCourses = [...courses];
        updatedCourses.splice(index, 1);
        setCourses(updatedCourses);
        localStorage.setItem("courses", JSON.stringify(updatedCourses));
        Swal.fire("Deleted!", "The course has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    const storedCourses = localStorage.getItem("courses");
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    }
  }, []);

  // STUDENTS
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);



  const handleCloseStudentsModal = () => {
    setStudentsModalOpen(false);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Inside the StaffDashboard component

  // Initialize state for the number of students
  const [numberOfStudents, setNumberOfStudents] = useState("");

  const handleSaveNumberOfStudents = () => {
    // Convert the number of students to a number
    const numberOfStudentsInt = parseInt(numberOfStudents, 10);

    // Check if numberOfStudentsInt is a valid number
    if (!isNaN(numberOfStudentsInt)) {
      // Save the number of students to localStorage
      localStorage.setItem("numberOfStudents", numberOfStudentsInt);
      // Close the modal
      setStudentsModalOpen(false);
    } else {
      // Display an error message if the input is not a valid number
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a valid number for the number of students!",
      });
    }
  };

  // Function to handle changes in the number of students input
  const handleStudentsInputChange = (e) => {
    // Update the state with the input value
    setNumberOfStudents(e.target.value);
  };

  useEffect(() => {
    const storedNumberOfStudents = localStorage.getItem("numberOfStudents");
    if (storedNumberOfStudents) {
      setNumberOfStudents(storedNumberOfStudents);
    }
  }, []);



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
        // Display success message using SweetAlert
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Administrator updated successfully",
        });
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

  // eslint-disable-next-line
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

  // PROFILE
  const [isPhotoSelectionOpen, setPhotoSelectionOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(() => {
    const storedPhoto = localStorage.getItem("selectedPhoto");
    return storedPhoto ? storedPhoto : null;
  });
  
  const handlePhotoSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedPhoto(reader.result);
        // Store the selected photo in local storage
        localStorage.setItem("selectedPhoto", reader.result);
        togglePhotoSelection(); // Close the dropdown after selecting a photo
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected, reset the selected photo and remove it from local storage
      setSelectedPhoto(null);
      localStorage.removeItem("selectedPhoto");
    }
  };
  
  // Function to toggle the photo selection dropdown
  const togglePhotoSelection = () => {
    setPhotoSelectionOpen(!isPhotoSelectionOpen);
  };
  

  return (
    <div>
      <div className="nav-container">
      <div className={`dropdown ${isPhotoSelectionOpen ? "active" : ""}`}>
        <button className="dropbtn" onClick={togglePhotoSelection}>
          {selectedPhoto ? (
            <img
              src={selectedPhoto}
              alt="Selected"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          ) : (
            <>
        <FontAwesomeIcon icon={faUser} />
            </>
          )}
          <FontAwesomeIcon icon={faAngleDown} />
        </button>
        {/* Photo Selection Dropdown */}
        {isPhotoSelectionOpen && (
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
          <div className="collapse-btn" onClick={toggleCollapse}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <img src={logoImage} alt="Logo" className="logo-image" />
          <span className="logo-text">College of Computer Studies</span>
          <button
            className="dashboard-button1"
            onClick={() => handleSectionChange("dashboard")}
          >
            <FontAwesomeIcon icon={faBell} className="button-icon" />
            <span className="button-text">Dashboard</span>
          </button>
          <button className="sa-button" onClick={shandleCreateAccountClick}>
            <FontAwesomeIcon icon={faUser} className="sa-icon" />{" "}
            <span className="sa-text">Student Account </span>
          </button>
          <button
            className="sub-button"
            onClick={() => handleSectionChange("subject")}
          >
            <FontAwesomeIcon icon={faBook} className="sub-icon" />{" "}
            <span className="sub-text">Subjects </span>
          </button>
          <button
            className="ts-button"
            onClick={() => handleSectionChange("list")}
          >
            <FontAwesomeIcon icon={faMoneyCheckAlt} className="ts-icon" />{" "}
            <span className="ts-text">Tuition Status </span>
          </button>
          <button
            className="ad-button"
            onClick={handleOpenUpdateAdministratorModal}
          >
            <FontAwesomeIcon icon={faUser} className="ts-icon2"/> {" "} <span className="ts-text2">Admin </span>
          </button>
          <button onClick={handleLogout} className="logout-button">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </nav>

        <div className="dashboard-container" style={{ textAlign: "center", backgroundColor: "#FAFBF6"}}>
          {activeSection === "dashboard" && (
            <div> <div
              style={{
                backgroundColor: "#94929df6",
                borderRadius: "40px",
                padding: "30px",
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
                Welcome to the Dashboard, {decodedStaffName}!
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

              <div className="Instructors-info">
                <h2>
                  Instructors{" "}
                  <FontAwesomeIcon
                    icon={faAdd}
                    className="info-icon"
                    onClick={() => handleOpenModal("instructors")}
                  />
                </h2>
                <ul>
                  {instructors.map((instructor, index) => (
                    <li key={index}>
                      {instructor.name} - {instructor.position}
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
                <h2>
                  Courses Offered{" "}
                  <FontAwesomeIcon
                    icon={faAdd}
                    className="info-icon"
                    onClick={handleOpenCourseModal}
                  />
                </h2>
                <ul>
                  {courses.map((course, index) => (
                    <li key={index}>
                      {course.name}
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="delete-icon"
                        onClick={() => handleDeleteCourse(index)}
                      />
                    </li>
                  ))}
                </ul>
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
                  <label className="label">Email:</label>
                  <input
                    type="text"
                    name="Email"
                    value={updateAdminFormData.Email}
                    onChange={handleUpdateAdminInputChange}
                  />
                  <label className="labelp">Password:</label>
                  <input
                    type="text"
                    name="Password"
                    value={updateAdminFormData.Password}
                    onChange={handleUpdateAdminInputChange}
                  />
                  <button type="submit" className="admin-update-button">Update</button>
                </form>
              </div>
            </div>
          )}
        </div>

        {isProfileModalOpen && (
          <div className="modal">
            <div className="staffProfile-modal-content">
              <span
                className="staffProfile-close"
                onClick={handleOpenUpdateAdministratorModal}
              >
                &times;
              </span>
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
                    onChange={handleInputChange}
                    required
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
              <span className="close" onClick={handleCloseCourseModal}>
                &times;
              </span>
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
              <span className="close" onClick={handleCloseStudentsModal}>
                &times;
              </span>
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