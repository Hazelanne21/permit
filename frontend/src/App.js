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
import { jwtDecode } from "jwt-decode";

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
    <div className="type-container"  style={{ backgroundColor: "#FAFBF6"}}>
      <img
        src={logo}
        alt="Logo"
        className="logo"
        style={{ marginTop: "-60px", marginLeft: "50px", background: ""}}
      />
      <h1 style={{ marginLeft: "10px", color: "#0B3426", fontFamily: "inherit", fontSize: "40px", textAlign: "center" }}>Exam Permit</h1>
      <div className="button-container">
        <button onClick={() => handleUserTypeSelect("student")}>STUDENT</button>
        <button onClick={() => handleUserTypeSelect("staff")}>ADMIN</button>
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
            let decodedToken;
            try {
                decodedToken = jwtDecode(token);
            } catch (error) {
                console.error('Failed to decode token', error);
                return;
            }

            if (decodedToken.email) {
                setUserType('staff');
                navigate("/Staffdashboard");
            } else if (decodedToken.studentNumber) {
                setUserType('student');
                navigate("/Studentdashboard");
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
