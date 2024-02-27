const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const config = require('../config');
class StudentController {
  // Register a new student 


  static async create(req, res) {
    try {
        const { Student_Number, Student_Name, Password, Gbox, Mobile_Number, Year } = req.body;

        // Check if the password is provided
        if (!Password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        // Validate mobile number format
        const mobileRegex = /^09\d{9}$/; // Matches 11 digits starting with "09"
        if (!mobileRegex.test(Mobile_Number)) {
            return res.status(400).json({ error: 'Invalid mobile number format' });
        }

        // Validate Gbox format
        const gboxRegex = /^[a-zA-Z0-9._%+-]+@gbox\.ncf\.edu\.ph$/; // Matches the specified format
        if (!gboxRegex.test(Gbox)) {
            return res.status(400).json({ error: 'Invalid Gbox format. It should end with @gbox.ncf.edu.ph' });
        }

        // Check if the student already exists based on Student_Number, Student_Name, and Gbox
        const checkExistingStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ? OR Student_Name = ? OR Gbox = ?';
        const [existingRows] = await db.promise().execute(checkExistingStudentQuery, [Student_Number, Student_Name, Gbox]);

        if (existingRows.length > 0) {
            return res.status(400).json({ error: 'Student with the same Student Number, Name, or Gbox already exists' });
        }

        // SQL query to insert student details into the database
        const insertStudentQuery = 'INSERT INTO Student (Student_Number, Student_Name, Year, Password, Gbox, Mobile_Number) VALUES (?, ?, ?, ?, ?, ?)';
        await db.promise().execute(insertStudentQuery, [Student_Number, Student_Name, Year, hashedPassword, Gbox, Mobile_Number]);

        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}








static async getAll(req, res) {
  try {
    // SQL query to fetch all users
    const selectUsersQuery = 'SELECT Student_Number, Student_Name, Password, Gbox, Mobile_Number, Year FROM Student';
    db.query(selectUsersQuery, (err, result) => {
      if (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




  // Login for student
  
  static async login(req, res) {
    try {
      const { Student_Number, Password } = req.body;
  
      // SQL query to retrieve student details by student number
      const getStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ?';
      const [rows] = await db.promise().execute(getStudentQuery, [Student_Number]);
  
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid Student Number or password' });
      }
  
      const student = rows[0];
  
      // Ensure that the student has a password before attempting to compare
      if (!student.Password) {
        return res.status(401).json({ error: 'Invalid Student Number or password' });
      }
  
      const passwordMatch = await bcrypt.compare(Password, student.Password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid Student Number or password' });
      }
  
      // Generate a JWT token for the authenticated student
      const token = jwt.sign({ Student_Number: student.Student_Number, Student_Name: student.Student_Name }, config.secretKey, { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in student:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }





  // Logout for student
  static async logout(req, res) {
    try {
      // You can handle any additional cleanup or actions here if needed
      res.status(200).json({ message: 'Student logged out successfully' });
    } catch (error) {
      console.error('Error logging out student:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
 







  static async update(req, res) {
    try {
      const { Student_Number, Student_Name, Password, Gbox, Mobile_Number, Year } = req.body;



      const hashedPassword = await bcrypt.hash(Password, 10);

      // Validate mobile number format
      const mobileRegex = /^09\d{9}$/;
      if (Mobile_Number && !mobileRegex.test(Mobile_Number)) {
        return res.status(400).json({ error: 'Invalid mobile number format' });
      }

      // Validate Gbox format
      const gboxRegex = /^[a-zA-Z0-9._%+-]+@gbox\.ncf\.edu\.ph$/;
      if (Gbox && !gboxRegex.test(Gbox)) {
        return res.status(400).json({ error: 'Invalid Gbox format. It should end with @gbox.ncf.edu.ph' });
      }

      // Check if the student exists based on Student_Number
      const checkExistingStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ?';
      const [existingRows] = await db.promise().execute(checkExistingStudentQuery, [Student_Number]);

      if (existingRows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Update the student details
      const updateStudentQuery = 'UPDATE Student SET Student_Name = ?, Password = ?, Gbox = ?, Mobile_Number = ?, Year = ? WHERE Student_Number = ?';
      await db.promise().execute(updateStudentQuery, [Student_Name, hashedPassword, Gbox, Mobile_Number, Year, Student_Number]);

      res.status(200).json({ message: 'Student details updated successfully' });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Delete student
  static async delete(req, res) {
    try {
      const { Student_Number } = req.body;

      // Check if the student exists based on Student_Number
      const checkExistingStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ?';
      const [existingRows] = await db.promise().execute(checkExistingStudentQuery, [Student_Number]);

      if (existingRows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Delete the student
      const deleteStudentQuery = 'DELETE FROM Student WHERE Student_Number = ?';
      await db.promise().execute(deleteStudentQuery, [Student_Number]);

      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }











  



  static async getPermit(req, res) {
    try {
      const { Student_Number, Exam, Semester } = req.body;

      // Check if permit already exists for the specified student, exam, and semester
      const checkExistingPermitQuery = 'SELECT * FROM Permit WHERE Student_Number = ? AND Exam = ? AND Semester = ?';
      const [existingPermitRows] = await db.promise().execute(checkExistingPermitQuery, [Student_Number, Exam, Semester]);

      if (existingPermitRows.length > 0) {
        return res.status(400).json({ error: 'Permit already exists. Get your permit.' });
      }

      // Retrieve student details
      const getStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ?';
      const [studentRows] = await db.promise().execute(getStudentQuery, [Student_Number]);

      if (studentRows.length === 0) {
        return res.status(400).json({ error: 'Student not found' });
      }

      const student = studentRows[0];

      // Check if tuition list is created for the specified student
      const checkTuitionListQuery = 'SELECT * FROM TuitionList WHERE Student_Number = ?';
      const [tuitionListRows] = await db.promise().execute(checkTuitionListQuery, [Student_Number]);

      if (tuitionListRows.length === 0) {
        // Tuition list not created yet, return processing message
        return res.status(400).json({
          error: 'Your Payment is on Processing Mode. Please wait a few hours or contact the Cashier or Accounting for assistance. Thank you and have a nice day.',
        });
      }

      // Check if the payment status for the specified exam is 'Paid'
      const getTuitionListQuery = `SELECT * FROM TuitionList WHERE Student_Number = ? AND ${Exam}_Status = 'Paid'`;
      const [tuitionListStatusRows] = await db.promise().execute(getTuitionListQuery, [Student_Number]);

      if (tuitionListStatusRows.length === 0) {
        return res.status(400).json({ error: `Tuition not paid for ${Exam} exam` });
      }

      // Retrieve subject details for the specified semester
      const getSubjectQuery = `
        SELECT Subject.Subject_Code, Subject.Description
        FROM Subject
        JOIN Student ON Subject.Year = Student.Year
        WHERE Student.Student_Number = ? AND Subject.Semester = ?
      `;
      const [subjectRows] = await db.promise().execute(getSubjectQuery, [Student_Number, Semester]);

      // Prepare permit details
      const permitDetails = {
        Message: `Permit for ${Exam} exam generated successfully`,
        Student_Number: student.Student_Number,
        Student_Name: student.Student_Name,
        Exam: Exam,
        Date_Release: new Date().toISOString().split('T')[0], // Current date
        Year: student.Year,
        Semester: Semester,
        Subjects: [],
      };

      // Store permit details in the database
      for (const subject of subjectRows) {
        const { Subject_Code, Description } = subject;

        // Check if subject already exists in the permit
        const checkExistingSubjectQuery = 'SELECT * FROM Permit WHERE Student_Number = ? AND Exam = ? AND Semester = ? AND Subject_Code = ?';
        const [existingSubjectRows] = await db.promise().execute(checkExistingSubjectQuery, [Student_Number, Exam, Semester, Subject_Code]);

        if (existingSubjectRows.length === 0) {
          // Subject does not exist in the permit, store it in the database
          const insertPermitQuery = 'INSERT INTO Permit (Student_Number, Student_Name, Exam, Date_Release, Year, Semester, Subject_Code, Description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
          await db.promise().execute(insertPermitQuery, [
            permitDetails.Student_Number,
            permitDetails.Student_Name,
            permitDetails.Exam,
            permitDetails.Date_Release,
            permitDetails.Year,
            permitDetails.Semester,
            Subject_Code,
            Description,
          ]);

          permitDetails.Subjects.push(subject);
        } else {
          // Subject already exists in the permit, return error message
          return res.status(400).json({ error: `Subject ${Subject_Code} already exists in the permit` });
        }
      }

      res.status(200).json(permitDetails);
    } catch (error) {
      console.error('Error generating permit:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


 












  static async getAllPermits(req, res) {
    try {
      const { exam, semester, year } = req.query;

      // Construct the SQL query based on the provided filters
      let selectPermitsQuery = 'SELECT Student_Number, Student_Name, Exam, Date_Release, Year, Semester, GROUP_CONCAT(CONCAT(Subject_Code, " - ", Description) SEPARATOR ", ") AS Subjects FROM Permit';
      let whereClause = '';

      if (exam) {
        whereClause += ` Exam = '${exam}'`;
      }

      if (semester) {
        if (whereClause) {
          whereClause += ' AND';
        }
        whereClause += ` Semester = '${semester}'`;
      }

      if (year) {
        if (whereClause) {
          whereClause += ' AND';
        }
        whereClause += ` Year = '${year}'`;
      }

      if (whereClause) {
        selectPermitsQuery += ` WHERE${whereClause}`;
      }

      selectPermitsQuery += ' GROUP BY Student_Number, Student_Name, Exam, Date_Release, Year, Semester';

      db.query(selectPermitsQuery, (err, result) => {
        if (err) {
          console.error('Error fetching permits:', err);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          const permits = result.map((permit) => ({
            Student_Number: permit.Student_Number,
            Student_Name: permit.Student_Name,
            Exam: permit.Exam,
            Date_Release: permit.Date_Release,
            Year: permit.Year,
            Semester: permit.Semester,
            Subjects: permit.Subjects,
          }));
        }
      });

      if (whereClause) {
        selectPermitsQuery += ` WHERE${whereClause}`;
      }

      db.query(selectPermitsQuery, (err, result) => {
        if (err) {
          console.error('Error fetching permits:', err);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          const permits = result.map((permit) => ({
            Student_Number: permit.Student_Number,
            Student_Name: permit.Student_Name,
            Exam: permit.Exam,
            Date_Release: permit.Date_Release,
            Year: permit.Year,
            Semester: permit.Semester,
            Subjects: permit.Subjects,
          }));

          res.status(200).json(permits);
        }
      });
    } catch (error) {
      console.error('Error loading permits:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  





module.exports = StudentController;
