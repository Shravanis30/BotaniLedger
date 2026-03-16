const SyncQueue = require('../models/SyncQueue');
const logger = require('../utils/logger.util');

class SyncService {
  async addToQueue(userId, action, payload) {
    return await SyncQueue.create({ userId, action, payload });
  }

  async processQueue(userId) {
    const items = await SyncQueue.find({ userId, status: 'pending' }).sort({ createdAt: 1 });
    const results = [];

    for (const item of items) {
      item.status = 'processing';
      item.attempts += 1;
      await item.save();

      try {
        // Logic to process each action would go here
        // For now, we mock success
        item.status = 'completed';
        item.syncedAt = new Date();
        results.push({ id: item._id, success: true });
      } catch (err) {
        item.status = 'failed';
        item.lastError = err.message;
        results.push({ id: item._id, success: false, error: err.message });
      }
      await item.save();
    }
    return results;
  }
}

module.exports = new SyncService();
