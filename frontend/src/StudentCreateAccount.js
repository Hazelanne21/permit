import React, { useState } from 'react';
import axios from 'axios';

const StudentCreateAccount = () => {
    const [studentNumber, setStudentNumber] = useState('');
    const [studentName, setStudentName] = useState('');
    const [password, setPassword] = useState('');
    const [gbox, setGbox] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post('http://localhost:3000/student/create', {
                Student_Number: studentNumber,
                Student_Name: studentName,
                Password: password,
                Gbox: gbox,
                Mobile_Number: mobileNumber,
                Year: '1st Year' // Assuming year is fixed for now
            });
            if (response.status === 201) {
                setSuccess(true);
                setStudentNumber('');
                setStudentName('');
                setPassword('');
                setGbox('');
                setMobileNumber('');
            }
        } catch (error) {
            setError('Account creation failed. Please try again.');
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
                        type="studentNumber"
                        id="studentNumber"
                        placeholder="21-1234"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
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
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="gbox">Gbox:</label>
                    <input
                        type="text"
                        id="gbox"
                        placeholder="jdc@gbox.ncf.edu.ph"
                        value={gbox}
                        onChange={(e) => setGbox(e.target.value)}
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
                    />
                </div>

                <button
                    type="submit"
                    className={`mcreate-button ${loading ? 'disabled' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Account'}
                </button>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Account created successfully!</p>}
            </form>
        </div>
    );
};

export default StudentCreateAccount;
