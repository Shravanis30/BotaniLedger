const ProductBatch = require('../models/ProductBatch');
const HerbCollection = require('../models/HerbCollection');
const LabReport = require('../models/LabReport');
const redis = require('../config/redis');
const { successResponse, errorResponse } = require('../utils/response.util');

exports.verifyProduct = async (req, res) => {
  try {
    const { productBatchId: searchId } = req.params;

    // Try cache first
    const cachedData = await redis.get(`verify:${searchId}`);
    if (cachedData) {
      return successResponse(res, JSON.parse(cachedData), 'Verification data retrieved from cache');
    }

    let productBatch = await ProductBatch.findOne({ productBatchId: searchId }).populate('manufacturerId', 'name organization');
    let herbBatches = [];
    let labReports = [];

    if (!productBatch) {
      // If not a product batch, check if it's a herb batch ID
      const herbBatch = await HerbCollection.findOne({ batchId: searchId }).populate('farmerId', 'name organization');
      if (herbBatch) {
        // Find if any product batch exists for this herb batch
        productBatch = await ProductBatch.findOne({ 'linkedHerbBatches.batchId': searchId }).populate('manufacturerId', 'name organization');
        herbBatches = [herbBatch];
        labReports = await LabReport.find({ batchId: searchId }).populate('labId', 'name organization');
      }
    } else {
      // It's a product batch, fetch all linked herb batches
      const linkedIds = productBatch.linkedHerbBatches.map(b => b.batchId);
      herbBatches = await HerbCollection.find({ batchId: { $in: linkedIds } }).populate('farmerId', 'name organization');
      labReports = await LabReport.find({ batchId: { $in: linkedIds } }).populate('labId', 'name organization');
    }

    if (!productBatch && herbBatches.length === 0) {
      return errorResponse(res, 404, 'Registry record not found in the ledger.');
    }

    const result = {
      product: productBatch || {
          productName: herbBatches[0].herbSpecies.common + ' (Unprocessed)',
          productBatchId: 'UNLINKED',
          manufacturingDate: null,
          expiryDate: null
      },
      traceability: herbBatches.map(hb => {
        const report = labReports.find(r => r.batchId === hb.batchId);
        return {
          herbBatch: hb,
          labReport: report
        };
      })
    };

    // Cache for 5 minutes
    await redis.setex(`verify:${searchId}`, 300, JSON.stringify(result));

    successResponse(res, result, 'Verification data retrieved successfully');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};
