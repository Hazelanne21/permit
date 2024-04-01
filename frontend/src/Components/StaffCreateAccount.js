import React, { useState } from 'react';
import axios from 'axios';


const StaffCreateAccount = () => {
    const [staffName, setStaffName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            await axios.post('http://localhost:3000/staff/create', {
                Staff_Name: staffName,
                Email: email,
                Password: password
            });
            setSuccess(true);
            setStaffName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            setError('Already created an Account, try logging in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-account-container">
            <form onSubmit={handleCreateAccount}>
                <div className="sform-group">
                    <label htmlFor="staffName">Staff Name:</label>
                    <input type="text" id="staffName" placeholder="Juan Dela Cruz" value={staffName} onChange={(e) => setStaffName(e.target.value)} />
                </div>
                <div className="sform-group">
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" placeholder="juandelacruz@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="sform-group">
                    <label htmlFor="password">Password:</label>
                    <input type="text" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
