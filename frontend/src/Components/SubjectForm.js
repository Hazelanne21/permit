import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Staffdashboard.css';
import logoImage from '../images/CCS.png';


const StaffDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const navigate = useNavigate(); 

    const [showCreateSubjectModal, setShowCreateSubjectModal] = useState(false);
    const [subjectFormData, setSubjectFormData] = useState({
        Subject_Code: '',
        Description: '',
        Semester_ID: '',
        Year_Level_ID: ''
    });
    const [subjects, setSubjects] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch subjects on component mount
        fetchSubjects();
    }, []);

    const [studentFormData, setStudentFormData] = useState({
        Student_Number: '',
        Prelim_Status: '',
        Midterm_Status: '',
        SemiFinal_Status: '',
        Final_Status: ''
    });

    const [updateAdminFormData, setupdateAdminFormData] = useState({
        Staff_Name: '',
        Email: '',
      
    });
    const [staffInfo, setStaffInfo] = useState({});

    useEffect(() => {
        fetchStaffInfo();
    }, []);



    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleOpenCreateSubjectModal = () => {
        setShowCreateSubjectModal(true);
    };

    const handleCloseCreateSubjectModal = () => {
        setShowCreateSubjectModal(false);
    };

    const handleSubjectInputChange = (e) => {
        const { name, value } = e.target;
        setSubjectFormData({ ...subjectFormData, [name]: value });
    };
    const handleOpenUpdateAdministratorModal = () => {
        setShowUpdateAdministratorModal(true);
    };

    const handleCloseUpdateAdministratorModal = () => {
        setShowUpdateAdministratorModal(false);
    };


    
    const handleStudentInputChange = (e) => {
        const { name, value } = e.target;
        setStudentFormData({ ...studentFormData, [name]: value });
    };

    const handleOpenCreateStudentModal = () => {
        setShowCreateStudentModal(true);
    };

    const handleCloseCreateStudentModal = () => {
        setShowCreateStudentModal(false);
    };

    const handleUpdateAdminInputChange = (e) => {
        const { name, value } = e.target;
        setupdateAdminFormData({ ...updateAdminFormData, [name]: value });
    };

    const fetchStaffInfo = async () => {
        try {
            const response = await fetch('/staff/getallstaff'); 
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setStaffInfo(data[0]);
                }
            } else {
                console.error('Failed to fetch staff info');
            }
        } catch (error) {
            console.error('Error fetching staff info:', error);
        }
    };


    const fetchSubjects = async () => {
        // Fetch subjects from the backend
        try {
            const response = await axios('/subjects');
            if (response.ok) {
                const data = await response.json();
                setSubjects(data);
            } else {
                console.error('Failed to fetch subjects');
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const handleSubmitSubject = async (e) => {
        e.preventDefault();
        // Check if the subject already exists
        const existingSubject = subjects.find(subject => subject.Subject_Code === subjectFormData.Subject_Code);
        if (existingSubject) {
            setErrorMessage('Subject already exists!');
            return;
        }
        // Create new subject
        try {
            const response = await axios.post('/subjects/createSubject', subjectFormData);
            if (response.status === 201) {
                console.log('Subject created successfully');
                const newSubject = { ...subjectFormData };
                setSubjects([...subjects, newSubject]);
                handleCloseCreateSubjectModal();
                setErrorMessage('');
            } else {
                console.error('Failed to create subject');
            }
        } catch (error) {
            console.error('Error creating subject:', error);
        }
    };

    const handleSubmitStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/staff/createTuitionList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentFormData)
            });
            if (response.ok) {
                console.log('Student created successfully');
                handleCloseCreateStudentModal();
            } else {
                console.error('Failed to create student');
            }
        } catch (error) {
            console.error('Error creating student:', error);
        }
    };



    const handleSubmitUpdateAdministrator = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/staff/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentFormData)
            });
            if (response.ok) {
                console.log('Administrator updated successfully');
                handleCloseCreateStudentModal();
            } else {
                console.error('Failed to update Administrator');
            }
        } catch (error) {
            console.error('Error updating administrator:', error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        
        navigate('/'); 
    };
    return (
        <div>
            <nav className="navdashboard-container">
            <img src={logoImage} alt="Logo" className="logo-image" />
            <span className="logo-text">College of Computer Studies</span>
                <button onClick={() => handleSectionChange('dashboard')}>Dashboard</button>
                <button onClick={() => handleSectionChange('profile')}>Profile</button>
                <button onClick={() => handleSectionChange('subject')}>Subjects</button>
                <button onClick={() => handleSectionChange('list')}>List of Student</button>
                <button onClick={handleLogout}>Logout</button>
            </nav>
          
            <div className="dashboard-container">
                {activeSection === 'dashboard' && (
                    <h1>Welcome to the Dashboard!</h1>
                )}
                {activeSection === 'profile' && (
                    <div>
                        <h1>Administrator Information</h1>
                        <button className="Update-button" onClick={handleOpenUpdateAdministratorModal}>Update Administrator</button>
                        <p>Staff Name: {staffInfo.Staff_Name}</p>
                        <p>Email: {staffInfo.Email}</p>
                    </div>
                )}
               {activeSection === 'subject' && (
                    <div>
                        <h1>Subjects</h1>
                        <input className="search-bar" placeholder="Search" />
                        <button className="subject-button" onClick={handleOpenCreateSubjectModal}>Add Subject</button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <table>
                            <thead>
                                <tr>
                                    <th>Subject Code</th>
                                    <th>Description</th>
                                    <th>Semester</th>
                                    <th>Year_Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((subject, index) => (
                                    <tr key={index}>
                                        <td>{subject.Subject_Code}</td>
                                        <td>{subject.Description}</td>
                                        <td>{subject.Semester_ID}</td>
                                        <td>{subject.Year_Level_ID}</td>
                                    </tr>
                                ))}
                            </tbody>
        </table>
    </div>
)}

                {activeSection === 'list' && (
                    <div>
                        <h1>List Of Student</h1>
                        <input className="search-bar" placeholder="Search" />
                        <button className="Student-button" onClick={handleOpenCreateStudentModal}>Add Student</button>
                    </div>
                )}
            </div>
            {showCreateSubjectModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseCreateSubjectModal}>&times;</span>
                        <h2>Create Subject</h2>
                        <form onSubmit={handleSubmitSubject}>
                            <label>Subject Code:</label>
                            <input type="text" name="Subject_Code" value={subjectFormData.Subject_Code} onChange={handleSubjectInputChange} />
                            <label>Description:</label>
                            <input type="text" name="Description" value={subjectFormData.Description} onChange={handleSubjectInputChange} />
                            <label htmlFor="semester">Semester:</label>
                            <select
                                id="semester"
                                name="Semester_ID"
                                value={subjectFormData.Semester_ID}
                                onChange={handleSubjectInputChange}
                            >
                                <option value="">Select Semester</option>
                                <option value="1">1st Semester</option>
                                <option value="2">2nd Semester</option>
                                <option value="3">Summer</option>
                            </select>
                            <label htmlFor="year">Year Level:</label>
                            <select
                                id="year"
                                name="Year_Level_ID"
                                value={subjectFormData.Year_Level_ID}
                                onChange={handleSubjectInputChange}
                            >
                                <option value="">Select Year Level</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                            <button type="submit">Create</button>
            </form>
        </div>
    </div>
)}


            {showCreateStudentModal && (
                <div className="smodal">
                    <div className="smodal-content">
                        <span className="sclose" onClick={handleCloseCreateStudentModal}>&times;</span>
                        <h2>Student Already Paid</h2>
                        <form onSubmit={handleSubmitStudent}>
                            <label>Student Number:</label>
                            <input type="text" name="Student_Number" value={studentFormData.Student_Number} onChange={handleStudentInputChange} />
                            <label>Prelim Status:</label>
                            <input type="text" name="Prelim_Status" value={studentFormData.Prelim_Status} onChange={handleStudentInputChange} />
                            <label>Midterm Status:</label>
                            <input type="text" name="Midterm_Status" value={studentFormData.Midterm_Status} onChange={handleStudentInputChange} />
                            <label>SemiFinal Status:</label>
                            <input type="text" name="SemiFinal_Status" value={studentFormData.SemiFinal_Status} onChange={handleStudentInputChange} />
                            <label>Final Status:</label>
                            <input type="text" name="Final_Status" value={studentFormData.Final_Status} onChange={handleStudentInputChange} />
                            <button type="submit">Create</button>
                        </form>
                    </div>
                </div>
            )}


{showUpdateAdministratorModal && (
    <div className="umodal">
        <div className="umodal-content">
            <span className="uclose" onClick={handleCloseUpdateAdministratorModal}>&times;</span>
            <h2>Update Administrator Information</h2>
            <form onSubmit={handleSubmitUpdateAdministrator}>
                <label>Staff Name:</label>
                <input type="text" name="Staff_Name" value={updateAdminFormData.Staff_Name} onChange={handleUpdateAdminInputChange} />
                <label>Email:</label>
                <input type="text" name="Email" value={updateAdminFormData.Email} onChange={handleUpdateAdminInputChange} />
                <button type="submit">Update</button>
            </form>
        </div>
    </div>
)}
        </div>
    );
};

export default StaffDashboard;