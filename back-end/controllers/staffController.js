const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const config = require('../config');

// staffRouter.js

const router = express.Router();

router.post('/create', async (req, res) => {
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

    const checkExistingStaffQuery = 'SELECT * FROM Staff WHERE Staff_Name = $1';
    const existingRows = await db.query(checkExistingStaffQuery, [Staff_Name]);

    if (existingRows.length > 0) {
      return res.status(400).json({ error: 'Staff with the same Staff Name already exists' });
    }

    const insertStaffQuery = 'INSERT INTO Staff (Staff_Name, Password, Email) VALUES ($1, $2, $3)';
    await db.query(insertStaffQuery, [Staff_Name, hashedPassword, staffEmail]);

    res.status(201).json({ message: 'Staff member created successfully' });
  } catch (error) {
    console.error('Error creating staff member:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const getStaffQuery = 'SELECT * FROM Staff WHERE Email = $1';
    const rows = await db.query(getStaffQuery, [Email]);

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
});

router.get('/getallstaff', async (req, res) => {
  try {
    const selectUsersQuery = 'SELECT Staff_Name, Email, Password FROM Staff';
    const result = await db.query(selectUsersQuery);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/update', async (req, res) => {
  try {
    const { Staff_Name, Password, Email } = req.body;

    const checkExistingStaffQuery = 'SELECT * FROM Staff WHERE Staff_Name = $1';
    const existingRows = await db.query(checkExistingStaffQuery, [Staff_Name]);

    if (existingRows.length === 0) {
      return res.status(400).json({ error: 'Staff with the given Staff Name does not exist' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const updateStaffQuery = 'UPDATE Staff SET Password = $1, Email = $2 WHERE Staff_Name = $3';
    await db.query(updateStaffQuery, [hashedPassword, Email, Staff_Name]);

    res.status(200).json({ message: 'Staff details updated successfully' });
  } catch (error) {
    console.error('Error updating staff details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    const { Staff_Name } = req.body;

    const checkExistingStaffQuery = 'SELECT * FROM Staff WHERE Staff_Name = $1';
    const existingRows = await db.query(checkExistingStaffQuery, [Staff_Name]);

    if (existingRows.length === 0) {
      return res.status(400).json({ error: 'Staff with the given Staff Name does not exist' });
    }

    const deleteStaffQuery = 'DELETE FROM Staff WHERE Staff_Name = $1';
    await db.query(deleteStaffQuery, [Staff_Name]);

    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    res.status(200).json({ message: 'Staff logged out successfully' });
  } catch (error) {
    console.error('Error logging out staff:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/createTuitionList', async (req, res) => {
  try {
    const { tuitionList } = req.body;

    if (!tuitionList || !Array.isArray(tuitionList)) {
      return res.status(400).json({ error: 'Invalid tuition list format' });
    }

    const duplicateEntries = [];

    for (const entry of tuitionList) {
      const { Student_Number, Prelim_Status, Midterm_Status, SemiFinal_Status, Final_Status } = entry;

      const checkExistingStudentQuery = 'SELECT * FROM Student WHERE Student_Number = $1';
      const existingStudentRows = await db.query(checkExistingStudentQuery, [Student_Number]);

      if (existingStudentRows.length === 0) {
        console.warn(`Student with Student_Number ${Student_Number} does not exist. Skipping entry.`);
        continue;
      }

      const checkExistingTuitionListQuery = 'SELECT * FROM TuitionList WHERE Student_Number = $1';
      const existingTuitionListRows = await db.query(checkExistingTuitionListQuery, [Student_Number]);

      if (existingTuitionListRows.length > 0) {
        duplicateEntries.push(Student_Number);
        continue;
      }

      const insertTuitionListQuery = `
        INSERT INTO TuitionList (Student_Number, Prelim_Status, Midterm_Status, SemiFinal_Status, Final_Status)
        VALUES ($1, $2, $3, $4, $5);
      `;

      const params = [
        Student_Number,
        Prelim_Status || null,
        Midterm_Status || null,
        SemiFinal_Status || null,
        Final_Status || null,
      ];

      await db.query(insertTuitionListQuery, params);
    }

    if (duplicateEntries.length > 0) {
      console.warn(`Duplicate entries found for student numbers: ${duplicateEntries.join(', ')}`);
    }

    res.status(201).json({ message: 'Tuition list created successfully' });
  } catch (error) {
    console.error('Error creating tuition list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/updateTuitionList', async (req, res) => {
  try {
    const { Student_Number, Prelim_Status, Midterm_Status, SemiFinal_Status, Final_Status } = req.body;

    const checkExistingStudentQuery = 'SELECT * FROM Student WHERE Student_Number = $1';
    const existingStudentRows = await db.query(checkExistingStudentQuery, [Student_Number]);

    if (existingStudentRows.length === 0) {
      return res.status(400).json({ error: `Student with Student Number ${Student_Number} does not exist` });
    }

    const updateTuitionListQuery = `
      UPDATE TuitionList
      SET Prelim_Status = $1,
          Midterm_Status = $2,
          SemiFinal_Status = $3,
          Final_Status = $4
      WHERE Student_Number = $5;
    `;

    const params = [
      Prelim_Status !== undefined ? Prelim_Status : null,
      Midterm_Status !== undefined ? Midterm_Status : null,
      SemiFinal_Status !== undefined ? SemiFinal_Status : null,
      Final_Status !== undefined ? Final_Status : null,
      Student_Number
    ];

    await db.query(updateTuitionListQuery, params);

    res.status(200).json({ message: 'Tuition list updated successfully' });
  } catch (error) {
    console.error('Error updating tuition list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/deleteTuitionList', async (req, res) => {
  try {
    const { Student_Number } = req.body;

    const checkExistingStudentQuery = 'SELECT * FROM Student WHERE Student_Number = $1';
    const existingStudentRows = await db.query(checkExistingStudentQuery, [Student_Number]);

    if (existingStudentRows.length === 0) {
      return res.status(400).json({ error: `Student with Student Number ${Student_Number} does not exist` });
    }

    const deleteTuitionListQuery = 'DELETE FROM TuitionList WHERE Student_Number = $1';
    await db.query(deleteTuitionListQuery, [Student_Number]);

    res.status(200).json({ message: 'Tuition list entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting tuition list entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
