// config.js
module.exports = {
  port: process.env.PORT || 4000,
  secretKey: 'ley',
  dbConfig: {
    connectionString: 'postgresql://hanaval:2CfNmGv3MTaY@ep-quiet-mouse-a1wnmfav-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
  }
};