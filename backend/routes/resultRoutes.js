const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

router.post('/submit', resultController.submitQuiz);
router.get('/user/:userId', resultController.getUserResults);
router.get('/verify/:certificate_id', resultController.verifyCertificate);
router.get('/:id', resultController.getResultById);

module.exports = router;
