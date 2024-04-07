import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Staffdashboard.css";
import logoImage from "../../images/CCS.png";
import axios from "axios";

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        axios
        .get("http://localhost:5000/subjects")
        .then((response) => {
            setSubjects(response.data);
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
    }, []);
    
    return (
        <div className="container">
        <div className="header">
            <img src={logoImage} alt="Logo" className="logo" />
            <h1>Computer Studies</h1>
        </div>
        <div className="subjects">
            <h2>Subjects</h2>
            <div className="subject-list">
            {subjects.map((subject) => (
                <div
                key={subject.id}
                className="subject"
                onClick={() => navigate(`/Staff/Subjects/${subject.id}`)}
                >
                {subject.name}
                </div>
            ))}
            </div>
        </div>
        </div>
    );
    };
export default Subjects;