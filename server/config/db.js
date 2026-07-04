const mongoose = require('mongoose');

/**
 * Connects to MongoDB database using Mongoose
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`==================================================`);
    console.log(`🍀 MongoDB Connected: ${conn.connection.host}`);
    console.log(`==================================================`);
  } catch (error) {
    console.error(`==================================================`);
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`==================================================`);
    // Exit process with failure (1) to terminate server safely
    process.exit(1);
  }
};

module.exports = connectDB;
