// db.js
const { Pool } = require('pg');
const config = require('./config'); 

const pool = new Pool(config.dbConfig);

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

const getActiveConnections = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT count(*) FROM pg_stat_activity;');
    console.log('Number of active connections:', res.rows[0].count);
  } catch (err) {
    console.error('Error running query', err);
  } finally {
    client.release();
  }
};

getActiveConnections();

module.exports = pool;