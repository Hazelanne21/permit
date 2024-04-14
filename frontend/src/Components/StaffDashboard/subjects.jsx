import React, { useState, useEffect } from "react";
import "./Staffdashboard.css"; // Import your existing CSS file
import "./subjects.css"; // Import the CSS file for the modal
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

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
    Name: "",
    Semester_ID: "",
    Year_Level_ID: "",
  });
  const [showUpdateSubjectModal, setShowUpdateSubjectModal] = useState(false);
  const [updateSubjectFormData, setUpdateSubjectFormData] = useState({
    Subject_Code: "",
    Name: "",
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

  const handleSubjectInputChange = (event) => {
    setSubjectFormData({
      ...subjectFormData,
      [event.target.name]: event.target.value,
    });
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
    if (!subjectFormData.Semester_ID || !subjectFormData.Year_Level_ID) {
      setErrorMessage("Semester and Year Level are required");
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
    setUpdateSubjectFormData({
      ...subject,
      Subject_ID: subject.subject_id, // Assuming the subject object has a Subject_ID property
    });
    setShowUpdateSubjectModal(true);
  };

  const handleSubmitUpdateSubject = async (e) => {
    e.preventDefault();
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
      } else {
        console.error("Failed to update subject");
        setErrorMessage("Failed to Update Subject");
      }
    } catch (error) {
      console.error("Error updating subject:", error.message);
      setErrorMessage("Failed to Update Subject");
    }
  };

  const handleUpdateSubjectInputChange = (event) => {
    setUpdateSubjectFormData({
      ...updateSubjectFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      const response = await axios.delete(
        `/subjects/deleteSubject/${subjectId}`
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
              <th>Name</th>
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
                    <td>{subject.name}</td>
                    <td>
                      {subject.semester_id === 3
                        ? "Summer Class"
                        : subject.semester_id}
                    </td>
                    <td>{subject.year_level_id}</td>
                    <td>
                      <button
                        onClick={() => handleUpdateSubject(subject)}
                        className="subject-update-button"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.subject_id)}
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
              <label>Name:</label>
              <input
                type="text"
                name="Name"
                value={subjectFormData.Name}
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
                <option value="" disabled selected>
                  Select Semester
                </option>
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
                <option value="" disabled selected>
                  Select Year Level
                </option>
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
              <label>Subject Code:</label>
              <input
                type="text"
                name="Subject_Code"
                value={updateSubjectFormData.Subject_Code}
                onChange={handleUpdateSubjectInputChange}
                required
              />
              <label>Name:</label>
              <input
                type="text"
                name="Name"
                value={updateSubjectFormData.Name}
                onChange={handleUpdateSubjectInputChange}
                required
              />
              <label htmlFor="semester">Semester:</label>
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
              <label htmlFor="year">Year Level:</label>
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
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
