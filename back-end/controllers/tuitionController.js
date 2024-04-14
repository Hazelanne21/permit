const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/createTuitionList", async (req, res) => {
  try {
    const { tuitionList } = req.body;

    if (!tuitionList || !Array.isArray(tuitionList)) {
      return res.status(400).json({ error: "Invalid tuition list format" });
    }

    const duplicateEntries = [];

    for (const entry of tuitionList) {
      const {
        Student_Number,
        Prelim_Status,
        Midterm_Status,
        SemiFinal_Status,
        Final_Status,
        Staff_ID,
      } = entry;

      const StudentNumber = String(entry.Student_Number);
      const getStudentIdQuery = "SELECT Student_ID FROM Students WHERE Student_Number = $1";
      const studentRows = await db.query(getStudentIdQuery, [StudentNumber]);

      if (studentRows.rows.length === 0) {
        console.warn(`Student with Student_Number ${StudentNumber} does not exist. Skipping entry.`);
        continue;
      }
      
      // Add this check
      if (!studentRows.rows[0]) {
        console.error(`No rows returned from query for Student_Number ${StudentNumber}. Skipping entry.`);
        continue;
      }
      
      const Student_ID = studentRows.rows[0].student_id;

      const checkExistingTuitionListQuery =
        "SELECT * FROM TuitionPaymentStatus WHERE Student_ID = $1";
      const existingTuitionListRows = await db.query(
        checkExistingTuitionListQuery,
        [Student_ID]
      );

      if (existingTuitionListRows.length > 0) {
        duplicateEntries.push(Student_Number);
        continue;
      }

      const insertTuitionListQuery = `
        INSERT INTO TuitionPaymentStatus (Student_ID, Prelim_Status, Midterm_Status, SemiFinal_Status, Final_Status, Staff_ID)
        VALUES ($1, $2, $3, $4, $5, $6);
      `;

      const params = [
        Student_ID,
        Prelim_Status || false,
        Midterm_Status || false,
        SemiFinal_Status || false,
        Final_Status || false,
        Staff_ID || null,
      ];

      await db.query(insertTuitionListQuery, params);
    }

    if (duplicateEntries.length > 0) {
      console.warn(
        `Duplicate entries found for student numbers: ${duplicateEntries.join(
          ", "
        )}`
      );
    }

    res.status(201).json({ message: "Tuition list created successfully" });
  } catch (error) {
    console.error("Error creating tuition list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getAllTuitionList", async (req, res) => {
  try {
    const getAllTuitionListQuery = `
      SELECT 
        Students.Student_Number,
        TuitionPaymentStatus.Prelim_Status,
        TuitionPaymentStatus.Midterm_Status,
        TuitionPaymentStatus.SemiFinal_Status,
        TuitionPaymentStatus.Final_Status,
        TuitionPaymentStatus.Staff_ID
      FROM TuitionPaymentStatus
      JOIN Students ON TuitionPaymentStatus.Student_ID = Students.Student_ID;
    `;

    const tuitionListRows = await db.query(getAllTuitionListQuery);

    res.status(200).json({ tuitionList: tuitionListRows.rows });
  } catch (error) {
    console.error("Error getting all tuition list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updateTuitionList", async (req, res) => {
  try {
    const {
      Student_Number,
      Prelim_Status,
      Midterm_Status,
      SemiFinal_Status,
      Final_Status,
      Staff_ID,
    } = req.body;

    const StudentNumber = String(Student_Number);
    const getStudentIdQuery =
      "SELECT Student_ID FROM Students WHERE Student_Number = $1";
    const studentRows = await db.query(getStudentIdQuery, [StudentNumber]);

    if (studentRows.rows.length === 0) {
      console.warn(`Student with Student_Number ${StudentNumber} does not exist. Skipping entry.`);
      return res
        .status(400)
        .json({
          error: `Student with Student Number ${StudentNumber} does not exist`,
        });
    }

    // Add this check
    if (!studentRows.rows[0]) {
      console.error(`No rows returned from query for Student_Number ${StudentNumber}. Skipping entry.`);
      return res
        .status(400)
        .json({
          error: `No rows returned from query for Student_Number ${StudentNumber}`,
        });
    }

    const Student_ID = studentRows.rows[0].student_id;

    const updateTuitionListQuery = `
      UPDATE TuitionPaymentStatus
      SET Prelim_Status = $1,
          Midterm_Status = $2,
          SemiFinal_Status = $3,
          Final_Status = $4,
          Staff_ID = $5
      WHERE Student_ID = $6;
    `;

    const params = [
      Prelim_Status !== undefined ? Prelim_Status : false,
      Midterm_Status !== undefined ? Midterm_Status : false,
      SemiFinal_Status !== undefined ? SemiFinal_Status : false,
      Final_Status !== undefined ? Final_Status : false,
      Staff_ID || null,
      Student_ID,
    ];

    await db.query(updateTuitionListQuery, params);

    res.status(200).json({ message: "Tuition list updated successfully" });
  } catch (error) {
    console.error("Error updating tuition list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deleteTuitionList", async (req, res) => {
  try {
    const { Student_Number } = req.body;

    const StudentNumber = String(Student_Number);
    const getStudentIdQuery = "SELECT Student_ID FROM Students WHERE Student_Number = $1";
    const studentRows = await db.query(getStudentIdQuery, [StudentNumber]);

    if (studentRows.rows.length === 0) {
      console.warn(`Student with Student_Number ${StudentNumber} does not exist. Skipping entry.`);
      return res
        .status(400)
        .json({
          error: `Student with Student Number ${StudentNumber} does not exist`,
        });
    }

    // Add this check
    if (!studentRows.rows[0]) {
      console.error(`No rows returned from query for Student_Number ${StudentNumber}. Skipping entry.`);
      return res
        .status(400)
        .json({
          error: `No rows returned from query for Student_Number ${StudentNumber}`,
        });
    }

    const Student_ID = studentRows.rows[0].student_id;

    const deleteTuitionListQuery = "DELETE FROM TuitionPaymentStatus WHERE Student_ID = $1";
    await db.query(deleteTuitionListQuery, [Student_ID]);

    res
      .status(200)
      .json({ message: "Tuition list entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting tuition list entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
