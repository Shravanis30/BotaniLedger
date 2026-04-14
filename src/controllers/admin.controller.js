const User = require('../models/User');
const HerbCollection = require('../models/HerbCollection');
const AnomalyAlert = require('../models/AnomalyAlert');
const { successResponse, errorResponse } = require('../utils/response.util');

exports.getStats = async (req, res) => {
  try {
    const totalBatches = await HerbCollection.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const openAnomalies = await AnomalyAlert.countDocuments({ status: 'OPEN' });
    
    successResponse(res, {
      totalBatches,
      activeUsers,
      openAnomalies
    });
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.getAnomalies = async (req, res) => {
  try {
    const anomalies = await AnomalyAlert.find().sort({ createdAt: -1 }).populate('affectedUserId', 'name email');
    successResponse(res, anomalies);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.resolveAnomaly = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    const anomaly = await AnomalyAlert.findByIdAndUpdate(id, {
      status: 'RESOLVED',
      resolution,
      resolvedBy: req.user.name,
      resolvedAt: new Date()
    }, { new: true });

    successResponse(res, anomaly, 'Anomaly resolved');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: false, role: { $ne: 'admin' } }).select('-password');
    successResponse(res, users, 'Pending users retrieved');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // 'approve' or 'reject'

    if (status === 'approve') {
      const user = await User.findByIdAndUpdate(userId, { isActive: true }, { new: true }).select('-password');
      successResponse(res, user, 'User approved successfully');
    } else {
      await User.findByIdAndDelete(userId);
      successResponse(res, null, 'User application rejected and removed');
    }
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.getAllBatches = async (req, res) => {
  try {
    const batches = await HerbCollection.find().sort({ createdAt: -1 });
    successResponse(res, batches);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    successResponse(res, users);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};
