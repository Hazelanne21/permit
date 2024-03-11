// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = 4000; // Set the port to 4000

app.use(cors());
app.use(bodyParser.json());
app.use('/', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Restful API Backend Using ExpressJS' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Use template literals to print the PORT variable
});