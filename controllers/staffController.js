// STAFFCONTROLLER.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const config = require('../config');

class StaffController {
    static async create(req, res) {
        try {
          const { Staff_Name, Password, Email } = req.body;
    
          if (!Password) {
            return res.status(400).json({ error: 'Password is required' });
          }
     
          const staffEmail = Email || 'hazel@gmail.com';
  
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(staffEmail)) {
            return res.status(400).json({ error: 'Invalid email format' });
          }
    
          const hashedPassword = await bcrypt.hash(Password, 10);
  
          const checkExistingStaffQuery = 'SELECT * FROM Staff WHERE Staff_Name = ?';
          const [existingRows] = await db.promise().execute(checkExistingStaffQuery, [Staff_Name]);
    
          if (existingRows.length > 0) {
            return res.status(400).json({ error: 'Staff with the same Staff Name already exists' });
          }
    
    
          const insertStaffQuery = 'INSERT INTO Staff (Staff_Name, Password, Email) VALUES (?, ?, ?)';
          await db.promise().execute(insertStaffQuery, [Staff_Name, hashedPassword, staffEmail]);
    
          res.status(201).json({ message: 'Staff member created successfully' });
        } catch (error) {
          console.error('Error creating staff member:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
    

static async login(req, res) {
  try {
    const { Email, Password } = req.body;

    // SQL query to retrieve staff details by email
    const getStaffQuery = 'SELECT * FROM Staff WHERE Email = ?';
    const [rows] = await db.promise().execute(getStaffQuery, [Email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid Email or password' });
    }

    const staff = rows[0];


    if (!staff.Password) {
      return res.status(401).json({ error: 'Invalid Email or password' });
    }

    const passwordMatch = await bcrypt.compare(Password, staff.Password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid Email or password' });
    }


    const token = jwt.sign({ Email: staff.Email }, config.secretKey, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in staff:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

static async getallstaff(req, res) {
  try {
    // SQL query to fetch all users
    const selectUsersQuery = 'SELECT Staff_Name, Email, Password FROM Staff';
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

 //update staff

 static async update(req, res) {
  try {
    const { Staff_Name, Password, Email } = req.body;


    const checkExistingStaffQuery = 'SELECT * FROM Staff WHERE Staff_Name = ?';
    const [existingRows] = await db.promise().execute(checkExistingStaffQuery, [Staff_Name]);

    if (existingRows.length === 0) {
      return res.status(400).json({ error: 'Staff with the given Staff Name does not exist' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);


    const updateStaffQuery = 'UPDATE Staff SET Password = ?, Email = ? WHERE Staff_Name = ?';
    await db.promise().execute(updateStaffQuery, [hashedPassword, Email, Staff_Name]);

    res.status(200).json({ message: 'Staff details updated successfully' });
  } catch (error) {
    console.error('Error updating staff details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


//delete staff
static async delete(req, res) {
  try {
    const { Staff_Name } = req.body;

    const checkExistingStaffQuery = 'SELECT * FROM Staff WHERE Staff_Name = ?';
    const [existingRows] = await db.promise().execute(checkExistingStaffQuery, [Staff_Name]);

    if (existingRows.length === 0) {
      return res.status(400).json({ error: 'Staff with the given Staff Name does not exist' });
    }

    const deleteStaffQuery = 'DELETE FROM Staff WHERE Staff_Name = ?';
    await db.promise().execute(deleteStaffQuery, [Staff_Name]);

    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




  // Logout for staff
  static async logout(req, res) {
    try {
 
      res.status(200).json({ message: 'Staff logged out successfully' });
    } catch (error) {
      console.error('Error logging out staff:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }







  static async createTuitionList(req, res) {
    try {
        const { tuitionList } = req.body;

        if (!tuitionList || !Array.isArray(tuitionList)) {
            return res.status(400).json({ error: 'Invalid tuition list format' });
        }

        const duplicateEntries = []; 

        for (const entry of tuitionList) {
            const { Student_Number, Prelim_Status, Midterm_Status, SemiFinal_Status, Final_Status } = entry;

     
            const checkExistingStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ?';
            const [existingStudentRows] = await db.promise().execute(checkExistingStudentQuery, [Student_Number]);

            if (existingStudentRows.length === 0) {
                console.warn(`Student with Student_Number ${Student_Number} does not exist. Skipping entry.`);
                continue; 
            }

            const checkExistingTuitionListQuery = 'SELECT * FROM TuitionList WHERE Student_Number = ?';
            const [existingTuitionListRows] = await db.promise().execute(checkExistingTuitionListQuery, [Student_Number]);

            if (existingTuitionListRows.length > 0) {
    
                duplicateEntries.push(Student_Number);
                continue; 
            }

            
            const insertTuitionListQuery = `
              INSERT INTO TuitionList (Student_Number, Prelim_Status, Midterm_Status, SemiFinal_Status, Final_Status)
              VALUES (?, ?, ?, ?, ?);
            `;

    
            const params = [
                Student_Number,
                Prelim_Status || null,
                Midterm_Status || null,
                SemiFinal_Status || null,
                Final_Status || null,
            ];

            await db
                .promise()
                .execute(insertTuitionListQuery, params);
        }

        if (duplicateEntries.length > 0) {
            console.warn(`Duplicate entries found for student numbers: ${duplicateEntries.join(', ')}`);
        }

        res.status(201).json({ message: 'Tuition list created successfully' });
    } catch (error) {
        console.error('Error creating tuition list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}





//Update Student List
static async updateTuitionList(req, res) {
  try {
    const { Student_Number, Prelim_Status, Midterm_Status, SemiFinal_Status, Final_Status } = req.body;


    const checkExistingStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ?';
    const [existingStudentRows] = await db.promise().execute(checkExistingStudentQuery, [Student_Number]);

    if (existingStudentRows.length === 0) {
      return res.status(400).json({ error: `Student with Student Number ${Student_Number} does not exist` });
    }

    const updateTuitionListQuery = `
      UPDATE TuitionList
      SET Prelim_Status = ?,
          Midterm_Status = ?,
          SemiFinal_Status = ?,
          Final_Status = ?
      WHERE Student_Number = ?;
    `;

    const params = [
      Prelim_Status !== undefined ? Prelim_Status : null,
      Midterm_Status !== undefined ? Midterm_Status : null,
      SemiFinal_Status !== undefined ? SemiFinal_Status : null,
      Final_Status !== undefined ? Final_Status : null,
      Student_Number
    ];

    await db.promise().execute(updateTuitionListQuery, params);

    res.status(200).json({ message: 'Tuition list updated successfully' });
  } catch (error) {
    console.error('Error updating tuition list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




// Delete a Student List
static async deleteTuitionList(req, res) {
  try {
    const { Student_Number } = req.body;


    const checkExistingStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ?';
    const [existingStudentRows] = await db.promise().execute(checkExistingStudentQuery, [Student_Number]);

    if (existingStudentRows.length === 0) {
      return res.status(400).json({ error: `Student with Student Number ${Student_Number} does not exist` });
    }

 
    const deleteTuitionListQuery = 'DELETE FROM TuitionList WHERE Student_Number = ?';

    await db.promise().execute(deleteTuitionListQuery, [Student_Number]);

    res.status(200).json({ message: 'Tuition list entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting tuition list entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}





static async createSubject(req, res) {
  try {
    const { Subject_Code, Description, Semester, Year } = req.body;


    const checkExistingSubjectQuery = 'SELECT * FROM Subject WHERE Subject_Code = ?';
    const [existingSubjectRows] = await db.promise().execute(checkExistingSubjectQuery, [Subject_Code]);

    if (existingSubjectRows.length > 0) {
      return res.status(400).json({ error: 'Subject with the same Subject Code already exists' });
    }


    const insertSubjectQuery = 'INSERT INTO Subject (Subject_Code, Description, Semester, Year) VALUES (?, ?, ?, ?)';
    await db.promise().execute(insertSubjectQuery, [Subject_Code, Description, Semester, Year]);

    res.status(201).json({ message: 'Subject created successfully' });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


static async deleteSubject(req, res) {
  try {
    const { Subject_Code } = req.body;


    const checkExistingSubjectQuery = 'SELECT * FROM Subject WHERE Subject_Code = ?';
    const [existingSubjectRows] = await db.promise().execute(checkExistingSubjectQuery, [Subject_Code]);

    if (existingSubjectRows.length === 0) {
      return res.status(400).json({ error: 'Subject with the given Subject Code does not exist' });
    }

   
    const deleteSubjectQuery = 'DELETE FROM Subject WHERE Subject_Code = ?';
    await db.promise().execute(deleteSubjectQuery, [Subject_Code]);

    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


}

module.exports = StaffController;
