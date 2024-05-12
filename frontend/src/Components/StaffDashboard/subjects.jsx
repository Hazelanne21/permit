import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Staffdashboard.css"; 
import "./subjects.css"; 
import axios from "axios";
import Swal from 'sweetalert2';


const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [showCreateSubjectModal, setShowCreateSubjectModal] = useState(false);
  const [ setShowSuccessModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  //eslint-disable-next-line
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
 
 
 
  useEffect(() => {
    fetchSubjects();
  }, []);


  useEffect(() => {
    const highlightedElement = document.querySelector('.highlight');
    if (highlightedElement) {
      highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [subjects]);



// CREATE SUBJECT
  const [subjectFormData, setSubjectFormData] = useState({
    Subject_Code: "",
    Name: "",
    Semester_ID: "",
    Year_Level_ID: "",
    Course_ID: "",
  });

  // UPDATE SUBJECT
  const [showUpdateSubjectModal, setShowUpdateSubjectModal] = useState(false);
  const [updateSubjectFormData, setUpdateSubjectFormData] = useState({
    Subject_Code: "",
    Name: "",
    Semester_ID: "",
    Year_Level_ID: "",
    Course_ID: "",
  });



  // CREATE SUBJECTS
  const handleSubmitSubject = async (e) => {
    e.preventDefault();


    const subjectCodeRegex = /^[A-Z0-9_]+$/;
  if (!subjectFormData.Subject_Code.match(subjectCodeRegex)) {
    // Display a warning message if the input contains invalid characters
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Subject Code',
      text: 'Subject code can only contain uppercase letters, numbers, and underscores (_). Please enter a valid subject code.',
    });
    return;
  }
    const existingSubject = subjects.find(
      (subject) => subject.Subject_Code === subjectFormData.Subject_Code
    );
    if (existingSubject) {
      setErrorMessage("");
      return;
    }
    if (!subjectFormData.Semester_ID || !subjectFormData.Year_Level_ID || !subjectFormData.Course_ID) {
      setErrorMessage("Semester, Year Level and Course are required");
      return;
    }
    try {
      const response = await axios.post(
        "/subjects/createSubject",
        subjectFormData
      );
      if (response.status === 201) {
        console.log("Subject created successfully");
        const newSubject = { ...subjectFormData };
        setSubjects([...subjects, newSubject]);
        setShowCreateSubjectModal(false);
        setErrorMessage("");
        // Display success message using SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Subject created successfully',
        });
      } else {
        console.error("Failed to create subject");
        // Display error message using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to create subject. Please try again later.',
        });
      }
    } catch (error) {
      console.error("Error creating subject:", error);
      // Check for network-related errors
      if (!navigator.onLine) {
        // If offline, display a specific error message
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: 'You are offline. Please check your internet connection and try again.',
        });
      } else {
        // If other error, display a generic error message
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Subject already exists.',
        });
      }
    }
  };


  const handleSubjectInputChange = (event) => {
    setSubjectFormData({
      ...subjectFormData,
      [event.target.name]: event.target.value,
    });
  };

