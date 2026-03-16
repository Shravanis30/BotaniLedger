const AuditLog = require('../models/AuditLog');
const HerbCollection = require('../models/HerbCollection');
const { successResponse, errorResponse } = require('../utils/response.util');

exports.getAuditTrail = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    successResponse(res, logs);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.getBatchHistory = async (req, res) => {
  try {
    const { batchId } = req.params;
    // History would come from both DB and Blockchain history query
    const dbHistory = await HerbCollection.findOne({ batchId });
    // const fabricHistory = await fabricService.getBatchHistory(req.user.fabricIdentity, batchId);
    
    successResponse(res, {
      currentStatus: dbHistory,
      blockchainHistory: [] // Placeholder
    });
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};
