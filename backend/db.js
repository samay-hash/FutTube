const mongoose = require("mongoose");

async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mwarex";
    console.log("Connecting to MongoDB at:", mongoURI);

    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,              // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s default
      socketTimeoutMS: 45000,       // Close sockets after 45s of inactivity
    });
    console.log("MongoDB connected");
  } catch (e) {
    console.log("Database Error:", e.message);
  }
}

module.exports = {
  connectDB
}