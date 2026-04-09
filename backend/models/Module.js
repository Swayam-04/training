const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    cutoff_percentage: {
        type: Number,
        default: 60
    },
    time_limit: {
        type: Number, // in minutes
        default: 30
    },
    is_active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Module', ModuleSchema);
