const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Module = require('./models/Module');
const Question = require('./models/Question');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await User.deleteMany({});
        await Module.deleteMany({});
        await Question.deleteMany({});

        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = new User({
            name: 'Super Admin',
            email: 'admin@cyber.com',
            password: hashedPassword,
            role: 'admin'
        });
        await admin.save();
        console.log('Admin user created');

        // Create Kiosk User/Trainer
        const trainer = new User({
            name: 'Kiosk Trainer',
            email: 'trainer@cyber.com',
            password: hashedPassword,
            role: 'trainer',
            kiosk_id: 'K-001'
        });
        await trainer.save();
        console.log('Trainer user created');

        // Create Sample Module
        const module1 = new Module({
            title: 'Phishing Awareness 101',
            description: 'Learn how to identify and avoid phishing attacks.',
            cutoff_percentage: 70,
            time_limit: 15
        });
        await module1.save();

        // Add Questions
        const q1 = new Question({
            module_id: module1._id,
            text: 'What is the primary indicator of a phishing email?',
            type: 'MCQ',
            points: 10,
            options: [
                { text: 'It comes from a known contact', isCorrect: false },
                { text: 'It has a sense of urgency and suspicious links', isCorrect: true },
                { text: 'It contains a PDF attachment', isCorrect: false },
                { text: 'It is addressed to you by name', isCorrect: false }
            ]
        });

        const q2 = new Question({
            module_id: module1._id,
            text: 'True or False: You should always click links in emails to verify your account.',
            type: 'TrueFalse',
            points: 10,
            options: [
                { text: 'True', isCorrect: false },
                { text: 'False', isCorrect: true }
            ]
        });

        await q1.save();
        await q2.save();

        console.log('Sample Data Seeded');
        process.exit();
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
