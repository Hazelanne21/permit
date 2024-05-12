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
      const { email, password } = req.body; // Adjust to lowercase 'email' and 'password'

      const getStaffQuery = 'SELECT * FROM Staff WHERE Email = $1';
      const { rows } = await db.query(getStaffQuery, [email]); // Destructure 'rows' directly

      if (rows.length === 0) {
          return res.status(401).json({ error: 'Invalid email or password' });
      }

      const staff = rows[0];

      if (!staff.password) {
          return res.status(401).json({ error: 'Invalid email or password' });
      }

      const passwordMatch = await bcrypt.compare(password, staff.password); // Adjust to lowercase 'password'

      if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ email: staff.email, id: staff.staff_id, name: staff.staff_name }, config.secretKey, { expiresIn: '1h' });

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
module.exports = router;
