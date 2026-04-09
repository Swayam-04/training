const mongoose = require('mongoose');
const dotenv = require('dotenv');

console.log("Loading dotenv...");
const result = dotenv.config();
console.log("Dotenv result:", result);

console.log("MONGO_URI:", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing!");
    process.exit(1);
}

console.log("Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected Successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('MongoDB Connection Failed:', err);
        process.exit(1);
    });
