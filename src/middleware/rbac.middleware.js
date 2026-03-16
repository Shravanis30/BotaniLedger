const { errorResponse } = require('../utils/response.util');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, `Role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};

module.exports = { authorize };
