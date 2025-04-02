const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

exports.dbConnect = async () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log('MongoDB connected successfully');
        })
        .catch((err) => console.error('MongoDB connection error:', err));
}