const User = require('../models/User');
const HerbCollection = require('../models/HerbCollection');
const AnomalyAlert = require('../models/AnomalyAlert');
const AuditLog = require('../models/AuditLog');
const { successResponse, errorResponse } = require('../utils/response.util');

exports.getStats = async (req, res) => {
  try {
    const totalBatches = await HerbCollection.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const openAnomalies = await AnomalyAlert.countDocuments({ status: 'OPEN' });

    // Aggregate Batch Volume (Last 6 Weeks)
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

    const batchVolume = await HerbCollection.aggregate([
      { $match: { createdAt: { $gte: sixWeeksAgo } } },
      {
        $group: {
          _id: { $week: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          name: { $concat: ["W", { $toString: "$_id" }] },
          value: "$count"
        }
      }
    ]);

    // Aggregate Status Distribution
    const statusAgg = await HerbCollection.aggregate([
      {
        $group: {
          _id: "$blockchainRecord.status",
          count: { $sum: 1 }
        }
      }
    ]);

    const total = statusAgg.reduce((acc, curr) => acc + curr.count, 0);
    const statusDistribution = statusAgg.map(s => ({
      name: s._id || 'PENDING',
      value: Math.round((s.count / total) * 100)
    }));
    
    successResponse(res, {
      totalBatches,
      activeUsers,
      openAnomalies,
      batchVolume: batchVolume.length > 0 ? batchVolume : [{ name: 'W1', value: 0 }],
      statusDistribution: statusDistribution.length > 0 ? statusDistribution : [{ name: 'PENDING', value: 100 }]
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
    const { farmerId } = req.query;
    let query = {};
    if (farmerId) query.farmerId = farmerId;
    
    const batches = await HerbCollection.find(query).sort({ createdAt: -1 });
    successResponse(res, batches);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { role: { $ne: 'admin' } };
    
    if (status === 'pending') query.isActive = false;
    if (status === 'approved') query.isActive = true;

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    successResponse(res, users);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return errorResponse(res, 404, 'User not found');
    
    successResponse(res, null, 'User permanenetly removed from database');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.getNodeHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await AuditLog.find({ userId }).sort({ timestamp: -1 }).limit(10);
    successResponse(res, history);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};
