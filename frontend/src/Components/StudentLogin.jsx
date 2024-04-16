import React, { useState } from "react";
import "./StudentLogin.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import logo from "../images/CCS.png";

const StudentLogin = () => {
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      if (!studentNumber || !password) {
        setError("Please enter student number and password");
        return;
      }
  
      const response = await axios.post("students/login", {
        studentNumber,
        password,
      });
      const data = response.data;
      if (data.token) {
        sessionStorage.setItem("token", data.token); // Store token in session storage
        navigate('/Studentdashboard');
      } else {
        setError("Invalid student number or password");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      if (error.response && error.response.status === 500) {
        setError("Internal Server Error. Please try again later.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };


  return (
    <div className="login-container" style={{ backgroundColor: "white" }}>
      <img
        src={logo}
        alt="Logo"
        className="logo"
        style={{
          marginTop: "-90px",
          marginBottom: "-30px",
          marginLeft: "120px",
        }}
      />
      <h2 className="login-heading">CCS STUDENT</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="studentNumber" className="login-label">Student Number:</label>
        <input
          type="text"
          id="studentNumber"
          placeholder="Student Number"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          className="login-input"
          required
        />
        
        <label htmlFor="password" className="login-label">
          Password:
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />

        <div className="login-options">
          <a href="forgot-password" className="forgot-password-link">
            Forgot password?
          </a>
        </div>
                {error && <p className="slogin-error-message">{error}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <br />
    </div>
  );
};

export default StudentLogin;
