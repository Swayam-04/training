const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    module_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    total_marks: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    status: {
        type: String, // PASS or FAIL
        required: true
    },
    certificate_id: {
        type: String,
        unique: true,
        sparse: true // Only unique if present
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Result', ResultSchema);
