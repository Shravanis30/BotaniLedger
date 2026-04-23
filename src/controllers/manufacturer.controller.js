const HerbCollection = require('../models/HerbCollection');
const ProductBatch = require('../models/ProductBatch');
const fabricService = require('../services/fabric.service');
const aiService = require('../services/ai.service');
const qrService = require('../services/qr.service');
const { successResponse, errorResponse } = require('../utils/response.util');

exports.getInventory = async (req, res) => {
  try {
    const batches = await HerbCollection.find({
      'blockchainRecord.status': { $in: ['LAB_PASSED', 'RECEIVED', 'MANUFACTURER_APPROVED', 'MANUFACTURER_REJECTED'] }
    })
    .populate('labReport')
    .sort({ updatedAt: -1 });
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
    
    // Ensure we have a zone for status mapping
    if (!similarityResult.zone) similarityResult.zone = 'GREEN';

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
        'blockchainRecord.status': statusMap[similarityResult.zone] || 'MANUFACTURER_APPROVED',
        similarityScore: similarityResult.overallScore
      }
    );

    successResponse(res, { similarityResult, fabricResult: result }, 'Similarity verification complete');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.rejectBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { reason } = req.body;

    const result = await fabricService.submitTransaction(
      req.user.fabricIdentity,
      'rejectBatch',
      batchId,
      JSON.stringify({ reason })
    );

    await HerbCollection.findOneAndUpdate(
      { batchId },
      { 'blockchainRecord.status': 'MANUFACTURER_REJECTED', rejectionReason: reason }
    );

    successResponse(res, result, 'Batch rejected successfully');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.createProductBatch = async (req, res) => {
  try {
    const { productName, productType, linkedHerbBatches, manufacturingDate, expiryDate, quantity } = req.body;
    logger.info(`[CreateProductBatch] Request for: ${productName}`);

    const productBatchId = `BP-${Date.now()}`;
    
    // 1. Anchor to Blockchain
    let result;
    try {
      result = await fabricService.submitTransaction(
        req.user.fabricIdentity,
        'createProductBatch',
        productBatchId,
        JSON.stringify({
          productName, productType, linkedHerbBatches, manufacturingDate, expiryDate, quantity
        })
      );
      logger.info(`[CreateProductBatch] Blockchain Anchor Success: ${productBatchId}`);
    } catch (fbErr) {
      logger.error('[CreateProductBatch] Blockchain Error:', fbErr);
      throw new Error(`Blockchain anchoring failed: ${fbErr.message}`);
    }

    // 2. Save to MongoDB (QR will be generated later)
    try {
      const productBatch = await ProductBatch.create({
        productBatchId,
        manufacturerId: req.user._id,
        productName,
        productType,
        linkedHerbBatches: linkedHerbBatches.map(id => ({ batchId: id })),
        manufacturingDate,
        expiryDate,
        quantity: Number(quantity),
        blockchainRecord: {
          txId: result.txId || 'SIMULATED_TX',
          timestamp: result.timestamp || new Date(),
          status: 'ACTIVE'
        }
      });

      logger.info(`[CreateProductBatch] Product Created: ${productBatchId}`);
      return successResponse(res, productBatch, 'Product batch created and anchored successfully');
    } catch (dbErr) {
      logger.error('[CreateProductBatch] Database Error:', dbErr);
      return errorResponse(res, 500, `Database error: ${dbErr.message}`);
    }
  } catch (err) {
    logger.error('[CreateProductBatch] Global Error:', err);
    return errorResponse(res, 500, err.message);
  }
};

exports.generateProductQR = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductBatch.findById(id);

    if (!product) {
      return errorResponse(res, 404, 'Product batch not found');
    }

    if (product.qrCode?.data) {
      return successResponse(res, product, 'QR code already exists');
    }

    // Generate QR Code
    const qrData = await qrService.generateProductQR(product.productBatchId);
    
    product.qrCode = {
      data: qrData.data,
      url: qrData.url,
      signature: qrData.signature,
      generatedAt: new Date()
    };

    await product.save();

    logger.info(`[GenerateQR] Success for: ${product.productBatchId}`);
    
    const responseData = product.toObject();
    delete responseData.qrCode.data; // Don't send huge base64
    
    return successResponse(res, responseData, 'QR code generated and registered successfully');
  } catch (err) {
    logger.error('[GenerateQR] Error:', err);
    return errorResponse(res, 500, err.message);
  }
};
