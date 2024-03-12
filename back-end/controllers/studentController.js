const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const config = require("../config");

const router = express.Router();

// Register a new student
router.post("/register", async (req, res) => {
  try {
    const {
      Student_Number,
      Student_Name,
      Password,
      Gbox,
      Mobile_Number,
      Year,
    } = req.body;

    if (!Password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const mobileRegex = /^09\d{9}$/;
    if (!mobileRegex.test(Mobile_Number)) {
      return res.status(400).json({ error: "Invalid mobile number format" });
    }

    const gboxRegex = /^[a-zA-Z0-9._%+-]+@gbox\.ncf\.edu\.ph$/;
    if (!gboxRegex.test(Gbox)) {
      return res
        .status(400)
        .json({
          error: "Invalid Gbox format. It should end with @gbox.ncf.edu.ph",
        });
    }

    const checkExistingStudentQuery =
      "SELECT * FROM Students WHERE Student_Number = $1 OR Student_Name = $2 OR Gbox = $3";
    const { rows: existingRows } = await db.query(checkExistingStudentQuery, [
      Student_Number,
      Student_Name,
      Gbox,
    ]);

    if (existingRows.length > 0) {
      return res
        .status(400)
        .json({
          error:
            "Student with the same Student Number, Name, or Gbox already exists",
        });
    }

    const insertStudentQuery =
      "INSERT INTO Students (Student_Number, Student_Name, Year, Password, Gbox, Mobile_Number) VALUES ($1, $2, $3, $4, $5, $6)";
    await db.query(insertStudentQuery, [
      Student_Number,
      Student_Name,
      Year,
      hashedPassword,
      Gbox,
      Mobile_Number,
    ]);

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all students
router.get("/getStudents", async (req, res) => {
  try {
    const selectUsersQuery =
      "SELECT Student_Number, Student_Name, Password, Gbox, Mobile_Number, Year FROM Students";
    const { rows } = await db.query(selectUsersQuery);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login for student
router.post("/login", async (req, res) => {
  try {
    const { Student_Number, Password } = req.body;

    const getStudentQuery = "SELECT * FROM Students WHERE Student_Number = $1";
    const { rows } = await db.query(getStudentQuery, [Student_Number]);

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid Student Number or password" });
    }

    const student = rows[0];

    if (!student.Password) {
      return res
        .status(401)
        .json({ error: "Invalid Student Number or password" });
    }

    const passwordMatch = await bcrypt.compare(Password, student.Password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid Student Number or password" });
    }

    const token = jwt.sign(
      {
        Student_Number: student.Student_Number,
        Student_Name: student.Student_Name,
      },
      config.secretKey,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Update student details
router.put("/upStudents/:studentNumber", async (req, res) => {
  try {
    const { studentNumber } = req.params;
    const { Student_Name, Password, Gbox, Mobile_Number, Year } = req.body;

    const hashedPassword = await bcrypt.hash(Password, 10);

    const mobileRegex = /^09\d{9}$/;
    if (Mobile_Number && !mobileRegex.test(Mobile_Number)) {
      return res.status(400).json({ error: "Invalid mobile number format" });
    }

    const gboxRegex = /^[a-zA-Z0-9._%+-]+@gbox\.ncf\.edu\.ph$/;
    if (Gbox && !gboxRegex.test(Gbox)) {
      return res
        .status(400)
        .json({
          error: "Invalid Gbox format. It should end with @gbox.ncf.edu.ph",
        });
    }

    const checkExistingStudentQuery =
      "SELECT * FROM Students WHERE Student_Number = $1";
    const { rows: existingRows } = await db.query(checkExistingStudentQuery, [studentNumber]);

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const updateStudentQuery =
      "UPDATE Students SET Student_Name = $1, Password = $2, Gbox = $3, Mobile_Number = $4, Year = $5 WHERE Student_Number = $6";
    await db.query(updateStudentQuery, [
      Student_Name,
      hashedPassword,
      Gbox,
      Mobile_Number,
      Year,
      studentNumber,
    ]);

    res.status(200).json({ message: "Student details updated successfully" });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete student
router.delete("/delStudents/:studentNumber", async (req, res) => {
  try {
    const { studentNumber } = req.params;

    const checkExistingStudentQuery =
      "SELECT * FROM Students WHERE Student_Number = $1";
    const { rows: existingRows } = await db.query(checkExistingStudentQuery, [studentNumber]);

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const deleteStudentQuery = "DELETE FROM Students WHERE Student_Number = $1";
    await db.query(deleteStudentQuery, [studentNumber]);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
