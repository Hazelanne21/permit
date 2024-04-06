    CREATE TABLE YearLevel (
        Year_Level_ID SERIAL PRIMARY KEY,
        Year_Level VARCHAR(20) NOT NULL
    );
    CREATE TABLE Semester (
        Semester_ID SERIAL PRIMARY KEY,
        Semester VARCHAR(20) NOT NULL
    );

    CREATE TABLE Students(
        Student_Number VARCHAR(255) NOT NULL PRIMARY KEY,
        Student_Name VARCHAR(255),
        Year_Level_ID INT,
        Semester_ID INT,
        Password VARCHAR(255) NOT NULL,
        Gbox VARCHAR(255),
        Mobile_Number VARCHAR(255),
        Is_Irregular BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (Year_Level_ID) REFERENCES YearLevel(Year_Level_ID),
        FOREIGN KEY (Semester_ID) REFERENCES Semester(Semester_ID)
    );

    CREATE TABLE Subjects (
        Subject_Code VARCHAR(255) PRIMARY KEY,
        Description VARCHAR(255) NOT NULL,
        Year_Level_ID INT,
        Semester_ID INT,
        FOREIGN KEY (Year_Level_ID) REFERENCES YearLevel(Year_Level_ID),
        FOREIGN KEY (Semester_ID) REFERENCES Semester(Semester_ID)
    );

    CREATE TABLE StudentSubjects (
        Student_Number VARCHAR(255),
        Subject_Code VARCHAR(255),
        FOREIGN KEY (Student_Number) REFERENCES Students(Student_Number),
        FOREIGN KEY (Subject_Code) REFERENCES Subjects(Subject_Code),
        PRIMARY KEY (Student_Number, Subject_Code)
    );

    CREATE TABLE Staff (
        Staff_Name VARCHAR(255) PRIMARY KEY,
        Password VARCHAR(255) NOT NULL,
        Email VARCHAR(255) NOT NULL
    );

    CREATE TABLE TuitionPaymentStatus (
        TuitionList_ID SERIAL PRIMARY KEY,
        Student_Number VARCHAR(255) NOT NULL,
        Prelim_Status BOOLEAN DEFAULT FALSE,
        Midterm_Status BOOLEAN DEFAULT FALSE,
        SemiFinal_Status BOOLEAN DEFAULT FALSE,
        Final_Status BOOLEAN DEFAULT FALSE,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        Staff_Name VARCHAR(255),
        FOREIGN KEY (Student_Number) REFERENCES Students(Student_Number),
        FOREIGN KEY (Staff_Name) REFERENCES Staff(Staff_Name)
    );

    CREATE TABLE Permit (
        Permit_Number SERIAL PRIMARY KEY,
        Student_Number VARCHAR(255),
        Exam VARCHAR(50) NOT NULL,
        Date_Release DATE NOT NULL,
        Subject_Code VARCHAR(255),
        Description VARCHAR(255),
        Sequence_No VARCHAR(255) NOT NULL,
        Staff_Name VARCHAR(255),
        Exam_Period VARCHAR(50) NOT NULL,
        FOREIGN KEY (Student_Number) REFERENCES Students(Student_Number),
        FOREIGN KEY (Subject_Code) REFERENCES Subjects (Subject_Code),
        FOREIGN KEY (Staff_Name) REFERENCES Staff (Staff_Name)
    );