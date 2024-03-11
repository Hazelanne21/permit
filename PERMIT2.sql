CREATE TABLE AcademicYear (
    Year VARCHAR(20) PRIMARY KEY
);

CREATE TABLE Students(
    Student_Number VARCHAR(255) NOT NULL PRIMARY KEY,
    Student_Name VARCHAR(255),
    Year VARCHAR(20),
    Password VARCHAR(255) NOT NULL,
    Gbox VARCHAR(255),
    Mobile_Number VARCHAR(255),
    FOREIGN KEY (Year) REFERENCES AcademicYear(Year)
);

CREATE TABLE Subject (
    Subject_Code VARCHAR(255) PRIMARY KEY,
    Description VARCHAR(255) NOT NULL,
    Semester VARCHAR(20) NOT NULL,
    Year VARCHAR(20),
    FOREIGN KEY (Year) REFERENCES AcademicYear(Year)
);

CREATE TABLE Staff (
    Staff_Name VARCHAR(255) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL
);

CREATE TABLE ListofStudent (
    TuitionList_ID SERIAL PRIMARY KEY,
    Student_Number VARCHAR(255) NOT NULL,
    Prelim_Status VARCHAR(50) DEFAULT 'Unpaid',
    Midterm_Status VARCHAR(50) DEFAULT 'Unpaid',
    SemiFinal_Status VARCHAR(50) DEFAULT 'Unpaid',
    Final_Status VARCHAR(50) DEFAULT 'Unpaid',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Student_Number) REFERENCES Students(Student_Number)
);

CREATE TABLE Permit (
    Permit_Number SERIAL PRIMARY KEY,
    Student_Number VARCHAR(255),
    Student_Name VARCHAR(255),
    Exam VARCHAR(50) NOT NULL,
    Date_Release DATE NOT NULL,
    Year VARCHAR(20),
    Subject_Code VARCHAR(255),
    Description VARCHAR(255),
    Sequence_No VARCHAR(255) NOT NULL,
    FOREIGN KEY (Student_Number) REFERENCES Students(Student_Number),
    FOREIGN KEY (Subject_Code) REFERENCES Subject (Subject_Code),
    FOREIGN KEY (Year) REFERENCES AcademicYear(Year)
);