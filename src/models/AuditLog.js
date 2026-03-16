const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: String,
  payload: mongoose.Schema.Types.Mixed,
  ip: String,
  userAgent: String,
  status: { type: String, enum: ['success', 'failure'] },
  error: String,
  timestamp: { type: Date, default: Date.now }
}, { timestamps: false });

AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
