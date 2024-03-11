const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticateToken = require('../middlewares/authenticateToken');

<<<<<<< HEAD
router.post('/create', studentController.create);
router.post('/login', studentController.login);
router.get('/getAllStudent', studentController.getAll);
router.post('/logout', studentController.logout);
router.post('/getPermit', authenticateToken, studentController.getPermit); 
router.get('/permits', studentController.getAllPermits);
router.put('/update', studentController.update); 
router.delete('/delete', studentController.delete);
=======
router.post('/create', authenticateToken, studentController.create);
router.post('/login', authenticateToken, studentController.login);
router.get('/getAllStudent', authenticateToken, studentController.getAll);
router.post('/logout', authenticateToken, studentController.logout);
router.post('/getPermit', authenticateToken, authenticateToken, studentController.getPermit); 
router.get('/permits', authenticateToken, studentController.getAllPermits);
router.put('/update', authenticateToken, studentController.update); 
router.delete('/delete', authenticateToken, studentController.delete);
>>>>>>> 96320a09a0d67082319f17e679996163db95d20d



module.exports = router;
