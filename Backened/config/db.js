const mongoose = require('mongoose');

const connect = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connection built successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
};

module.exports = connect;