// config.js
module.exports = {
  port: process.env.PORT || 3000,
  secretKey: 'ley',
  dbConfig: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'permit'
  }
};
