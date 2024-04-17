import React, { useState, useEffect } from "react";
import "./Staffdashboard.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

const StudentStatus = () => {
  const [showCreateStatusModal, setShowCreateStatusModal] = useState(false);
  const [studentStatuses, setStudentStatuses] = useState([]);
  const token = sessionStorage.getItem("token");
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  // eslint-disable-next-line
  const [errorMessage, setErrorMessage] = useState('');

  let Staff_ID = "";

  if (token) {
    const decodedToken = jwtDecode(token);
    Staff_ID = decodedToken.Staff_ID;
  }

  const [statusFormData, setStatusFormData] = useState({
    Student_Number: "",
    Prelim_Status: "",
    Midterm_Status: "",
    SemiFinal_Status: "",
    Final_Status: "",
    Staff_ID: Staff_ID,
  });
  const handleOpenCreateStatusModal = () => {
    setShowCreateStatusModal(true);
  };

  const handleOpenUpdateStatusModal = () => {
    setShowUpdateStatusModal(true);
  };
  const handleCloseCreateStatusModal = () => {
    setShowCreateStatusModal(false);
  };
  const handleCloseUpdateStatusModal = () => {
    setShowUpdateStatusModal(false);
  };

  const handleStatusInputChange = (e) => {
    const { name, value } = e.target;
    setStatusFormData({ ...statusFormData, [name]: value });
  };
  
  const handleDeleteStatus = async (studentNumber) => {
    try {
      const response = await axios.delete("/tuitions/deleteTuitionList", { data: { Student_Number: studentNumber } });
      if (response.status === 200) {
        console.log("Status deleted successfully");
        setStudentStatuses(studentStatuses.filter(status => status.student_number !== studentNumber));
      } else {
        console.error("Failed to delete status");
      }
    } catch (error) {
      console.error("Error deleting status:", error.message);
    }
  };

  const handleSubmitStatus = async (e) => {
    e.preventDefault();
    try {
      // Check if the student account exists before submitting the status
      const studentExistsResponse = await axios.get(`/students/checkStudentExists/${statusFormData.Student_Number}`);
      if (!studentExistsResponse.data.exists) {
        setErrorMessage("Student account does not exist.");
        return; // Exit the function early if student account does not exist
      }
  
      // If student account exists, proceed with submitting the status
      const response = await axios.post(
        "/tuitions/createTuitionList",
        { tuitionList: [statusFormData] }
      );
      if (response.status === 201) {
        console.log("Status created successfully");
        const newStatus = response.data;
        setStudentStatuses([...studentStatuses, newStatus]);
        handleCloseCreateStatusModal();
      } else {
        console.error("Failed to create status");
      }
    } catch (error) {
      console.error("Error creating status:", error.message);
    }
  };
  
  useEffect(() => {
    const fetchTuitionList = async () => {
      try {
        const response = await axios.get("/tuitions/getAllTuitionList");
        if (response.status === 200) {
          setStudentStatuses(response.data.tuitionList);
          console.log(
            "Tuition list fetched successfully",
            response.data.tuitionList
          );
        } else {
          console.error("Failed to fetch tuition list");
        }
      } catch (error) {
        console.error("Error fetching tuition list:", error.message);
      }
    };

    fetchTuitionList();
  }, []);
  
  const handleUpdateSubmitStatus = async (e) => {
    e.preventDefault();
    try {
      await handleUpdateStatus(statusFormData);
      console.log("Status updated successfully");
      handleCloseUpdateStatusModal();
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  const handleUpdateStatus = async (statusFormData) => {
    try {
      const response = await axios.put("/tuitions/updateTuitionList", statusFormData);
      console.log(response.data);
    } catch (error) {
      console.error("Error updating tuition list:", error);
    }
  };

  return (
    <div className="StudentStatus">
      <h1>List Of Student Tuition Status</h1>
      <button
        className="StudentStatus-button"
        onClick={handleOpenCreateStatusModal}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <div className="table-container"> 
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
            <tr key={status.student_number}>
              <td>{status.student_number}</td>
              <td>{status.prelim_status ? "Paid" : "Not Paid"}</td>
              <td>{status.midterm_status ? "Paid" : "Not Paid"}</td>
              <td>{status.semifinal_status ? "Paid" : "Not Paid"}</td>
              <td>{status.final_status ? "Paid" : "Not Paid"}</td>
              <td>
                
                <button        
                 className="list-update-button"
                onClick={() => handleOpenUpdateStatusModal()}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>

                <button
                className="list-delete-button"
                  onClick={() => handleDeleteStatus(status.student_number)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
              </div>
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
                <option value="True">Paid</option>
                <option value="False">Not Paid</option>
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
                <option value="True">Paid</option>
                <option value="False">Not Paid</option>
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
                <option value="True">Paid</option>
                <option value="False">Not Paid</option>
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
                <option value="True">Paid</option>
                <option value="False">Not Paid</option>
              </select>

              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      )}
      {showUpdateStatusModal && (
        <div className="smodal">
          <div className="smodal-content">
            <span className="sclose" onClick={handleCloseUpdateStatusModal}>
              &times;
            </span>
            <h2>Update Student Tuition Status</h2>
            <form onSubmit={handleUpdateSubmitStatus}>
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
                <option value="True">Paid</option>
                <option value="False">Not Paid</option>
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
                <option value="True">Paid</option>
                <option value="False">Not Paid</option>
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
                <option value="True">Paid</option>
                <option value="False">Not Paid</option>
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
                <option value="True">Paid</option>
                <option value="False">Not Paid</option>
              </select>

              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentStatus;
 