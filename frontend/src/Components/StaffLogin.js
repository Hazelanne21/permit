import React, { useState } from "react";
import "./StaffLogin.css";
import axios from "axios";
import StaffCreateAccount from "./StaffCreateAccount";
import { useNavigate } from "react-router-dom";
import logo from "../images/CCS.png";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Ensure correct field names: email and password
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        setError("Please enter student number and password");
        return;
      }

      const response = await axios.post("/staff/login", {
        email,
        password,
      });
      const data = response.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/Staffdashboard");
      } else {
        setError("Invalid Email or password");
        
      }
    } catch (error) {
      console.error("Error signing in:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setError("Invalid Email or password. Please try again.");
        } else if (error.response.status === 500) {
          setError("Internal Server Error. Please try again later.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  const handleCreateAccountClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
          marginLeft: "90px",
        }}
      />
      <h2 className="slogin-heading">ADMINISTRATOR</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email" className="slogin-label">
          Email:
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="slogin-input"
          required
        />
        <label htmlFor="password" className="slogin-label">
          Password:
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input, form-control"
          required
        />

        <div className="slogin-options">
          <a href="#!" className="sforgot-password-link">
            Forgot password?
          </a>
        </div>
        {error && <p className="serror-message">{error}</p>}


        <button type="submit" className="slogin-button">
          Login
        </button>
      </form>
      <br />
      <button
        type="button"
        className="screate-button"
        onClick={handleCreateAccountClick}
      >
        Create Account
      </button>

      {showModal && (
        <div className="smodal">
          <div className="smodal-content">
            <span className="sclose" onClick={handleCloseModal}>
              &times;
            </span>
            <div className="smodal-header">
              <h2>Create Account</h2>
            </div>
            <div className="smodal-body">
              <StaffCreateAccount />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffLogin;
