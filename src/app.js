const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

const { errorResponse } = require('./utils/response.util');
const logger = require('./utils/logger.util');

// Import routes
const authRoutes = require('./routes/auth.routes');
const farmerRoutes = require('./routes/farmer.routes');
const labRoutes = require('./routes/lab.routes');
const manufacturerRoutes = require('./routes/manufacturer.routes');
const adminRoutes = require('./routes/admin.routes');
const regulatorRoutes = require('./routes/regulator.routes');
const verifyRoutes = require('./routes/verify.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/farmer', farmerRoutes);
app.use('/api/v1/lab', labRoutes);
app.use('/api/v1/manufacturer', manufacturerRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/regulator', regulatorRoutes);
app.use('/api/v1/verify', verifyRoutes);

// 404 handler
app.use((req, res) => {
  errorResponse(res, 404, 'Route not found');
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled Error:', err);
  errorResponse(res, err.status || 500, err.message || 'Internal Server Error');
});

module.exports = app;
// update on 2026-03-15 - feat: update dashboard UI components
// update on 2026-03-18 - fix: resolve API validation issue
// update on 2026-03-22 - feat: optimize blockchain interaction
// update on 2026-03-23 - docs: update API documentation
// update on 2026-03-25 - feat: improve farmer batch handling
// update on 2026-03-26 - docs: update API documentation
// update on 2026-03-28 - feat: optimize blockchain interaction
// update on 2026-03-31 - refactor: optimize backend performance
// update on 2026-03-31 - fix: resolve API validation issue
// update on 2026-04-02 - feat: update dashboard UI components
// update on 2026-04-03 - fix: correct edge case in service logic
// update on 2026-04-04 - feat: enhance authentication flow
// update on 2026-04-04 - refactor: improve code structure
// update on 2026-04-06 - fix: resolve API validation issue
// update on 2026-04-10 - fix: correct edge case in service logic
