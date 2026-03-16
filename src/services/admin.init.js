const User = require('../models/User');
const logger = require('../utils/logger.util');

const initializeAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      logger.warn('Admin credentials missing in .env. System might be inaccessible for administrative tasks.');
      return;
    }

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'AYUSH Ministry Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        organization: 'Ministry of AYUSH',
        isActive: true // System admin is active by default
      });
      logger.info('System Admin account created from .env credentials');
    } else {
      // Potentially update admin password if it changed in .env
      adminExists.password = adminPassword;
      adminExists.isActive = true;
      await adminExists.save();
      logger.info('System Admin account verified/updated');
    }
  } catch (err) {
    logger.error('Error initializing system admin:', err);
  }
};

module.exports = initializeAdmin;
