// routes.js
const express = require('express');
const router = express.Router();
const studentRoutes = require('./Routes/studentRoutes');
const staffRoutes = require('./Routes/staffRoutes');


router.use('/student', studentRoutes);
router.use('/staff', staffRoutes);


module.exports = router;
