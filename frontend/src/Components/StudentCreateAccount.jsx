import React, { useState } from "react";
import axios from "axios";
import "./StudentCreateAccount.css";
import Swal from 'sweetalert2';


const StudentCreateAccount = () => {
  const [studentNumber, setStudentNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const [password, setPassword] = useState("");
  const [gbox, setGbox] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [yearLevelId, setYearLevelId] = useState("");
  const [Course_ID, setCourse_ID] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [isIrregular, setIsIrregular] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const studentNumberRegex = /^\d{2}-\d{5}$/;

    if (!studentNumber.match(studentNumberRegex)) {
      // Display error message using SweetAlert if the format is incorrect
      Swal.fire({
        icon: 'error',
        title: 'Invalid Student Number',
        text: 'Student Number should be in the format XX-XXXXX.',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("students/register", {
        Student_Number: studentNumber,
        Student_Name: studentName,
        Password: password,
        Gbox: gbox,
        Mobile_Number: mobileNumber,
        Year_Level_ID: yearLevelId,
        Course_ID: Course_ID,
        Semester_ID: semesterId,
        Is_Irregular: isIrregular,
      });
      if (response.status === 201) {
        setSuccess(true);
        setStudentNumber("");
        setStudentName("");
        setPassword("");
        setGbox("");
        setMobileNumber("");
        setYearLevelId("");
        setCourse_ID("");
        setSemesterId("");
        setIsIrregular(false);
        // Display success message using SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Account created successfully!',
        }).then(() => {
          setTimeout(() => {
          }, 1000); // Close the modal after 1 second
        });
      }
    } catch (error) {
      // Display error message using SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Incorrect Gbox or Mobile Number Format.',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="create-account-container">
      <form onSubmit={handleCreateAccount}>
        <div className="form-group">
          <label htmlFor="studentNumber">Student Number:</label>
          <input
            type="text"
            id="studentNumber"
            placeholder="21-1234"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="studentName">Student Name:</label>
          <input
            type="text"
            id="studentName"
            placeholder="Juan Dela Cruz"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>


        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
           <i
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
            </i>

            <i type="button" className="ctoggle-password" onClick={togglePasswordVisibility}>
                        </i>
        </div>
        </div>


        <div className="form-group">
          <label htmlFor="gbox">Gbox:</label>
          <input
            type="text"
            id="gbox"
            placeholder="jdc@gbox.ncf.edu.ph"
            value={gbox}
            onChange={(e) => setGbox(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input
            type="text"
            id="mobileNumber"
            placeholder="09*********"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </div>

  
     
     

        <div className="form-group">
          <label htmlFor="yearLevelId">Year Level:</label>
          <select
            id="yearLevelId"
            value={yearLevelId}
            onChange={(e) => setYearLevelId(e.target.value)}
            required
          >
            <option value="">Select Year Level</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>


        <div className="form-group">
          <label htmlFor="Course_ID">Course:</label>
          <select
            id="Course_ID"
            value={Course_ID}
            onChange={(e) => setCourse_ID(e.target.value)}
            required
          >
            <option value="">Select Course</option>
            <option value="1">BSCS</option>
            <option value="2">BSIS</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="semesterId">Semester:</label>
          <select
            id="semesterId"
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            required
          >
            <option value="">Select Semester</option>
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
            <option value="3">Summer</option>
          </select>
        </div>

        <button
          type="submit"
          className={`create-button ${loading ? "disabled" : ""}`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        {error && <p className="mqcreate-error-message">{error}</p>}
        {success && (
          <p className="mqcreate-success-message">Account created successfully!</p>
        )}
      </form>
    </div>
  );
};

export default StudentCreateAccount;