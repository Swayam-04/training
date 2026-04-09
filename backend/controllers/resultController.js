const Result = require('../models/Result');
const Module = require('../models/Module');
const Question = require('../models/Question');
const { v4: uuidv4 } = require('uuid');

// Submit quiz and calculate result
exports.submitQuiz = async (req, res) => {
    try {
        const { user_id, module_id, answers } = req.body; // answers: [{ question_id, selected_option }]

        const module = await Module.findById(module_id);
        if (!module) return res.status(404).json({ message: 'Module not found' });

        const questions = await Question.find({ module_id });

        let score = 0;
        let total_marks = 0;

        // Create a map for quick question lookup
        const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

        answers.forEach(ans => {
            const question = questionMap.get(ans.question_id);
            if (question) {
                total_marks += question.points;
                // Find correct option
                const correctOption = question.options.find(opt => opt.isCorrect);
                if (correctOption && correctOption.text === ans.selected_option) {
                    score += question.points;
                }
            }
        });

        // If not all questions were answered, we still need to calculate total possible marks
        // Actually, total marks should be sum of all questions in the module, not just answered ones.
        // Let's recalculate total_marks based on all questions in the DB for this module.
        total_marks = questions.reduce((sum, q) => sum + q.points, 0);

        const percentage = (score / total_marks) * 100;
        const isPassed = percentage >= module.cutoff_percentage;
        const status = isPassed ? 'PASS' : 'FAIL';

        let certificate_id = null;
        if (isPassed) {
            certificate_id = uuidv4();
        }

        const result = new Result({
            user_id,
            module_id,
            score,
            total_marks,
            percentage,
            status,
            certificate_id
        });

        await result.save();

        res.status(201).json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Get results by user
exports.getUserResults = async (req, res) => {
    try {
        const results = await Result.find({ user_id: req.params.userId })
            .populate('module_id', 'title')
            .sort({ completedAt: -1 });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get specific result with details
exports.getResultById = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate('module_id', 'title description')
            .populate('user_id', 'name email');
        if (!result) return res.status(404).json({ message: 'Result not found' });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Verify Certificate
exports.verifyCertificate = async (req, res) => {
    try {
        const { certificate_id } = req.params;
        const result = await Result.findOne({ certificate_id })
            .populate('module_id', 'title')
            .populate('user_id', 'name');

        if (!result) return res.status(404).json({ message: 'Invalid Certificate ID' });

        res.status(200).json({
            valid: true,
            candidate: result.user_id.name,
            module: result.module_id.title,
            score: result.percentage,
            date: result.completedAt
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
