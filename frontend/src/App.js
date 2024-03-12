import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLogin from './StudentLogin';
import StaffLogin from './StaffLogin';
import Studentdashboard from './Studentdashboard';
import Staffdashboard from './Staffdashboard';
import logo from './images/CCS.png'; 
import './App.css'

// App.js

const App = () => {
  const [userType, setUserType] = useState(null);
  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  return (
    <Router>
    
    <div className="app-container" style={{ marginRight: '20px' }}>
      <div>

        {!userType && (
          <div>
                <div className="type-container">
            <img src={logo} alt="Logo" className="logo"  style={{marginTop: '-20px', marginLeft: '55px' }} />
            <h1 style={{ marginLeft: '-15px' }}>Computer Studies</h1>
            <div className="button-container">
              <button onClick={() => handleUserTypeSelect('student')}>STUDENT</button>
              <button onClick={() => handleUserTypeSelect('staff')}>STAFF</button>
            </div>
          </div>
          </div>
        )}

{userType === 'student' && (
          <Routes>
            <Route path="/" element={<StudentLogin />} />
            <Route path="/Studentdashboard" element={<Studentdashboard />} />
          </Routes>
        )}

    {userType === 'staff' && (
          <Routes>
            <Route path="/" element={<StaffLogin />} />
            <Route path="/Staffdashboard" element={<Staffdashboard />} />
          </Routes>
        )}
      </div>
    </div>
    </Router>
  );
};

export default App;
