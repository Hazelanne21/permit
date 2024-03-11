// db.js
const { Pool } = require('pg');
const config = require('./config'); 

const pool = new Pool({
  connectionString: config.dbConfig.connectionString,
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

module.exports = pool;