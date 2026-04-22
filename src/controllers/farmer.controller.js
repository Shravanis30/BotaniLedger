const HerbCollection = require('../models/HerbCollection');
const fabricService = require('../services/fabric.service');
const ipfsService = require('../services/ipfs.service');
const aiService = require('../services/ai.service');
const anomalyService = require('../services/anomaly.service');
const { successResponse, errorResponse } = require('../utils/response.util');
const logger = require('../utils/logger.util');

exports.createCollection = async (req, res) => {
  try {
    let { herbSpecies, quantity, unit, collectionDate, location, notes } = req.body;
    
    // Parse JSON strings from FormData
    if (typeof herbSpecies === 'string') herbSpecies = JSON.parse(herbSpecies);
    if (typeof location === 'string') location = JSON.parse(location);
    
    const photos = req.files || {};

    // 1. Upload photos to IPFS
    const photoFiles = [];
    for (const key in photos) {
      if (photos[key] && photos[key][0]) {
        const file = photos[key][0];
        photoFiles.push({
          buffer: file.buffer,
          name: `${key}-${Date.now()}.${file.originalname.split('.').pop()}`,
          type: file.mimetype
        });
      }
    }

    let ipfsFolderCid = 'QmNotUploadedDueToError';
    try {
        ipfsFolderCid = await ipfsService.uploadFolder(photoFiles);
    } catch (ipfsErr) {
        logger.error('IPFS Upload Error:', ipfsErr);
    }
    
    // 2. AI Species Verification (Only if macro photo exists)
    let aiResult = { speciesMatch: false, confidence: 0, matchedSpecies: 'none' };
    if (photos.macro && photos.macro[0]) {
        try {
            aiResult = await aiService.verifySpecies(photos.macro[0].buffer, herbSpecies.common);
        } catch (aiErr) {
            logger.error('AI Verification Error:', aiErr);
        }
    }

    // Format location for GeoJSON
    const formattedLocation = {
        type: 'Point',
        coordinates: [location.lng || 0, location.lat || 0],
        accuracy: location.accuracy,
        zone: location.zone
    };

    const batchData = {
      farmerId: req.user._id,
      herbSpecies: {
          common: herbSpecies.common,
          botanical: herbSpecies.botanical || herbSpecies.scientific || '',
          code: herbSpecies.code
      },
      quantity: parseFloat(quantity),
      unit: unit || 'kg',
      collectionDate: collectionDate || new Date(),
      location: formattedLocation,
      photos: {
        ipfsFolderCid,
        macro: photos.macro ? { url: `${process.env.PINATA_GATEWAY}/ipfs/${ipfsFolderCid}/macro.jpg` } : undefined
      },
      aiVerification: aiResult,
      notes
    };

    // 3. Anomaly Detection
    let anomalies = [];
    try {
        anomalies = await anomalyService.checkForAnomalies(batchData, req.user._id);
    } catch (anoErr) {
        logger.error('Anomaly Detection Error:', anoErr);
    }

    if (anomalies.length > 0) {
      batchData.isAnomaly = true;
      batchData.anomalyType = anomalies[0].type;
    }

    // 4. Save to MongoDB
    const herbBatch = await HerbCollection.create(batchData);

    // 5. Anchor to Blockchain
    try {
      if (req.user.fabricIdentity) {
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
      } else {
        logger.warn('User has no Fabric Identity. Skipping blockchain anchor.');
        herbBatch.syncStatus = 'failed';
      }
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

exports.getBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    // Note: This allows any authenticated node to view batch details by ID
    // which is necessary for Lab testing and verification.
    const batch = await HerbCollection.findOne({ batchId });
    if (!batch) return errorResponse(res, 404, 'Batch not found');
    successResponse(res, batch);
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

exports.verifyPreview = async (req, res) => {
  try {
    const { species } = req.body;
    const photo = req.file;
    if (!photo) return errorResponse(res, 400, 'Photo is required');

    const result = await aiService.verifySpecies(photo.buffer, species);
    successResponse(res, result);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};
