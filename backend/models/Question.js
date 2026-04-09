const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    module_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['MCQ', 'TrueFalse', 'Scenario'],
        default: 'MCQ'
    },
    context: {
        type: String, // For Scenario based questions
        required: function () { return this.type === 'Scenario'; }
    },
    options: [{
        text: String,
        isCorrect: Boolean
    }],
    points: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question', QuestionSchema);
