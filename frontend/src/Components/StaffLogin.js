import React, { useState } from 'react';
import './StaffLogin.css'; 
import axios from 'axios';
import StaffCreateAccount from './StaffCreateAccount'; 
import logo from '../images/CCS.png';


const StaffLogin = ({ onLoginSuccess }) => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3000/staff/login', { email, password });
            const token = response.data.token;
            console.log(token);
            onLoginSuccess();
            
            
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Invalid Email or password');
            } else {
                console.error('Login failed:', error);
                setError('Internal Server Error');
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
        
        <div className="slogin-container">
     <img src={logo} alt="Logo" className="logo" style={{ marginTop: '-90px', marginBottom: '-30px', marginLeft: '190px' }} />
            <h2 className="slogin-heading">ADMINISTRATOR</h2>
            <form onSubmit={handleLogin}>
                <label htmlFor="email" className="slogin-label">
                    Email:
                </label>
                <input
                    type="email"
                    id="email"
                    className="slogin-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password" className="slogin-label">
                    Password:
                </label>
                <input
                    type="password"
                    id="password"
                    className="slogin-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="slogin-options">
                    <a href="#!" className="sforgot-password-link">
                        Forgot password?
                    </a>
                </div>

                <button type="submit" className="slogin-button">
                    Login
                </button>
                {error && <p className="serror-message">{error}</p>}
            </form>
            <br />
            <button type="button" className="screate-button" onClick={handleCreateAccountClick}>
                Create Account
            </button>

            {showModal && (
                <div className="smodal">
                    <div className="smodal-content">
                        <span className="sclose" onClick={handleCloseModal}>&times;</span>
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
