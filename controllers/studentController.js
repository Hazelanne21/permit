const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const config = require('../config');

class StudentController {
  
  // Register a new student 
  static async create(req, res) {
    try {
        const { Student_Number, Student_Name, Password, Gbox, Mobile_Number, Year } = req.body;

        if (!Password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const mobileRegex = /^09\d{9}$/; 
        if (!mobileRegex.test(Mobile_Number)) {
            return res.status(400).json({ error: 'Invalid mobile number format' });
        }

        const gboxRegex = /^[a-zA-Z0-9._%+-]+@gbox\.ncf\.edu\.ph$/; 
        if (!gboxRegex.test(Gbox)) {
            return res.status(400).json({ error: 'Invalid Gbox format. It should end with @gbox.ncf.edu.ph' });
        }
      
        const checkExistingStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ? OR Student_Name = ? OR Gbox = ?';
        const [existingRows] = await db.promise().execute(checkExistingStudentQuery, [Student_Number, Student_Name, Gbox]);

        if (existingRows.length > 0) {
            return res.status(400).json({ error: 'Student with the same Student Number, Name, or Gbox already exists' });
        }


        const insertStudentQuery = 'INSERT INTO Student (Student_Number, Student_Name, Year, Password, Gbox, Mobile_Number) VALUES (?, ?, ?, ?, ?, ?)';
        await db.promise().execute(insertStudentQuery, [Student_Number, Student_Name, Year, hashedPassword, Gbox, Mobile_Number]);

        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}




  // Login for student
  static async login(req, res) {
    try {
      const { Student_Number, Password } = req.body;
  
      const getStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ?';
      const [rows] = await db.promise().execute(getStudentQuery, [Student_Number]);
  
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid Student Number or password' });
      }
  
      const student = rows[0];
      if (!student.Password) {
        return res.status(401).json({ error: 'Invalid Student Number or password' });
      }
  
      const passwordMatch = await bcrypt.compare(Password, student.Password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid Student Number or password' });
      }
  
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
      res.status(200).json({ message: 'Student logged out successfully' });
    } catch (error) {
      console.error('Error logging out student:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
 
//Update student
  static async update(req, res) {
    try {
      const { Student_Number, Student_Name, Password, Gbox, Mobile_Number, Year } = req.body;
      const hashedPassword = await bcrypt.hash(Password, 10);
   
      const mobileRegex = /^09\d{9}$/;
      if (Mobile_Number && !mobileRegex.test(Mobile_Number)) {
        return res.status(400).json({ error: 'Invalid mobile number format' });
      }

      const gboxRegex = /^[a-zA-Z0-9._%+-]+@gbox\.ncf\.edu\.ph$/;
      if (Gbox && !gboxRegex.test(Gbox)) {
        return res.status(400).json({ error: 'Invalid Gbox format. It should end with @gbox.ncf.edu.ph' });
      }

      const checkExistingStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ?';
      const [existingRows] = await db.promise().execute(checkExistingStudentQuery, [Student_Number]);

      if (existingRows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

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
      const checkExistingStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ?';
      const [existingRows] = await db.promise().execute(checkExistingStudentQuery, [Student_Number]);

      if (existingRows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const deleteStudentQuery = 'DELETE FROM Student WHERE Student_Number = ?';
      await db.promise().execute(deleteStudentQuery, [Student_Number]);

      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }






//GET PERMIT OF STUDENT
  static async getPermit(req, res) {
    try {
      const { Student_Number, Exam, Semester } = req.body;
      const getStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ?';
      const [studentRows] = await db.promise().execute(getStudentQuery, [Student_Number]);
  
      if (studentRows.length === 0) {
        return res.status(400).json({ error: 'Student not found' });
      }
  
      const student = studentRows[0];
      const checkTuitionListQuery = 'SELECT * FROM TuitionList WHERE Student_Number = ?';
      const [tuitionListRows] = await db.promise().execute(checkTuitionListQuery, [Student_Number]);
  
      if (tuitionListRows.length === 0) {
        return res.status(400).json({
          error: 'Your Payment is on Processing Mode. Please wait a few hours or contact the Cashier or Accounting for assistance. Thank you and have a nice day.',
        });
      }
  
      const getTuitionListQuery = `SELECT * FROM TuitionList WHERE Student_Number = ? AND ${Exam}_Status = 'Paid'`;
      const [tuitionListStatusRows] = await db.promise().execute(getTuitionListQuery, [Student_Number]);
  
      if (tuitionListStatusRows.length === 0) {
        return res.status(400).json({ error: `Tuition not paid for ${Exam} exam` });
      }
  
      const getSubjectQuery = `
        SELECT Subject.Subject_Code, Subject.Description
        FROM Subject
        JOIN Student ON Subject.Year = Student.Year
        WHERE Student.Student_Number = ? AND Subject.Semester = ?
      `;
      const [subjectRows] = await db.promise().execute(getSubjectQuery, [Student_Number, Semester]);
  
      const permitDetails = {
        Message: `Permit for ${Exam} exam generated successfully`,
        Student_Number: student.Student_Number,
        Student_Name: student.Student_Name,
        Exam: Exam,
        Date_Release: new Date().toISOString().split('T')[0], // Current date
        Year: student.Year,
        Semester: Semester,
        Subjects: subjectRows,
      };
  
      res.status(200).json(permitDetails);
    } catch (error) {
      console.error('Error generating permit:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

}

module.exports = StudentController;