import React, { useState, useEffect } from "react";
import "./Staffdashboard.css"; // Import your existing CSS file
import "./subjects.css"; // Import the CSS file for the modal
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [showCreateSubjectModal, setShowCreateSubjectModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
      //eslint-disable-next-line
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [subjectFormData, setSubjectFormData] = useState({
    Subject_Code: "",
    Description: "",
    Semester_ID: "",
    Year_Level_ID: "", 
  });

  useEffect(() => {
    fetchSubjects();
  }, []);


  const handleCloseCreateSubjectModal = () => {
    setShowCreateSubjectModal(false);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    searchSubjects();
  };

  const handleSubjectInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectFormData({ ...subjectFormData, [name]: value });
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("/subjects/getSubject/");
      if (response.status === 200) {
        setSubjects(response.data.rows); // Update this line
      } else {
        console.error("Failed to fetch subjects");
      }
    } catch (error) {
      console.log("Error fetching subjects:", error.message);
    }
  };

  const searchSubjects = async () => {
    try {
      const response = await axios.get(
        `/subjects/getSubject?searchTerm=${searchTerm}`
      );
      if (response.status === 200) {
        setSearchResults(response.data);
      } else {
        console.error("Failed to search subjects");
      }
    } catch (error) {
      console.error("Error searching subjects:", error);
    }
  };

  const handleSubmitSubject = async (e) => {
    e.preventDefault();
    const existingSubject = subjects.find(
      (subject) => subject.Subject_Code === subjectFormData.Subject_Code
    );
    if (existingSubject) {
      setErrorMessage("");
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
      } else {
        console.error("Failed to create subject");
      }
    } catch (error) {
      console.error("Error creating subject:", error);
      setErrorMessage("Failed to Create Subject");
    }
  };

  const handleUpdateSubject = (subject) => {
    // Logic for handling update action
  };
  

  const handleDeleteSubject = async (subjectCode) => {
    try {
      const response = await axios.delete(
        `/subjects/deleteSubject/${subjectCode}`
      );
      if (response.status === 200) {
        console.log("Subject deleted successfully");
        fetchSubjects();
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000); // Close the success modal after 2 seconds
      } else {
        console.error("Failed to delete subject");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
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
        {/* Success Modal */}
        {showSuccessModal && (
          <div className="modal">
            <div className="modal-content success-modal">
              <h2>Deleted successfully</h2>
            </div>
          </div>
        )}
        <table>
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Description</th>
              <th>Semester</th>
              <th>Year Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(subjects) && subjects.length > 0
              ? subjects.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.subject_code}</td>
                    <td>{subject.description}</td>
                    <td>{subject.semester_id}</td>
                    <td>{subject.year_level_id}</td>
                    <td>

                    <button
                    onClick={() =>
                      handleUpdateSubject(subject)
                    }
                    className="subject-update-button"
                    >
                    <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                    onClick={() =>
                      handleDeleteSubject(subject.subject_code)
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

      {showCreateSubjectModal && (
        <div className="modal">
          <div className="modal-content">
          <span className="close" onClick={handleCloseCreateSubjectModal}>
              &times;
            </span>
            <h2>Create Subject</h2>
            <form onSubmit={handleSubmitSubject}>
              <label>Subject Code:</label>
              <input
                type="text"
                name="Subject_Code"
                value={subjectFormData.Subject_Code}
                onChange={handleSubjectInputChange}
                required
              />
              <label>Description:</label>
              <input
                type="text"
                name="Description"
                value={subjectFormData.Description}
                onChange={handleSubjectInputChange}
                required
              />
              <label htmlFor="semester">Semester:</label>
              <select
                id="semester"
                name="Semester_ID"
                value={subjectFormData.Semester_ID}
                onChange={handleSubjectInputChange}
                required
              >
                <option value="">Select Semester</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">Summer</option>
              </select>
              <label htmlFor="year">Year Level:</label>
              <select
                id="year"
                name="Year_Level_ID"
                value={subjectFormData.Year_Level_ID}
                onChange={handleSubjectInputChange}
                required
              >
                <option value="">Select Year Level</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
