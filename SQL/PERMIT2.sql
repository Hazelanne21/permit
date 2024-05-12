CREATE TABLE YearLevel (
    Year_Level_ID SERIAL PRIMARY KEY,
    Year_Level VARCHAR(20) NOT NULL
);

CREATE TABLE Course (
    Course_ID SERIAL PRIMARY KEY,
    Course VARCHAR(20) NOT NULL
);


CREATE TABLE Semester (
    Semester_ID SERIAL PRIMARY KEY,
    Semester VARCHAR(20) NOT NULL
);

CREATE TABLE Students (
    Student_ID SERIAL PRIMARY KEY,
    Student_Number VARCHAR(255) NOT NULL,
    Student_Name VARCHAR(255),
    Year_Level_ID INT,
    Course_ID INT, -- Corrected column name
    Semester_ID INT,
    Password VARCHAR(255) NOT NULL,
    Gbox VARCHAR(255),
    Mobile_Number VARCHAR(255),
    Is_Irregular BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Year_Level_ID) REFERENCES YearLevel(Year_Level_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID),
    FOREIGN KEY (Semester_ID) REFERENCES Semester(Semester_ID)
);

CREATE TABLE Subjects (
    Subject_ID SERIAL PRIMARY KEY,
    Subject_Code VARCHAR(255) NOT NULL UNIQUE,
    Name VARCHAR(255) NOT NULL,
    Year_Level_ID INT,
    Semester_ID INT,
    Course_ID INT, 
    FOREIGN KEY (Year_Level_ID) REFERENCES YearLevel(Year_Level_ID),
    FOREIGN KEY (Semester_ID) REFERENCES Semester(Semester_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
);


CREATE TABLE StudentSubjects (
    Student_ID INT,
    Subject_ID INT,
    FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    FOREIGN KEY (Subject_ID) REFERENCES Subjects(Subject_ID),
    PRIMARY KEY (Student_ID, Subject_ID)
);

CREATE TABLE Staff (
    Staff_ID SERIAL PRIMARY KEY,
    Staff_Name VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL
);

CREATE TABLE TuitionPaymentStatus (
    TuitionList_ID SERIAL PRIMARY KEY,
    Student_ID INT NOT NULL,
    Prelim_Status BOOLEAN DEFAULT FALSE,
    Midterm_Status BOOLEAN DEFAULT FALSE,
    SemiFinal_Status BOOLEAN DEFAULT FALSE,
    Final_Status BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Staff_ID INT,
    FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    FOREIGN KEY (Staff_ID) REFERENCES Staff(Staff_ID)
);

CREATE TABLE Permit (
    Permit_ID SERIAL PRIMARY KEY,
    Permit_Number VARCHAR(255) NOT NULL,
    Student_ID INT NOT NULL,
    Subject_ID INT,
    Exam VARCHAR(50) NOT NULL,
    Date_Release DATE NOT NULL,
    Name VARCHAR(255),
    Sequence_No VARCHAR(255) NOT NULL,
    Staff_ID INT,
    Exam_Period VARCHAR(50) NOT NULL,
    FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    FOREIGN KEY (Staff_ID) REFERENCES Staff (Staff_ID),
    FOREIGN KEY (Subject_ID) REFERENCES Subjects(Subject_ID)
);
