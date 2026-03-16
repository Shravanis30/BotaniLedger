const ProductBatch = require('../models/ProductBatch');
const HerbCollection = require('../models/HerbCollection');
const LabReport = require('../models/LabReport');
const redis = require('../config/redis');
const { successResponse, errorResponse } = require('../utils/response.util');

exports.verifyProduct = async (req, res) => {
  try {
    const { productBatchId } = req.params;

    // Try cache first
    const cachedData = await redis.get(`verify:${productBatchId}`);
    if (cachedData) {
      return successResponse(res, JSON.parse(cachedData), 'Verification data retrieved from cache');
    }

    const productBatch = await ProductBatch.findOne({ productBatchId }).populate('manufacturerId', 'name organization');
    if (!productBatch) return errorResponse(res, 404, 'Product batch not found');

    // Fetch details for all linked herb batches
    const linkedIds = productBatch.linkedHerbBatches.map(b => b.batchId);
    const herbBatches = await HerbCollection.find({ batchId: { $in: linkedIds } }).populate('farmerId', 'name organization');
    
    // Fetch lab reports
    const labReports = await LabReport.find({ batchId: { $in: linkedIds } }).populate('labId', 'name organization');

    const result = {
      product: productBatch,
      traceability: herbBatches.map(hb => {
        const report = labReports.find(r => r.batchId === hb.batchId);
        return {
          herbBatch: hb,
          labReport: report
        };
      })
    };

    // Cache for 5 minutes
    await redis.setex(`verify:${productBatchId}`, 300, JSON.stringify(result));

    successResponse(res, result, 'Verification data retrieved successfully');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};
