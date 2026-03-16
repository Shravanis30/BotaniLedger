const HerbCollection = require('../models/HerbCollection');
const fabricService = require('../services/fabric.service');
const ipfsService = require('../services/ipfs.service');
const aiService = require('../services/ai.service');
const anomalyService = require('../services/anomaly.service');
const { successResponse, errorResponse } = require('../utils/response.util');
const logger = require('../utils/logger.util');

exports.createCollection = async (req, res) => {
  try {
    const { herbSpecies, quantity, unit, collectionDate, location, notes } = req.body;
    const photos = req.files;

    // 1. Upload photos to IPFS
    const photoFiles = [];
    for (const key in photos) {
      const file = photos[key][0];
      photoFiles.push({
        buffer: file.buffer,
        name: `${key}-${Date.now()}.${file.originalname.split('.').pop()}`,
        type: file.mimetype
      });
    }

    const ipfsFolderCid = await ipfsService.uploadFolder(photoFiles);
    
    // 2. AI Species Verification
    const aiResult = await aiService.verifySpecies(photos.macro[0].buffer, herbSpecies.common);

    const batchData = {
      farmerId: req.user._id,
      herbSpecies,
      quantity,
      unit,
      collectionDate,
      location: JSON.parse(location),
      photos: {
        ipfsFolderCid,
        macro: { cid: '', url: `${process.env.PINATA_GATEWAY}/ipfs/${ipfsFolderCid}/macro...` }
      },
      aiVerification: aiResult,
      notes
    };

    // 3. Anomaly Detection
    const anomalies = await anomalyService.checkForAnomalies(batchData, req.user._id);
    if (anomalies.length > 0) {
      batchData.isAnomaly = true;
      batchData.anomalyType = anomalies[0].type;
      // Log anomaly alert record separately
    }

    // 4. Save to MongoDB
    const herbBatch = await HerbCollection.create(batchData);

    // 5. Anchor to Blockchain
    try {
      const result = await fabricService.submitTransaction(
        req.user.fabricIdentity,
        'registerBatch',
        herbBatch.batchId,
        JSON.stringify({
          herbSpecies,
          quantity,
          collectionDate,
          location: batchData.location,
          ipfsFolderCid,
          aiConfidence: aiResult.confidence
        })
      );

      herbBatch.blockchainRecord = {
        txId: result.txId,
        status: 'PENDING',
        timestamp: new Date()
      };
      herbBatch.syncStatus = 'synced';
      await herbBatch.save();
    } catch (blockchainErr) {
      logger.error('Blockchain anchor failed for batch:', herbBatch.batchId, blockchainErr);
      herbBatch.syncStatus = 'failed';
      await herbBatch.save();
    }

    successResponse(res, herbBatch, 'Herb batch collection recorded');
  } catch (err) {
    logger.error('Collection error:', err);
    errorResponse(res, 500, err.message);
  }
};

exports.getBatches = async (req, res) => {
  try {
    const batches = await HerbCollection.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    successResponse(res, batches);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.dispatchBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { estimatedArrival, transportMode } = req.body;

    const batch = await HerbCollection.findOne({ batchId, farmerId: req.user._id });
    if (!batch) return errorResponse(res, 404, 'Batch not found');

    const result = await fabricService.submitTransaction(
      req.user.fabricIdentity,
      'dispatchBatch',
      batchId,
      JSON.stringify({ estimatedArrival, transportMode })
    );

    batch.blockchainRecord.status = 'IN_TRANSIT';
    batch.blockchainRecord.txId = result.txId;
    await batch.save();

    successResponse(res, batch, 'Batch dispatched successfully');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};
