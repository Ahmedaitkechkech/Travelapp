// db.js
const mongoose = require("mongoose");




// Connect to MongoDB
const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB');
      
    }
};

module.exports = connectDB;
