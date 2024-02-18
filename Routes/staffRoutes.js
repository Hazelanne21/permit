// routes/staffRoutes.js
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/create', staffController.create);
router.post('/login', staffController.login);
router.get('/getallstaff', staffController.getallstaff);
router.put('/update', authenticateToken, staffController.update);
router.delete('/delete', authenticateToken, staffController.delete);
router.post('/logout', authenticateToken, staffController.logout);


router.post('/createTuitionList', authenticateToken, staffController.createTuitionList);
router.put('/updateTuitionList', authenticateToken, staffController.updateTuitionList);
router.delete('/deleteTuitionList', authenticateToken, staffController.deleteTuitionList);


router.post('/createSubject', authenticateToken, staffController.createSubject);
router.get('/getSubject', authenticateToken, staffController.getSubject);
router.delete('/deleteSubject', authenticateToken, staffController.deleteSubject);

module.exports = router;
