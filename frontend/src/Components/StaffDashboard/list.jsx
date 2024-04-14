import React, { useState } from "react";
import "./Staffdashboard.css";
import axios from "axios";

const List = () => {
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [students, setStudents] = useState([]);

  const [studentFormData, setStudentFormData] = useState({
    Student_Number: "",
    Prelim_Status: "",
    Midterm_Status: "",
    SemiFinal_Status: "",
    Final_Status: "",
  });

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

  return (
    <div className="Student">
      <h1>List Of Student</h1>
      <button className="Student-button" onClick={handleOpenCreateStudentModal}>
        Add Student
      </button>
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
                type="text"
                name="Prelim_Status"
                value={studentFormData.Prelim_Status}
                onChange={handleStudentInputChange}
              />
              <label>Midterm Status:</label>
              <input
                type="text"
                name="Midterm_Status"
                value={studentFormData.Midterm_Status}
                onChange={handleStudentInputChange}
              />
              <label>SemiFinal Status:</label>
              <input
                type="text"
                name="SemiFinal_Status"
                value={studentFormData.SemiFinal_Status}
                onChange={handleStudentInputChange}
              />
              <label>Final Status:</label>
              <input
                type="text"
                name="Final_Status"
                value={studentFormData.Final_Status}
                onChange={handleStudentInputChange}
              />
              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default List;
