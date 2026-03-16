require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const { validateEnv } = require('./src/config/environment');
const initializeAdmin = require('./src/services/admin.init');
const logger = require('./src/utils/logger.util');

// Validate Environment
validateEnv();

// Connect to Database
connectDB().then(() => {
  // Initialize Admin User from .env
  initializeAdmin();
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
