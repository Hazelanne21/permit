import React, { useState } from "react";
import "./Staffdashboard.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const StudentStatus = () => {
  const [showCreateStatusModal, setShowCreateStatusModal] = useState(false);
  const [studentStatuses, setStudentStatuses] = useState([]);

  const [statusFormData, setStatusFormData] = useState({
    Student_Number: "",
    Prelim_Status: "",
    Midterm_Status: "",
    SemiFinal_Status: "",
    Final_Status: "",
  });

  const handleOpenCreateStatusModal = () => {
    setShowCreateStatusModal(true);
  };

  const handleCloseCreateStatusModal = () => {
    setShowCreateStatusModal(false);
  };

  const handleStatusInputChange = (e) => {
    const { name, value } = e.target;
    setStatusFormData({ ...statusFormData, [name]: value });
  };

  const handleEditStatus = (status) => {
    // Define the logic to handle editing a status
    console.log("Editing status:", status);
  };

  const handleDeleteStatus = (statusId) => {
    // Define the logic to handle deleting a status
    console.log("Deleting status with ID:", statusId);
  };

  const handleSubmitStatus = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/staff/createTuitionStatus",
        statusFormData
      );
      if (response.status === 201) {
        console.log("Status created successfully");
        const newStatus = response.data;
        setStudentStatuses([...studentStatuses, newStatus]); // Update statuses state with the new status
        handleCloseCreateStatusModal();
      } else {
        console.error("Failed to create status");
      }
    } catch (error) {
      console.error("Error creating status:", error);
    }
  };

  return (
    <div className="StudentStatus">
      <h1>List Of Student Tuition Statuses</h1>
      <button className="StudentStatus-button" onClick={handleOpenCreateStatusModal}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <table>
        <thead>
          <tr>
            <th>Student Number</th>
            <th>Prelim Status</th>
            <th>Midterm Status</th>
            <th>SemiFinal Status</th>
            <th>Final Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentStatuses.map((status) => (
            <tr key={status.id}>
              <td>{status.Student_Number}</td>
              <td>{status.Prelim_Status}</td>
              <td>{status.Midterm_Status}</td>
              <td>{status.SemiFinal_Status}</td>
              <td>{status.Final_Status}</td>
              <td>
                <button onClick={() => handleEditStatus(status)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
  
                <button onClick={() => handleDeleteStatus(status.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showCreateStatusModal && (
        <div className="smodal">
          <div className="smodal-content">
            <span className="sclose" onClick={handleCloseCreateStatusModal}>
              &times;
            </span>
            <h2>Create Student Tuition Status</h2>
            <form onSubmit={handleSubmitStatus}>
              <label>Student Number:</label>
              <input
                type="text"
                name="Student_Number"
                value={statusFormData.Student_Number}
                onChange={handleStatusInputChange}
                required
              />
              <label>Prelim Status:</label>
              <select
                className="select-dropdown"
                name="Prelim_Status"
                value={statusFormData.Prelim_Status}
                onChange={handleStatusInputChange}
                required
              >
                <option value="">Select Prelim Status</option>
                <option value="Paid">Paid</option>
                <option value="Not Paid">Not Paid</option>
              </select>
  
              <label>Midterm Status:</label>
              <select
                className="select-dropdown"
                name="Midterm_Status"
                value={statusFormData.Midterm_Status}
                onChange={handleStatusInputChange}
                required
              >
                <option value="">Select Midterm Status</option>
                <option value="Paid">Paid</option>
                <option value="Not Paid">Not Paid</option>
              </select>
  
              <label>SemiFinal Status:</label>
              <select
                className="select-dropdown"
                name="SemiFinal_Status"
                value={statusFormData.SemiFinal_Status}
                onChange={handleStatusInputChange}
                required
              >
                <option value="">Select SemiFinal Status</option>
                <option value="Paid">Paid</option>
                <option value="Not Paid">Not Paid</option>
              </select>
  
              <label>Final Status:</label>
              <select
                className="select-dropdown"
                name="Final_Status"
                value={statusFormData.Final_Status}
                onChange={handleStatusInputChange}
                required
              >
                <option value="">Select Final Status</option>
                <option value="Paid">Paid</option>
                <option value="Not Paid">Not Paid</option>
              </select>
  
              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default StudentStatus;
