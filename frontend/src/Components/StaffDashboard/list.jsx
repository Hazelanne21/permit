import React, { useState, useEffect } from "react";
import "./Staffdashboard.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';


const StudentStatus = () => {
  const [showCreateStatusModal, setShowCreateStatusModal] = useState(false);
  const [studentStatuses, setStudentStatuses] = useState([]);
  const token = sessionStorage.getItem("token");
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

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
    // Display a confirmation dialog before deleting
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this student status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete("/tuitions/deleteTuitionList", { data: { Student_Number: studentNumber } });
          if (response.status === 200) {
            console.log("Status deleted successfully");
            setStudentStatuses(studentStatuses.filter(status => status.student_number !== studentNumber));
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Student tuition status deleted successfully',
            });
          } else {
            console.error("Failed to delete status");
          }
        } catch (error) {
          console.error("Error deleting status:", error.message);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to delete student tuition status. Please try again later.',
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Student tuition status deletion has been cancelled',
          icon: 'info'
        });
      }
    });
  };
  

  const handleSubmitStatus = async (e) => {
    e.preventDefault();
    
    const studentNumberRegex = /^[0-9-]+$/;
  if (!statusFormData.Student_Number.match(studentNumberRegex)) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Input',
      text: 'Student number can only contain numbers and dashes (-). Please enter a valid student number.',
    });
    return;
  }
  
     const existingStudent = studentStatuses.find(status => status.student_number === statusFormData.Student_Number);
  if (existingStudent) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'A tuition status for this student already exists.',
    });
    return; 
  }
  
    try {
      const response = await axios.post(
        "/tuitions/createTuitionList",
        { tuitionList: [statusFormData] }
      );
      
      if (response.status === 201) {
        console.log("Status created successfully");
        const newStatus = response.data;
        setStudentStatuses([...studentStatuses, newStatus]);
        handleCloseCreateStatusModal();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Student tuition status created successfully',
        });
      } else {
        console.error("Failed to create status");
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to create student tuition status. Please try again later.',
        });
      }
    } catch (error) {
      console.error("Error creating status:", error.message);
      
      if (error.response && error.response.status === 404 && error.response.data && error.response.data.error === "Student not found") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'The student does not exist. Please enter a valid student number.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: 'Failed to connect to the server. Please check your internet connection and try again.',
        });
      }
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
    

    const studentNumberRegex = /^[0-9-]+$/;
    if (!statusFormData.Student_Number.match(studentNumberRegex)) {
      // Display a warning message if the input contains invalid characters
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Student number can only contain numbers and dashes (-). Please enter a valid student number.',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this student tuition status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await handleUpdateStatus(statusFormData);
          console.log("Status updated successfully");
          handleCloseUpdateStatusModal();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Student tuition status updated successfully',
          });
        } catch (error) {
          console.error("Error updating status:", error.message);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to update student tuition status. Please try again later.',
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Student tuition status update has been cancelled',
          icon: 'info'
        });
      }
    });
  };
  
  window.addEventListener('offline', () => {
    Swal.fire({
      icon: 'error',
      title: 'Connection Error',
      text: 'You are offline. Please check your internet connection and try again.',
    });
  });
  
  

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
            <th  className="table-header">Student Number</th>
            <th className="table-header">Prelim Status</th>
            <th className="table-header">Midterm Status</th>
            <th className="table-header">SemiFinal Status</th>
            <th className="table-header">Final Status</th>
            <th  className="table-header">Actions</th>
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
              <label className="studentlabel">Student Number:</label>
              <input
                type="text"
                name="Student_Number"
                value={statusFormData.Student_Number}
                onChange={handleStatusInputChange}
                required
              />
              <label className="prelimlabel">Prelim Status:</label>
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

              <label className="midtermlabel">Midterm Status:</label>
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

              <label className="semifinallabel">SemiFinal Status:</label>
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

              <label className="finallabel">Final Status:</label>
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
            <label className="studentlabel-update">Student Number:</label>
              <input
                type="text"
                name="Student_Number"
                value={statusFormData.Student_Number}
                onChange={handleStatusInputChange}
                required
              />
              <label className="prelimlabel-update">Prelim Status:</label>
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

              <label className="midtermlabel-update">Midterm Status:</label>
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

              <label className="semifinallabel-update">SemiFinal Status:</label>
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

              <label className="finallabel-update">Final Status:</label>
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