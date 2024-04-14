const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const config = require("../config");

// staffRouter.js

const router = express.Router();

router.post("/createSubject", async (req, res) => {
  try {
    const { Subject_Code, Description, Semester_ID, Year_Level_ID } = req.body;
    const checkExistingSubjectQuery =
      "SELECT * FROM Subjects WHERE Subject_Code = $1";
    const existingSubjectRows = await db.query(checkExistingSubjectQuery, [
      Subject_Code,
    ]);

    if (existingSubjectRows.length > 0) {
      return res
        .status(400)
        .json({ error: "Subject with the same Subject Code already exists" });
    }

    const insertSubjectQuery =
      "INSERT INTO Subjects (Subject_Code, Description, Semester_ID, Year_Level_ID) VALUES ($1, $2, $3, $4)";
    await db.query(insertSubjectQuery, [
      Subject_Code,
      Description,
      Semester_ID,
      Year_Level_ID,
    ]);

    res.status(201).json({ message: "Subject created successfully" });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getSubject", async (req, res) => {
  try {
    const selectUsersQuery =
      "SELECT Subject_Code, Description, Semester_ID, Year_Level_ID FROM Subjects";
    const result = await db.query(selectUsersQuery);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deleteSubject/:Subject_Code", async (req, res) => {
  try {
    const { Subject_Code } = req.params;

    const checkExistingSubjectQuery =
    "SELECT * FROM Subjects WHERE Subject_Code = $1";
    const existingSubjectRows = await db.query(checkExistingSubjectQuery, [
      Subject_Code,
    ]);

    if (existingSubjectRows.length === 0) {
      return res
        .status(400)
        .json({ error: "Subject with the given Subject Code does not exist" });
    }

    const deleteSubjectQuery = "DELETE FROM Subjects WHERE Subject_Code = $1";
    await db.query(deleteSubjectQuery, [Subject_Code]);

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
