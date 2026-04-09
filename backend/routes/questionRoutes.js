const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.post('/', questionController.addQuestion);
router.get('/:moduleId', questionController.getQuestionsByModule); // Note: using moduleId as param based on controller logic
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
