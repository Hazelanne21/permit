//GET PERMIT
  static async getPermit(req, res) {
    try {
      const { Student_Number, Exam, Semester } = req.body;

      // Check if permit already exists for the specified student, exam, and semester
      const checkExistingPermitQuery = 'SELECT * FROM Permit WHERE Student_Number = ? AND Exam = ? AND Semester = ?';
      const [existingPermitRows] = await db.promise().execute(checkExistingPermitQuery, [Student_Number, Exam, Semester]);

      if (existingPermitRows.length > 0) {
        return res.status(400).json({ error: 'Permit already exists. Get your permit.' });
      }

      // Retrieve student details
      const getStudentQuery = 'SELECT * FROM Student WHERE Student_Number = ?';
      const [studentRows] = await db.promise().execute(getStudentQuery, [Student_Number]);
  

      if (studentRows.length === 0) {
        return res.status(400).json({ error: 'Student not found' });
      }
  

      const student = studentRows[0];

      // Check if tuition list is created for the specified student
      const checkTuitionListQuery = 'SELECT * FROM TuitionList WHERE Student_Number = ?';
      const [tuitionListRows] = await db.promise().execute(checkTuitionListQuery, [Student_Number]);
  

      if (tuitionListRows.length === 0) {
        // Tuition list not created yet, return processing message
        return res.status(400).json({
          error: 'Your Payment is on Processing Mode. Please wait a few hours or contact the Cashier or Accounting for assistance. Thank you and have a nice day.',
        });
      }


      // Check if the payment status for the specified exam is 'Paid'
      const getTuitionListQuery = `SELECT * FROM TuitionList WHERE Student_Number = ? AND ${Exam}_Status = 'Paid'`;
      const [tuitionListStatusRows] = await db.promise().execute(getTuitionListQuery, [Student_Number]);
  

      if (tuitionListStatusRows.length === 0) {
        return res.status(400).json({ error: `Tuition not paid for ${Exam} exam` });
      }


      // Retrieve subject details for the specified semester
      const getSubjectQuery = `
        SELECT Subject.Subject_Code, Subject.Description
        FROM Subject
        JOIN Student ON Subject.Year = Student.Year
        WHERE Student.Student_Number = ? AND Subject.Semester = ?
      `;
      const [subjectRows] = await db.promise().execute(getSubjectQuery, [Student_Number, Semester]);


      // Prepare permit details
      const permitDetails = {
        Message: `Permit for ${Exam} exam generated successfully`,
        Student_Number: student.Student_Number,
@@ -209,15 +225,131 @@ static async getAll(req, res) {
        Date_Release: new Date().toISOString().split('T')[0], // Current date
        Year: student.Year,
        Semester: Semester,
        Subjects: subjectRows,
        Subjects: [],
      };


      // Store permit details in the database
      for (const subject of subjectRows) {
        const { Subject_Code, Description } = subject;

        // Check if subject already exists in the permit
        const checkExistingSubjectQuery = 'SELECT * FROM Permit WHERE Student_Number = ? AND Exam = ? AND Semester = ? AND Subject_Code = ?';
        const [existingSubjectRows] = await db.promise().execute(checkExistingSubjectQuery, [Student_Number, Exam, Semester, Subject_Code]);

        if (existingSubjectRows.length === 0) {
          // Subject does not exist in the permit, store it in the database
          const insertPermitQuery = 'INSERT INTO Permit (Student_Number, Student_Name, Exam, Date_Release, Year, Semester, Subject_Code, Description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
          await db.promise().execute(insertPermitQuery, [
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
          // Subject already exists in the permit, return error message
          return res.status(400).json({ error: `Subject ${Subject_Code} already exists in the permit` });
        }
      }

      res.status(200).json(permitDetails);
    } catch (error) {
      console.error('Error generating permit:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }










//GET ALL PERMIT
  static async getAllPermits(req, res) {
    try {
      const { exam, semester, year } = req.query;

      // Construct the SQL query based on the provided filters
      let selectPermitsQuery = 'SELECT Student_Number, Student_Name, Exam, Date_Release, Year, Semester, GROUP_CONCAT(CONCAT(Subject_Code, " - ", Description) SEPARATOR ", ") AS Subjects FROM Permit';
      let whereClause = '';

      if (exam) {
        whereClause += ` Exam = '${exam}'`;
      }

      if (semester) {
        if (whereClause) {
          whereClause += ' AND';
        }
        whereClause += ` Semester = '${semester}'`;
      }

      if (year) {
        if (whereClause) {
          whereClause += ' AND';
        }
        whereClause += ` Year = '${year}'`;
      }

      if (whereClause) {
        selectPermitsQuery += ` WHERE${whereClause}`;
      }

      selectPermitsQuery += ' GROUP BY Student_Number, Student_Name, Exam, Date_Release, Year, Semester';

      db.query(selectPermitsQuery, (err, result) => {
        if (err) {
          console.error('Error fetching permits:', err);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          const permits = result.map((permit) => ({
            Student_Number: permit.Student_Number,
            Student_Name: permit.Student_Name,
            Exam: permit.Exam,
            Date_Release: permit.Date_Release,
            Year: permit.Year,
            Semester: permit.Semester,
            Subjects: permit.Subjects,
          }));
        }
      });

      if (whereClause) {
        selectPermitsQuery += ` WHERE${whereClause}`;
      }

      db.query(selectPermitsQuery, (err, result) => {
        if (err) {
          console.error('Error fetching permits:', err);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          const permits = result.map((permit) => ({
            Student_Number: permit.Student_Number,
            Student_Name: permit.Student_Name,
            Exam: permit.Exam,
            Date_Release: permit.Date_Release,
            Year: permit.Year,
            Semester: permit.Semester,
            Subjects: permit.Subjects,
          }));

          res.status(200).json(permits);
        }
      });
    } catch (error) {
      console.error('Error loading permits:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


}
