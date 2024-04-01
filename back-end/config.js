// config.js
module.exports = {
  port: process.env.PORT || 4000,
  secretKey: 'hazel',
  dbConfig: {
    user: 'hanaval',
    host: 'ep-quiet-mouse-a1wnmfav-pooler.ap-southeast-1.aws.neon.tech',
    database: 'neondb',
    password: '2CfNmGv3MTaY',
    port: 5432, // default PostgreSQL port
    ssl: { rejectUnauthorized: false } // required for Heroku
  }
};