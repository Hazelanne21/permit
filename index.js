// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config'); 
const app = express();
const PORT = config.port;

app.use(cors());
app.use(bodyParser.json());
app.use('', routes);


app.get('/', (req, res) => {
  res.json({ message: 'Restful API Backend Using ExpressJS' });
});


app.listen(PORT, () => {
  console.log(`Server is running on https://testing-permit.onrender.com`);
});
