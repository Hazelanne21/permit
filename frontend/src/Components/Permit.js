import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const Permit = ({ permit }) => {
  return (
    <div className="permit-card">
      <div className="permit-logo">
        <FontAwesomeIcon icon={faDownload} />
      </div>
      <div className="permit-info">
        <p>ID number of the student: {permit.Student_Number}</p>
        <p>Examination: {permit.Exam}</p>
        <p>Student's name: {permit.Student_Name}</p>
        <p>Course and level: {permit.Year}</p >
        <p>Semester: {permit.Semester}</p>
        <p>List of Subjects:</p>
        <ul>
          {permit.Subjects.map((subject, index) => (
            <li key={index}>{subject}</li>
          ))}j
        </ul>
        <p>Sequence number: {permit.SequenceNumber}</p>
        <p>Released by: {permit.ReleasedBy}</p>
      </div>
    </div>
  );
};

export default Permit;