// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config'); // import the config file
const app = express();
const studentRouter = require('./controllers/studentController');
const permitRouter = require('./controllers/permitController');
const staffRouter = require('./controllers/staffController');
const subjectRouter = require('./controllers/subjectController');
const tuitionRouter = require('./controllers/tuitionController');
app.use(cors());
app.use(bodyParser.json());

//Routes 
app.use('/students', studentRouter);
app.use('/permits', permitRouter);
app.use('/staff', staffRouter);
app.use('/subjects', subjectRouter);
app.use('/tuitions', tuitionRouter);

app.listen(config.port, () => { // use the port from the config file
  console.log(`Server is running on http://localhost:${config.port}`);
});