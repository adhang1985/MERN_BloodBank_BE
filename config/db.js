const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log(`Connected to db : ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Datebase error : ${error.message}`);
    }
}

module.exports = connectDB