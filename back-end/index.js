// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config'); // import the config file
const app = express();
const studentRouter = require('./controllers/studentController');
app.use(cors());
app.use(bodyParser.json());

//Routes 
app.use('/students', studentRouter);


app.listen(config.port, () => { // use the port from the config file
  console.log(`Server is running on http://localhost:${config.port}`);
});