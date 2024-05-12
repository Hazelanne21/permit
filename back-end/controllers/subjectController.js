const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/createSubject", async (req, res) => {
  try {
    const { Subject_Code, Name, Semester_ID, Year_Level_ID, Course_ID } = req.body;
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
      "INSERT INTO Subjects (Subject_Code, Name, Semester_ID, Year_Level_ID, Course_ID) VALUES ($1, $2, $3, $4, $5)";
    await db.query(insertSubjectQuery, [
      Subject_Code,
      Name,
      Semester_ID,
      Year_Level_ID,
      Course_ID,
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
      "SELECT Subject_ID, Subject_Code, Name, Semester_ID, Year_Level_ID, Course_ID FROM Subjects";
    const result = await db.query(selectUsersQuery);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updateSubject/:Subject_ID", async (req, res) => {
  try {
    const { Subject_ID } = req.params;
    const { Subject_Code, Name, Semester_ID, Year_Level_ID, Course_ID } = req.body;

    const checkExistingSubjectQuery =
      "SELECT * FROM Subjects WHERE Subject_ID = $1";
    const existingSubjectRows = await db.query(checkExistingSubjectQuery, [
      Subject_ID,
    ]);

    if (existingSubjectRows.length === 0) {
      return res
        .status(400)
        .json({ error: "Subject with the given Subject ID does not exist" });
    }

    const updateSubjectQuery =
      "UPDATE Subjects SET Subject_Code = $1, Name = $2, Semester_ID = $3, Year_Level_ID = $4, Course_ID = $5, WHERE Subject_ID = $6";
    await db.query(updateSubjectQuery, [
      Subject_Code,
      Name,
      Semester_ID,
      Year_Level_ID,
      Course_ID, 
      Subject_ID,
    ]);

    res.status(200).json({ message: "Subject updated successfully" });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deleteSubject/:Subject_ID", async (req, res) => {
  try {
    const { Subject_ID } = req.params;

    const checkExistingSubjectQuery =
    "SELECT * FROM Subjects WHERE Subject_ID = $1";
    const existingSubjectRows = await db.query(checkExistingSubjectQuery, [
      Subject_ID,
    ]);

    if (existingSubjectRows.length === 0) {
      return res
        .status(400)
        .json({ error: "Subject with the given Subject ID does not exist" });
    }

    const deleteSubjectQuery = "DELETE FROM Subjects WHERE Subject_ID = $1";
    await db.query(deleteSubjectQuery, [Subject_ID]);

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;