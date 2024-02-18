// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./Routes/staffRoutes');
const studentroutes = require('./Routes/studentRoutes');

const config = require('./config'); 
const app = express();
const PORT = config.port;

app.use(cors());
app.use(bodyParser.json());
app.use('/', routes, studentRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Restful API Backend Using ExpressJS' });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
