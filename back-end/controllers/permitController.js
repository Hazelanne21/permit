const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const config = require("../config");

const router = express.Router();

router.get("/getPermits", async (req, res) => {
  try {
    const { student_id } = req.query;
    console.log("student_id", student_id);

    let selectPermitsQuery =
      "SELECT Permit_Number, Student_ID, Exam, Date_Release, Name, Sequence_No, Staff_ID, Exam_Period FROM Permit";

    if (student_id) {
      selectPermitsQuery += ` WHERE Student_ID = ${student_id}`;
    }

    const { rows } = await db.query(selectPermitsQuery);
    console.log("rows", rows);
    const permits = rows.map((permit) => [
      permit.permit_number,
      permit.student_id,
      permit.exam,
      permit.date_release,
      permit.Name,
      permit.sequence_no,
      permit.staff_id,
      permit.exam_period,
    ]);

    res.status(200).json(permits);
  } catch (error) {
    console.error("Error fetching permits:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
