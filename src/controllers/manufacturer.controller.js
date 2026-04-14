const HerbCollection = require('../models/HerbCollection');
const ProductBatch = require('../models/ProductBatch');
const fabricService = require('../services/fabric.service');
const aiService = require('../services/ai.service');
const qrService = require('../services/qr.service');
const { successResponse, errorResponse } = require('../utils/response.util');

exports.getInventory = async (req, res) => {
  try {
    const batches = await HerbCollection.find({
      'blockchainRecord.status': { $in: ['LAB_PASSED', 'RECEIVED', 'MANUFACTURER_APPROVED'] }
    }).sort({ updatedAt: -1 });
    successResponse(res, batches);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await ProductBatch.find({ manufacturerId: req.user._id }).sort({ createdAt: -1 });
    successResponse(res, products);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.confirmReceipt = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { condition } = req.body;

    const result = await fabricService.submitTransaction(
      req.user.fabricIdentity,
      'confirmReceipt',
      batchId,
      JSON.stringify({ condition })
    );

    await HerbCollection.findOneAndUpdate(
      { batchId },
      { 'blockchainRecord.status': 'RECEIVED' }
    );

    successResponse(res, result, 'Batch receipt confirmed');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.similarityCheck = async (req, res) => {
  try {
    const { batchId } = req.body;
    // arrivalPhotos from multer would be here
    
    // Simulate AI similarity check
    const similarityResult = await aiService.calculateSimilarity();

    const result = await fabricService.submitTransaction(
      req.user.fabricIdentity,
      'recordSimilarityResult',
      batchId,
      JSON.stringify(similarityResult)
    );

    const statusMap = {
      'GREEN': 'MANUFACTURER_APPROVED',
      'YELLOW': 'PENDING_QC_REVIEW',
      'RED': 'MANUFACTURER_REJECTED'
    };

    await HerbCollection.findOneAndUpdate(
      { batchId },
      { 
        'blockchainRecord.status': statusMap[similarityResult.zone],
        similarityScore: similarityResult.overallScore
      }
    );

    successResponse(res, { similarityResult, fabricResult: result }, 'Similarity verification complete');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.createProductBatch = async (req, res) => {
  try {
    const { productName, productType, linkedHerbBatches, manufacturingDate, expiryDate, quantity } = req.body;

    const productBatchId = `BP-${Date.now()}`;
    
    // 1. Generate QR Code
    const qrData = await qrService.generateProductQR(productBatchId);

    // 2. Anchor to Blockchain
    const result = await fabricService.submitTransaction(
      req.user.fabricIdentity,
      'createProductBatch',
      productBatchId,
      JSON.stringify({
        productName, productType, linkedHerbBatches, manufacturingDate, expiryDate, quantity
      })
    );

    // 3. Save to MongoDB
    const productBatch = await ProductBatch.create({
      productBatchId,
      manufacturerId: req.user._id,
      productName,
      productType,
      linkedHerbBatches: linkedHerbBatches.map(id => ({ batchId: id })),
      manufacturingDate,
      expiryDate,
      quantity,
      qrCode: qrData,
      blockchainRecord: {
        txId: result.txId,
        status: 'ACTIVE',
        timestamp: new Date()
      }
    });

    successResponse(res, productBatch, 'Product batch created and anchored');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};
