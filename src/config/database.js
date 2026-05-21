const mongoose = require('mongoose');
const logger = require('../utils/logger.util');

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast in 5 seconds
      socketTimeoutMS: 45000,
      bufferCommands: false, // Don't hang queries if not connected
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    logger.warn('Database connection failed, but keeping server alive. Retrying in 10 seconds...');
    setTimeout(connectDB, 10000); // Retry after 10 seconds
  }
};

module.exports = connectDB;
