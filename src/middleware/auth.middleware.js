const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response.util');

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
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return errorResponse(res, 401, 'User not found');
    }

    if (!req.user.isActive) {
      return errorResponse(res, 401, 'User account is inactive');
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired', { code: 'TOKEN_EXPIRED' });
    }
    return errorResponse(res, 401, 'Not authorized to access this route');
  }
};

module.exports = { protect };
