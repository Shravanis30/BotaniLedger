const HerbCollection = require('../models/HerbCollection');
const fabricService = require('../services/fabric.service');
const ipfsService = require('../services/ipfs.service');
const aiService = require('../services/ai.service');
const imageDedupService = require('../services/image-dedup.service');
const anomalyService = require('../services/anomaly.service');
const { successResponse, errorResponse } = require('../utils/response.util');
const logger = require('../utils/logger.util');

const ALLOWED_SPECIES = new Set(['ashwagandha', 'tulsi']);

const normalizeSpeciesName = (value) => {
  const raw = String(value || '').trim();
  const commonName = raw.split(' (')[0];
  const normalized = commonName.toLowerCase();
  if (normalized === 'ashwghandha') return 'ashwagandha';
  if (normalized === 'tulasi') return 'tulsi';
  return normalized;
};

exports.createCollection = async (req, res) => {
  try {
    let { herbSpecies, quantity, unit, collectionDate, location, notes } = req.body;
    
    // Parse JSON strings from FormData
    if (typeof herbSpecies === 'string') herbSpecies = JSON.parse(herbSpecies);
    if (typeof location === 'string') location = JSON.parse(location);
    
    const photos = req.files || {};
    const normalizedSpecies = normalizeSpeciesName(herbSpecies?.common);

    if (!ALLOWED_SPECIES.has(normalizedSpecies)) {
      return errorResponse(res, 400, 'Only Ashwagandha and Tulsi collections are allowed');
    }

    if (!photos.macro || !photos.macro[0]) {
      return errorResponse(res, 400, 'Macro image is required for species verification');
    }

    // 1. Build file list and calculate hashes for duplicate blocking
    const photoFiles = [];
    const fileEntries = [];
    for (const key in photos) {
      if (photos[key] && photos[key][0]) {
        const file = photos[key][0];
        const imageHash = imageDedupService.createHash(file.buffer);
        fileEntries.push({
          role: key,
          imageHash,
          buffer: file.buffer,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        });
        photoFiles.push({
          buffer: file.buffer,
          name: `${key}-${Date.now()}.${file.originalname.split('.').pop()}`,
          type: file.mimetype
        });
      }
    }

    const duplicate = await imageDedupService.findDuplicate(fileEntries);
    if (duplicate) {
      logger.warn(`Duplicate image detected (${duplicate.fileRole}) from batch ${duplicate.batchId}. Proceeding anyway to allow retry/sync.`);
    }

    // 2. AI Species Verification BEFORE IPFS upload (verify each uploaded image)
    let aiResult = { speciesMatch: false, confidence: 0, matchedSpecies: 'none' };
    for (const entry of fileEntries) {
      try {
        const verification = await aiService.verifySpecies(entry.buffer, normalizedSpecies);
        if (entry.role === 'macro') {
          aiResult = verification;
        }

        if (!verification.speciesMatch || normalizeSpeciesName(verification.matchedSpecies) !== normalizedSpecies) {
          return errorResponse(
            res,
            422,
            `AI rejected ${entry.role} image. Expected ${normalizedSpecies}, detected ${verification.matchedSpecies || 'unknown'}`
          );
        }
      } catch (aiErr) {
        logger.error('AI Verification Error:', aiErr);
        return errorResponse(res, 502, `AI verification failed for ${entry.role} image`);
      }
    }

    // 3. Upload photos to IPFS individually for better reliability
    const uploadedPhotos = {};
    let ipfsFolderCid = 'QmFallbackIndividualPins';
    
    try {
        logger.info('Starting parallel IPFS pinning for all images...');
        const uploadPromises = fileEntries.map(async (entry) => {
            const uploadResult = await ipfsService.uploadFile(entry.buffer, entry.originalname, entry.mimetype);
            return { role: entry.role, result: uploadResult };
        });

        const uploadResults = await Promise.all(uploadPromises);
        uploadResults.forEach(res => {
            uploadedPhotos[res.role] = {
                cid: res.result.cid,
                url: res.result.url
            };
            if (res.role === 'macro') ipfsFolderCid = res.result.cid;
        });
        logger.info('All images successfully pinned to IPFS.');
    } catch (ipfsErr) {
        logger.error('IPFS Parallel Upload Error:', ipfsErr);
        return errorResponse(res, 502, 'IPFS upload failed during parallel pinning');
    }

    // Format location for GeoJSON
    const formattedLocation = {
        type: 'Point',
        coordinates: [parseFloat(location.lng) || 0, parseFloat(location.lat) || 0],
        accuracy: parseFloat(location.accuracy) || 0,
        zone: location.zone
    };

    const batchData = {
      farmerId: req.user._id,
      herbSpecies: {
          common: normalizedSpecies,
          botanical: herbSpecies.botanical || herbSpecies.scientific || '',
          code: herbSpecies.code
      },
      quantity: parseFloat(quantity),
      unit: unit || 'kg',
      collectionDate: collectionDate || new Date(),
      location: formattedLocation,
      photos: {
        ...uploadedPhotos,
        ipfsFolderCid
      },
      aiVerification: aiResult,
      notes
    };

    // 4. Anomaly Detection
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

    // 5. Save to MongoDB
    const herbBatch = await HerbCollection.create(batchData);
    try {
      await imageDedupService.saveMetadata(fileEntries, {
        ipfsFolderCid,
        species: normalizedSpecies,
        batchId: herbBatch.batchId,
        farmerId: req.user._id
      });
    } catch (dedupSaveErr) {
      logger.warn('Image metadata save issue (likely duplicate):', dedupSaveErr.message);
      // We continue because the herbBatch is already created and we want to anchor to blockchain
    }

    // 6. Anchor to Blockchain
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
    const normalizedSpecies = normalizeSpeciesName(species);
    if (!ALLOWED_SPECIES.has(normalizedSpecies)) {
      return errorResponse(res, 400, 'Preview is only supported for Ashwagandha or Tulsi');
    }

    const result = await aiService.verifySpecies(photo.buffer, normalizedSpecies);
    successResponse(res, result);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};
