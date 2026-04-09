const Question = require('../models/Question');

// Add a question to a module
exports.addQuestion = async (req, res) => {
    try {
        const { module_id, text, type, options, points } = req.body;
        const newQuestion = new Question({
            module_id,
            text,
            type,
            options,
            points
        });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get questions by module ID
exports.getQuestionsByModule = async (req, res) => {
    try {
        const questions = await Question.find({ module_id: req.params.moduleId });
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) return res.status(404).json({ message: 'Question not found' });
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
