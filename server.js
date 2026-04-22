require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const { validateEnv } = require('./src/config/environment');
const initializeAdmin = require('./src/services/admin.init');
const logger = require('./src/utils/logger.util');

// Connect to Database & Initialize
const startServer = async () => {
  try {
    // Validate Environment
    validateEnv();

    await connectDB();
    
    // Initialize Admin User from .env
    await initializeAdmin();

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

const server = app; // Using the exported express app

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
