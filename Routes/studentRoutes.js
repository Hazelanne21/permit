const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/create', studentController.create);
router.post('/login', studentController.login);
router.get('/getAllStudent', authenticateToken, studentController.getAll);
router.post('/logout', authenticateToken, studentController.logout);
router.post('/getPermit', authenticateToken, authenticateToken, studentController.getPermit); 
router.get('/permits', authenticateToken, studentController.getAllPermits);
router.put('/update', authenticateToken, studentController.update); 
router.delete('/delete', authenticateToken, studentController.delete);


module.exports = router;
