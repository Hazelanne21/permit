// db.js
const mysql = require('mysql2');
const config = require('./config'); 
const db = mysql.createConnection(config.dbConfig);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

module.exports = db;
