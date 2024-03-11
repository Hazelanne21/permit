CREATE DATABASE permit;
USE permit;


CREATE TABLE Student (
    Student_Number VARCHAR(255) NOT NULL PRIMARY KEY,
    Student_Name VARCHAR(255),
    Year VARCHAR(20),
    Password VARCHAR(255) NOT NULL,
    Gbox VARCHAR(255),
    Mobile_Number VARCHAR(255),
    INDEX idx_Student_Year (Year),
    INDEX idx_Student_Number_Name (Student_Number, Student_Name) 
);


CREATE TABLE Subject (
    Subject_Code VARCHAR(255) PRIMARY KEY,
    Description VARCHAR(255) NOT NULL,
    Semester VARCHAR(20) NOT NULL,
    Year VARCHAR(20),
    FOREIGN KEY (Year) REFERENCES Student (Year)
);
ALTER TABLE Subject DROP FOREIGN KEY subject_ibfk_1;

CREATE TABLE Staff (
    Staff_Name VARCHAR(255) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL
);

CREATE TABLE ListofStudent (
    TuitionList_ID INT PRIMARY KEY AUTO_INCREMENT,
    Student_Number VARCHAR(255) NOT NULL,
    Prelim_Status VARCHAR(50) DEFAULT 'Unpaid',
    Midterm_Status VARCHAR(50) DEFAULT 'Unpaid',
    SemiFinal_Status VARCHAR(50) DEFAULT 'Unpaid',
    Final_Status VARCHAR(50) DEFAULT 'Unpaid',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Student_Number) REFERENCES Student (Student_Number)
);





CREATE TABLE Permit (
    Permit_Number INT PRIMARY KEY AUTO_INCREMENT,
    Student_Number VARCHAR(255),
    Student_Name VARCHAR(255),
    Exam VARCHAR(50) NOT NULL,
    Date_Release DATE NOT NULL,
    Year VARCHAR(20),
    Subject_Code VARCHAR(255),
    Description VARCHAR(255),
    Sequence_No VARCHAR(255) NOT NULL,
    FOREIGN KEY (Student_Number, Student_Name) REFERENCES Student (Student_Number, Student_Name),
    FOREIGN KEY (Subject_Code) REFERENCES Subject (Subject_Code),
    FOREIGN KEY (Year) REFERENCES Student (Year)
);

INSERT INTO Subject (Subject_Code, Description, Semester, Year) VALUES
   ('CS101', 'Introduction to Computing', 'First Semester',  '1st Year'),
	('CS102', 'Fundamentals of Programming', 'First Semester', '1st Year'),
    ('GEC_2', 'Understanding the Self', 'First Semester', '1st Year'),
    ('GEC_3', 'Readings in Philippine History', 'First Semester', '1st Year'),
    ('GEC_4', 'Mathematics in the Modern World', 'First Semester', '1st Year'),
    ('GEC_5', 'The Contemporary World', 'First Semester', '1st Year'),
    ('IRS_1', 'NCEAN Development Program', 'First Semester', '1st Year'),
    ('NSTP_1A', 'CWTS', 'First Semester', '1st Year'),
    ('PE1', 'Physical Fitness', 'First Semester', '1st Year'),
    ('CS_103A', 'Intermediate Programming', 'Second Semester', '1st Year'),
    ('CS_104A', 'Data Structures and Algorithm', 'Second Semester', '1st Year'),
    ('GEC_1', 'Purposive Communication', 'Second Semester', '1st Year'),
    ('GEC_6', 'Art Appreciation', 'Second Semester', '1st Year'),
    ('GEC_7', 'Science, Technology and Society', 'Second Semester', '1st Year'),
    ('GEC_8', 'Ethics', 'Second Semester', '1st Year'),
    ('IRS_2', 'Enhancing Skills in English', 'Second Semester', '1st Year'),
    ('NSTP_2', 'Reserve Officer Training Corps', 'Second Semester', '1st Year'),
    ('PE_2', 'Rhythmic Activities', 'Second Semester', '1st Year'),
    ('CSELEC1', 'CSElec1: Parallel and Distributed Computing', 'First Semester', '2nd Year'),
    ('CS_205', 'Information Management', 'First Semester', '2nd Year'),
    ('CS_206', 'Applications Development & Emerging Technologies', 'First Semester', '2nd Year'),
    ('CS_207', 'Discrete Structures 1', 'First Semester', '2nd Year'),
    ('GEC_10N', 'Philippine Indigenous Communities', 'First Semester', '2nd Year'),
    ('GEC_9N', 'Living in the IT Era', 'First Semester', '2nd Year'),
    ('MAND_COURSE', 'Life and Works of Rizal', 'First Semester', '2nd Year'),
    ('PE3', 'Physical Education 3', 'First Semester', '2nd Year'),
    ('CS_208', 'Discrete Structures 2', 'Second Semester', '2nd Year'),
    ('CS_209', 'Object-Oriented Programming', 'Second Semester', '2nd Year'),
    ('CS_210', 'Algorithms and Complexity', 'Second Semester', '2nd Year'),
    ('CS_211', 'Automata Theory and Formal Languages', 'Second Semester', '2nd Year'),
	('CS_212', 'Architecture and Organization', 'Second Semester', '2nd Year'),
    ('CS_213', 'Information Assurance and Security', 'Second Semester', '2nd Year'),
    ('GEC_11N', 'Philippine Popular Culture', 'Second Semester', '2nd Year'),
    ('PE4', 'Team Sports', 'Second Semester', '2nd Year'),
    ('CSELEC2', 'CSElec2: Intelligent Systems', 'First Semester', '3rd Year'),
    ('CSFE1', 'CS Free Elective 1: Methods of Research for CS', 'First Semester', '3rd Year'),
    ('CS_314', 'Human Computer Interaction', 'First Semester', '3rd Year'),
    ('CS_315', 'Networks and Communications', 'First Semester', '3rd Year'),
    ('CS_316', 'Operating Systems', 'First Semester', '3rd Year'),
    ('CS_317', 'Programming Languages', 'First Semester', '3rd Year'),
    ('CS_318', 'Software Engineering 1', 'First Semester', '3rd Year'),
    ('CSELEC3', 'CSElec3: Systems Fundamentals', 'Second Semester', '3rd Year'),
    ('CSFE2', 'CS Free Elec2', 'Second Semester', '3rd Year'),
    ('CSFE3', 'CS Free Elec3', 'Second Semester', '3rd Year'),
    ('CS_319', 'Software Engineering 2', 'Second Semester', '3rd Year'),
    ('CS_320', 'Social Issues and Professional Practice', 'Second Semester', '3rd Year'),
    ('CS_321', 'CS Thesis Writing 1', 'Second Semester', '3rd Year'),
    ('CSFE4', 'CS Free Elec4', 'First Semester', '4th Year'),
    ('CSFE5', 'CS Free Elec5', 'First Semester', '4th Year'),
    ('CSFE6', 'CS Free Elec6', 'First Semester', '4th Year'),
    ('CS_422', 'CS Thesis Writing 2', 'First Semester', '4th Year'),
    ('MATHELEC', 'Math Elec: Inferential Statistics', 'First Semester', '4th Year'),
    ('CS_423', 'Practicum', 'Second Semester', '4th Year');


SELECT * FROM Student;
SELECT * FROM Subject;
SELECT * FROM Subject WHERE Year = '3rd Year' AND Semester = 'Second Semester';

SELECT * FROM Staff;
SELECT * FROM ListofStudent;



SELECT * FROM permit;