import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import StudentLogin from "./Components/StudentLogin";
import StaffLogin from "./Components/StaffLogin";
import Studentdashboard from "./Components/Studentdashboard";
import Staffdashboard from "./Components/StaffDashboard/Staffdashboard";
import logo from "./images/CCS.png";
import "./App.css";

const UserTypeSelect = ({ setUserType }) => {
  const navigate = useNavigate();
  
  const handleUserTypeSelect = (type) => {
    setUserType(type);
    if (type === "student") {
      navigate("/Student");
    } else if (type === "staff") {
      navigate("/Staff");
    }
  };

  return (
    <div className="type-container">
      <img
        src={logo}
        alt="Logo"
        className="logo"
        style={{ marginTop: "-50px", marginLeft: "55px" }}
      />
      <h1 style={{ marginLeft: "30px" }}>Exam Permit</h1>
      <div className="button-container">
        <button onClick={() => handleUserTypeSelect("student")}>STUDENT</button>
        <button onClick={() => handleUserTypeSelect("staff")}>STAFF</button>
      </div>
    </div>
  );
};

const RoutesComponent = ({ userType, setUserType }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setUserType(null);
    }
  }, [location, setUserType]); 
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<UserTypeSelect setUserType={setUserType} />}
        />

        <Route
          path="/Student"
          element={
            userType === "student" ? (
              <StudentLogin />
            ) : (
              <UserTypeSelect setUserType={setUserType} />
            )
          }
        />
        <Route
          path="/Studentdashboard"
          element={
            userType === "student" ? (
              <Studentdashboard />
            ) : (
              <UserTypeSelect setUserType={setUserType} />
            )
          }
        />

        <Route
          path="/Staff"
          element={
            userType === "staff" ? (
              <StaffLogin />
            ) : (
              <UserTypeSelect setUserType={setUserType} />
            )
          }
        />
        <Route
          path="/Staffdashboard"
          element={
            userType === "staff" ? (
              <Staffdashboard />
            ) : (
              <UserTypeSelect setUserType={setUserType} />
            )
          }
        />
        
      </Routes>
    </div>
  );
};

const App = () => {
  const [userType, setUserType] = useState(null);

  const RoutesComponentWithNavigation = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = sessionStorage.getItem('token');
      if (token) {
        if (userType === "student") {
          navigate("/Studentdashboard");
        } else if (userType === "staff") {
          navigate("/Staffdashboard");
        }
      }
    }, [navigate]);

    return <RoutesComponent userType={userType} setUserType={setUserType} />;
  };

  return (
    <Router>
      <div className="app-container" style={{ marginRight: "20px" }}>
        <RoutesComponentWithNavigation />
      </div>
    </Router>
  );
};

export default App;
