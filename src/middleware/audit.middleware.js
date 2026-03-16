const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger.util');

const auditLog = (action, resource) => async (req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    const status = res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'failure';
    
    AuditLog.create({
      userId: req.user?._id,
      action,
      resource,
      resourceId: req.params.id || req.params.batchId || req.params.productBatchId,
      payload: req.method === 'GET' ? null : req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      status,
      error: status === 'failure' ? data.toString() : null
    }).catch(err => logger.error('Audit log failed:', err));

    return originalSend.apply(res, arguments);
  };

  next();
};

module.exports = { auditLog };
