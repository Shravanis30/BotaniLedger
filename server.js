require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const { validateEnv } = require('./src/config/environment');
const initializeAdmin = require('./src/services/admin.init');
const logger = require('./src/utils/logger.util');

// Connect to Database & Initialize
let server;

const startServer = async () => {
  try {
    // Validate Environment
    validateEnv();

    await connectDB();
    
    // Initialize Admin User from .env
    await initializeAdmin();

    const PORT = process.env.PORT || 5080;
    server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`Accepting connections from all interfaces (0.0.0.0)`);
    });

  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
