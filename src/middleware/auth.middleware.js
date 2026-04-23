const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response.util');
const logger = require('../utils/logger.util');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized to access this route');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    logger.info(`[Auth] Token verified for ID: ${decoded.id}`);
    
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      logger.warn(`[Auth] User not found in DB for ID: ${decoded.id}`);
      return errorResponse(res, 401, 'User associated with this token no longer exists');
    }

    if (!req.user.isActive) {
      logger.warn(`[Auth] Inactive user access attempt: ${req.user.email} (${req.user._id})`);
      return errorResponse(res, 401, 'User account is inactive');
    }

    next();
  } catch (err) {
    logger.error(`[Auth] Error verifying token: ${err.message}`);
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired');
    }
    return errorResponse(res, 401, `Not authorized: ${err.message}`);
  }
};

module.exports = { protect };
