const mongoose = require('mongoose');

const AnomalyAlertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'DUPLICATE_BATCH',
      'GEO_INCONSISTENCY',
      'EXPIRED_CERTIFICATE',
      'DUPLICATE_PHOTO',
      'RAPID_LOCATION_CHANGE',
      'SIMILARITY_FAILURE',
      'SUSPICIOUS_PATTERN'
    ],
    required: true
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true
  },
  description: { type: String, required: true },
  affectedBatchId: String,
  affectedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: mongoose.Schema.Types.Mixed,
  status: {
    type: String,
    enum: ['OPEN', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'],
    default: 'OPEN'
  },
  resolvedBy: String,
  resolvedAt: Date,
  resolution: String
}, { timestamps: true });

module.exports = mongoose.model('AnomalyAlert', AnomalyAlertSchema);