// MODALCREATE
  const handleCloseCreateSubjectModal = () => {
    setShowCreateSubjectModal(false);
  };


  // SEARCH
  const searchSubjects = async () => {
  try {
    const response = await axios.get(
      `/subjects/getSubject?searchTerm=${searchTerm}`
    );
    if (response.status === 200) {
      if (response.data.length > 0) {
        setSubjects(response.data); 
        setSearchResults([]); 
        setErrorMessage(""); 
     
        const searchResultElement = document.getElementById("search-result");
        if (searchResultElement) {
          searchResultElement.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        setSearchResults([]); // Clear search results state
        setErrorMessage("No subjects found"); // Display error message
      }
    } else {
      console.error("Failed to search subjects");
    }
  } catch (error) {
    console.error("Error searching subjects:", error);
  }
};

  

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    searchSubjects();
  };


 

 
  const fetchSubjects = async () => {
    try {
      const response = await axios.get("/subjects/getSubject/");
      if (response.status === 200) {
        setSubjects(response.data.rows); // Update this line
        console.log(response.data.rows);
      } else {
        console.error("Failed to fetch subjects");
      }
    } catch (error) {
      console.log("Error fetching subjects:", error.message);
    }
  };

 


  // UPDATE SUBJECTS
  const handleSubmitUpdateSubject = async (e) => {
    e.preventDefault();

    const subjectCodeRegex = /^[A-Z0-9_]+$/;
    if (!updateSubjectFormData.Subject_Code.match(subjectCodeRegex)) {
      // Display a warning message if the input contains invalid characters
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Subject Code',
        text: 'Subject code can only contain uppercase letters, numbers, and underscores (_). Please enter a valid subject code.',
      });
      return;
    }
    try {
      const response = await axios.put(
        `/subjects/updateSubject/${updateSubjectFormData.Subject_ID}`,
        updateSubjectFormData
      );
      if (response.status === 200) {
        console.log("Subject updated successfully");
        fetchSubjects(); // Fetch the subjects again to update the list
        setShowUpdateSubjectModal(false); // Close the update modal
        setErrorMessage(""); // Clear any error messages
        // Display success message using SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Subject updated successfully',
        });
      } else {
        console.error("Failed to update subject");
        setErrorMessage("Failed to Update Subject");
        // Display error message using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to update subject. Please try again later.',
        });
      }
    } catch (error) {
      console.error("Error updating subject:", error.message);
      setErrorMessage("Failed to Update Subject");
      // Check for network-related errors
      if (!navigator.onLine) {
        // If offline, display a specific error message
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: 'You are offline. Please check your internet connection and try again.',
        });
      } else {
        // If other error, display a generic error message
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to update subject. Please try again later.',
        });
      }
    }
  };
  
  const handleUpdateSubject = (subject) => {
    setUpdateSubjectFormData({
      ...subject,
      Subject_ID: subject.subject_id, // Assuming the subject object has a Subject_ID property
    });
    setShowUpdateSubjectModal(true);
  };


  const handleUpdateSubjectInputChange = (event) => {
    setUpdateSubjectFormData({
      ...updateSubjectFormData,
      [event.target.name]: event.target.value,
    });
  };


  // DELETE SUBJECTS
  const handleDeleteSubject = async (subjectId) => {
    // Display a confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this subject!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // If confirmed, make the delete request
          const response = await axios.delete(`/subjects/deleteSubject/${subjectId}`);
          if (response.status === 200) {
            console.log("Subject deleted successfully");
            fetchSubjects();
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 2000); // Close the success modal after 2 seconds
            // Display success message using SweetAlert
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'An error occurred while deleting the subject. Please try again later.',
            });
          } else {
            console.error("Failed to delete subject");
            // Display error message using SweetAlert
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Failed to delete subject. Please try again later.',
            });
          }
        } catch (error) {
          console.error("Error deleting subject:", error);
          // Check for network-related errors
          if (!navigator.onLine) {
            // If offline, display a specific error message
            Swal.fire({
              icon: 'error',
              title: 'Connection Error',
              text: 'You are offline. Please check your internet connection and try again.',
            });
          } else {
            // If other error, display a generic error message
            Swal.fire({
              icon: 'success',
              title: 'Subject Deleted!',
              text: 'The subject has been successfully deleted.',
            });
          }
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // If the user cancels the deletion
        Swal.fire({
          icon: 'info',
          title: 'Deletion Cancelled',
          text: 'Deleting the subject was cancelled.',
        });
      }
    });
  };
  


  
  return (
    <div className="container">
      <div>
        <h1>Subjects</h1>
        <div className="search-container">
          <input
            className="search-bar"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
        <button
          className="subject-add-button"
          onClick={() => setShowCreateSubjectModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="table-container"> 
        {searchResults.length > 0 && (
  <p className="search-results">Search results for: {searchTerm}</p>
)}
          <table>
            <thead>
              <tr>
                <th className="table-header">Subject Code</th>
                <th className="table-header">Description</th>
                <th className="table-header">Semester</th>
                <th className="table-header">Year Level</th>
                <th className="table-header">Course</th>
                <th className="table-header">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(subjects) && subjects.length > 0
                ? subjects.map((subject, index) => (
                    <tr key={index}>
                      <td>{subject.subject_code}</td>
                      <td>{subject.name}</td>
                      <td>
                        {subject.semester_id === 3
                          ? "Summer Class"
                          : subject.semester_id}
                      </td>
                      <td>{subject.year_level_id}</td>
                      <td>{subject.course_id}</td>
                      <td>
                        <button
                          onClick={() => handleUpdateSubject(subject)}
                          className="subject-update-button"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteSubject(subject.subject_id)
                          }
                          className="subject-delete-button"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateSubjectModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseCreateSubjectModal}>
              &times;
            </span>
            <h2>Create Subject</h2>
            <form onSubmit={handleSubmitSubject}>
              <label className="subject-label">Subject Code:</label>
              <input
                type="text"
                name="Subject_Code"
                value={subjectFormData.Subject_Code}
                onChange={handleSubjectInputChange}
                required
              />
              <label className="description-label">Description:</label>
              <input
                type="text"
                name="Name"
                value={subjectFormData.Name}
                onChange={handleSubjectInputChange}
                required
              />
              <label className="semester-label">Semester:</label>
              <select
                id="semester"
                name="Semester_ID"
                value={subjectFormData.Semester_ID}
                onChange={handleSubjectInputChange}
                required
              >
                <option value="" disabled selected>
                  Select Semester
                </option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">Summer</option>
              </select>



              <label className="year-label">Year Level:</label>
              <select
                id="year"
                name="Year_Level_ID"
                value={subjectFormData.Year_Level_ID}
                onChange={handleSubjectInputChange}
                required
              >
                <option value="" disabled selected>
                  Select Year Level
                </option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>



              <label className="course-label">Course:</label>
              <select
                id="Course"
                name="Course_ID"
                value={subjectFormData.Course_ID}
                onChange={handleSubjectInputChange}
                required
              >
                <option value="" disabled selected>
                  Select Course
                </option>
                <option value="1">BSCS</option>
                <option value="2">BSIS</option>
              </select>


              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button type="submit" className="submit-create">Create</button>
            </form>
          </div>
        </div>
      )}
      {showUpdateSubjectModal && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setShowUpdateSubjectModal(false)}
            >
              &times;
            </span>
            <h2>Update Subject</h2>
            <form onSubmit={handleSubmitUpdateSubject}>
              <label className="subject-label-update">Subject Code:</label>
              <input
                type="text"
                name="Subject_Code"
                value={updateSubjectFormData.Subject_Code}
                onChange={handleUpdateSubjectInputChange}
                required
              />
              <label className="description-label-update">Description:</label>
              <input
                type="text"
                name="Name"
                value={updateSubjectFormData.Name}
                onChange={handleUpdateSubjectInputChange}
                required
              />
              <label className="semester-label-update">Semester:</label>
              <select
                id="semester"
                name="Semester_ID"
                value={updateSubjectFormData.Semester_ID}
                onChange={handleUpdateSubjectInputChange}
                required
              >
                <option value="" disabled selected>
                  Select Semester
                </option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">Summer</option>
              </select>


              <label className="year-label-update">Year Level:</label>
              <select
                id="year"
                name="Year_Level_ID"
                value={updateSubjectFormData.Year_Level_ID}
                onChange={handleUpdateSubjectInputChange}
                required
              >
                <option value="" disabled selected>
                  Select Year Level
                </option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>


              <label className="year-label-update">Course:</label>
              <select
                id="Course"
                name="Course_ID"
                value={updateSubjectFormData.Course_ID}
                onChange={handleUpdateSubjectInputChange}
                required
              >
                <option value="" disabled selected>
                  Select Course
                </option>
                <option value="1">BSCS</option>
                <option value="2">BSIS</option>
              </select>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button type="submit" className="submit-update">Update</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
