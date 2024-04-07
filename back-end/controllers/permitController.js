const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const config = require("../config");

const router = express.Router();

// Generate permit for student
router.post("/genPermits", async (req, res) => {
  try {
    const { Student_Number, Exam, Semester } = req.body;

    const checkExistingPermitQuery =
      "SELECT * FROM Permit WHERE Student_Number = ? AND Exam = ? AND Semester = ?";
    const [existingPermitRows] = await db
      .promise()
      .execute(checkExistingPermitQuery, [Student_Number, Exam, Semester]);

    if (existingPermitRows.length > 0) {
      return res
        .status(400)
        .json({ error: "Permit already exists. Get your permit." });
    }

    const getStudentQuery = "SELECT * FROM Student WHERE Student_Number = ?";
    const [studentRows] = await db
      .promise()
      .execute(getStudentQuery, [Student_Number]);

    if (studentRows.length === 0) {
      return res.status(400).json({ error: "Student not found" });
    }

    const student = studentRows[0];

    const checkTuitionListQuery =
      "SELECT * FROM TuitionList WHERE Student_Number = ?";
    const [tuitionListRows] = await db
      .promise()
      .execute(checkTuitionListQuery, [Student_Number]);

    if (tuitionListRows.length === 0) {
      return res.status(400).json({
        error:
          "Your Payment is on Processing Mode. Please wait a few hours or contact the Cashier or Accounting for assistance. Thank you and have a nice day.",
      });
    }

    const getTuitionListQuery = `SELECT * FROM TuitionList WHERE Student_Number = ? AND ${Exam}_Status = 'Paid'`;
    const [tuitionListStatusRows] = await db
      .promise()
      .execute(getTuitionListQuery, [Student_Number]);

    if (tuitionListStatusRows.length === 0) {
      return res
        .status(400)
        .json({ error: `Tuition not paid for ${Exam} exam` });
    }

    const getSubjectQuery = `
        SELECT Subject.Subject_Code, Subject.Description
        FROM Subject
        JOIN Student ON Subject.Year = Student.Year
        WHERE Student.Student_Number = ? AND Subject.Semester = ?
      `;
    const [subjectRows] = await db
      .promise()
      .execute(getSubjectQuery, [Student_Number, Semester]);

    const permitDetails = {
      Message: `Permit for ${Exam} exam generated successfully`,
      Student_Number: student.Student_Number,
      Student_Name: student.Student_Name,
      Exam: Exam,
      Date_Release: new Date().toISOString().split("T")[0],
      Year: student.Year,
      Semester: Semester,
      Subjects: [],
    };

    for (const subject of subjectRows) {
      const { Subject_Code, Description } = subject;

      const checkExistingSubjectQuery =
        "SELECT * FROM Permit WHERE Student_Number = ? AND Exam = ? AND Semester = ? AND Subject_Code = ?";
      const [existingSubjectRows] = await db
        .promise()
        .execute(checkExistingSubjectQuery, [
          Student_Number,
          Exam,
          Semester,
          Subject_Code,
        ]);

      if (existingSubjectRows.length === 0) {
        const insertPermitQuery =
          "INSERT INTO Permit (Student_Number, Student_Name, Exam, Date_Release, Year, Semester, Subject_Code, Description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await db
          .promise()
          .execute(insertPermitQuery, [
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
        return res.status(400).json({
          error: `Subject ${Subject_Code} already exists in the permit`,
        });
      }
    }

    res.status(200).json(permitDetails);
  } catch (error) {
    console.error("Error generating permit:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all permits
router.get("/getPermits", async (req, res) => {
  try {
    const { exam, semester, year } = req.query;

    let selectPermitsQuery =
      'SELECT Student_Number, Student_Name, Exam, Date_Release, Year, Semester, string_agg(CONCAT(Subject_Code, " - ", Description), ", ") AS Subjects FROM Permit';
    let whereClause = "";

    if (exam) {
      whereClause += ` Exam = '${exam}'`;
    }

    if (semester) {
      if (whereClause) {
        whereClause += " AND";
      }
      whereClause += ` Semester = '${semester}'`;
    }

    if (year) {
      if (whereClause) {
        whereClause += " AND";
      }
      whereClause += ` Year = '${year}'`;
    }

    if (whereClause) {
      selectPermitsQuery += ` WHERE${whereClause}`;
    }

    selectPermitsQuery +=
      " GROUP BY Student_Number, Student_Name, Exam, Date_Release, Year, Semester";

    const { rows } = await db.query(selectPermitsQuery);
    const permits = rows.map((permit) => ({
      Student_Number: permit.Student_Number,
      Student_Name: permit.Student_Name,
      Exam: permit.Exam,
      Date_Release: permit.Date_Release,
      Year: permit.Year,
      Semester: permit.Semester,
      Subjects: permit.Subjects,
    }));

    res.status(200).json(permits);
  } catch (error) {
    console.error("Error fetching permits:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
