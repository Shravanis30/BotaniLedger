const mongoose = require('mongoose');

const SyncQueueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  attempts: { type: Number, default: 0 },
  lastError: String,
  syncedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('SyncQueue', SyncQueueSchema);
