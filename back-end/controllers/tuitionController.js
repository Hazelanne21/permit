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
      const getStudentIdQuery =
        "SELECT Student_ID FROM Students WHERE Student_Number = $1";
      const studentRows = await db.query(getStudentIdQuery, [StudentNumber]);

      if (studentRows.rows.length === 0) {
        console.warn(
          `Student with Student_Number ${StudentNumber} does not exist. Skipping entry.`
        );
        continue;
      }

      if (!studentRows.rows[0]) {
        console.error(
          `No rows returned from query for Student_Number ${StudentNumber}. Skipping entry.`
        );
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

      // Insert into Permit table
      const insertPermitQuery = `
      INSERT INTO Permit (Permit_Number, Student_ID, Exam, Date_Release, Description, Sequence_No, Staff_ID, Exam_Period)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `;

      const semesterQuery =
        "SELECT Semester_ID FROM Students WHERE Student_ID = $1";
      const semesterResult = await db.query(semesterQuery, [Student_ID]);
      const semester_id = semesterResult.rows[0].semester_id;

      const permit_number = 2000 + Student_ID;
      const sequence_no = 1000 + Student_ID;
      const Exam_Period = semester_id;
      console.log("Exam_Period", Exam_Period);
      const permitParams = [
        // Replace these with the actual values
        permit_number,
        Student_ID,
        "Exam",
        new Date(),
        "Your Permit for the exam is ready!",
        sequence_no,
        Staff_ID,
        Exam_Period,
      ];

      await db.query(insertPermitQuery, permitParams);
    }

    if (duplicateEntries.length > 0) {
      console.warn(
        `Duplicate entries found for student numbers: ${duplicateEntries.join(
          ", "
        )}`
      );
    }

    res
      .status(201)
      .json({ message: "Tuition list and permits created successfully" });
  } catch (error) {
    console.error("Error creating tuition list and permits:", error);
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
      console.warn(
        `Student with Student_Number ${StudentNumber} does not exist. Skipping entry.`
      );
      return res.status(400).json({
        error: `Student with Student Number ${StudentNumber} does not exist`,
      });
    }

    // Add this check
    if (!studentRows.rows[0]) {
      console.error(
        `No rows returned from query for Student_Number ${StudentNumber}. Skipping entry.`
      );
      return res.status(400).json({
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

    // Update Permit table
    const updatePermitQuery = `
    UPDATE Permit
    SET Permit_Number = $1,
        Exam = $2,
        Date_Release = $3,
        Description = $4,
        Sequence_No = $5,
        Staff_ID = $6,
        Exam_Period = $7
    WHERE Student_ID = $8;
  `;
    const semesterQuery =
      "SELECT Semester_ID FROM Students WHERE Student_ID = $1";
    const semesterResult = await db.query(semesterQuery, [Student_ID]);
    const semester_id = semesterResult.rows[0].Semester_ID;

    const permit_number = 2000 + Student_ID;
    const sequence_no = 1000 + Student_ID;
    const exam_period = semester_id;
    const permitParams = [
      // Replace these with the actual values
      permit_number,
      Student_ID,
      "Exam",
      new Date(),
      "Your Permit for the exam is ready!",
      sequence_no,
      Staff_ID,
      exam_period,
    ];

    await db.query(updatePermitQuery, permitParams);

    res
      .status(200)
      .json({ message: "Tuition list and permits updated successfully" });
  } catch (error) {
    console.error("Error updating tuition list and permits:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deleteTuitionList", async (req, res) => {
  try {
    const { Student_Number } = req.body;

    const StudentNumber = String(Student_Number);
    const getStudentIdQuery =
      "SELECT Student_ID FROM Students WHERE Student_Number = $1";
    const studentRows = await db.query(getStudentIdQuery, [StudentNumber]);

    if (studentRows.rows.length === 0) {
      console.warn(
        `Student with Student_Number ${StudentNumber} does not exist. Skipping entry.`
      );
      return res.status(400).json({
        error: `Student with Student Number ${StudentNumber} does not exist`,
      });
    }

    // Add this check
    if (!studentRows.rows[0]) {
      console.error(
        `No rows returned from query for Student_Number ${StudentNumber}. Skipping entry.`
      );
      return res.status(400).json({
        error: `No rows returned from query for Student_Number ${StudentNumber}`,
      });
    }

    const Student_ID = studentRows.rows[0].student_id;

    const deleteTuitionListQuery =
      "DELETE FROM TuitionPaymentStatus WHERE Student_ID = $1";
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
