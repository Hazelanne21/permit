import React, { useState } from 'react';
import axios from 'axios';
import './StaffCreateAccount.css';

const StaffCreateAccount = () => {
    const [staffName, setStaffName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            await axios.post('/staff/create', {
                Staff_Name: staffName,
                Email: email,
                Password: password
            });
            setSuccess(true);
            setStaffName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="create-account-container">
            <form onSubmit={handleCreateAccount}>
                <div className="sform-group">
                    <label htmlFor="staffName">Staff Name:</label>
                    <input type="text" id="staffName" placeholder="Juan Dela Cruz" value={staffName} onChange={(e) => setStaffName(e.target.value)} required/>
                </div>
                <div className="sform-group">
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" placeholder="juandelacruz@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="sform-group">
                    <label htmlFor="password">Password:</label>
                    <div className="password-input-container">
                        <input type={showPassword ? "text" : "password"} id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <i type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                        </i>
                    </div>
                </div>
                <button type="submit" className={`mscreate-button ${loading ? 'disabled' : ''}`} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Account'}
                </button>
                {error && <p className="serror-message">{error}</p>}
                {success && <p className="ssuccess-message">Account created successfully!</p>}
            </form>
        </div>
    );
};

export default StaffCreateAccount;
