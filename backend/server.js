const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars (only works locally, Render uses dashboard env vars)
dotenv.config();

const app = express();

// ── Startup Logging ────────────────────────────────
console.log('=== TRAINING SERVER STARTUP ===');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Set (hidden)' : '❌ NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set (hidden)' : '❌ NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('===============================');

// ── Middleware ──────────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// ── Health Check ───────────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Cyber Training API is running' });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ─────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/modules', require('./routes/moduleRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// ── Database Connection & Start ────────────────────
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Training API running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection failed:', err.message);
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`⚠️ Server running on port ${PORT} WITHOUT database`);
        });
    });
