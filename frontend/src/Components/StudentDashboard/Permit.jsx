import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faAngleDown,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Image from "../images/ncf.png";

const [permits, setPermits] = useState([]);
const [isPermitModalOpen, setPermitModalOpen] = useState(false);

  // PERMIT

  const [permitFormData, setPermitFormData] = useState({
    examType: "",
    semester: "",
  });

  const handlePermitInputChange = (e) => {
    const { name, value } = e.target;
    setPermitFormData({ ...permitFormData, [name]: value });
  };

  const togglePermitModal = () => {
    console.log("Toggling permit modal");
    setPermitModalOpen(!isPermitModalOpen);
  };

  const handleSubmitPermit = () => {
    // Handle permit submission
    console.log("Permit submitted:", permitFormData);
    // Close the modal after submission
    setPermitModalOpen(false);
  };

  const [isPermitExampleOpen, setPermitExampleOpen] = useState(false);

  const togglePermitExample = () => {
    setPermitExampleOpen(!isPermitExampleOpen);
  };

  const handleDownloadPermit = () => {
    // Implement the logic to download the permit
    console.log("Permit downloaded");
  };

const Permit = ({ permits, handleDownloadPermit, isPermitExampleOpen, togglePermitExample }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handlePhotoSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedPhoto(null);
    }
  };

  return (
    <div>
      {isPermitExampleOpen && (
        <div className="modal">
          <div className="permit-content">
            <span className="permit-close" onClick={togglePermitExample}>
              &times;
            </span>
            <div className="modal-address">
              <img src={Image} alt="Logo" className="modal-logo" />
              <div>
                <p className="address-text">Naga College Foundation</p>
                <p className="address-text">Naga City, Camarines Sur</p>
              </div>
            </div>
            {permits.map((permit, index) => (
              <div key={index}>
                <p>ID number of the student: {permit.Student_Number}</p>
                <p>Examination: {permit.Exam}</p>
                <p>Student's name: {permit.Student_Name}</p>
                <p>Course and level: {permit.Year}</p>
                <p>Semester: {permit.Semester}</p>
                <p>List of Subjects:</p>
                <ul>
                  {permit.Subjects.map((subject, index) => (
                    <li key={index}>{subject}</li>
                  ))}
                </ul>
                <p>Sequence number: {permit.SequenceNumber}</p>
                <p>Released by: {permit.ReleasedBy}</p>
                <button onClick={handleDownloadPermit}>Download Permit</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Selection Dropdown */}
      <div className={`dropdown ${selectedPhoto ? "active" : ""}`}>
        <button className="dropbtn">
          {selectedPhoto ? (
            <img
              src={selectedPhoto}
              alt="Selected"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          ) : (
            <>
              Select Photo <FontAwesomeIcon icon={faAngleDown} />
            </>
          )}
        </button>
        {selectedPhoto && (
          <div className="dropdown-content">
            <label className="browse-btn" htmlFor="photo-upload">
              Change Photo
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoSelection}
              style={{ display: "none" }} // Hide the input element
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Permit;
