const HerbCollection = require('../models/HerbCollection');
const LabReport = require('../models/LabReport');
const fabricService = require('../services/fabric.service');
const ipfsService = require('../services/ipfs.service');
const { successResponse, errorResponse } = require('../utils/response.util');
const logger = require('../utils/logger.util');

exports.getPending = async (req, res) => {
  try {
    const batches = await HerbCollection.find({ 
      'blockchainRecord.status': 'PENDING' 
    }).sort({ createdAt: 1 });
    successResponse(res, batches);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.getCertificates = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'lab') {
      query.labId = req.user._id;
    } else if (req.user.role === 'farmer') {
      const farmerBatches = await HerbCollection.find({ farmerId: req.user._id }).distinct('batchId');
      query.batchId = { $in: farmerBatches };
    }
    // Admin sees all by default with query = {}

    const certificates = await LabReport.find(query)
      .populate('batch')
      .sort({ createdAt: -1 });
    successResponse(res, certificates);
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.startTesting = async (req, res) => {
  try {
    const { batchId } = req.params;
    const result = await fabricService.submitTransaction(
      req.user.fabricIdentity,
      'startLabTesting',
      batchId
    );

    await HerbCollection.findOneAndUpdate(
      { batchId },
      { 'blockchainRecord.status': 'LAB_TESTING' }
    );

    successResponse(res, result, 'Lab testing started');
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

exports.uploadReport = async (req, res) => {
  try {
    const { batchId, results, referenceNumber, testDate } = req.body;
    const reportFile = req.file;

    logger.info(`Processing Lab Report Submission - Batch: ${batchId}, Ref: ${referenceNumber}`);
    logger.info(`Request Content-Type: ${req.headers['content-type']}`);
    logger.info(`File Object Present: ${!!reportFile}`);
    
    if (!batchId) {
      logger.warn('Lab Report Submission Failed: Missing Batch ID');
      return errorResponse(res, 400, 'Batch ID is missing from the request');
    }
    if (!reportFile) {
      logger.warn('Lab Report Submission Failed: Missing Report File');
      return errorResponse(res, 400, 'The laboratory report PDF file is required');
    }
    if (!results) {
      logger.warn('Lab Report Submission Failed: Missing Results Data');
      return errorResponse(res, 400, 'Laboratory test results data is required');
    }

    logger.info(`Starting lab report upload for batch: ${batchId}`);

    // 1. Upload PDF to IPFS
    let ipfsResult;
    try {
      ipfsResult = await ipfsService.uploadFile(
        reportFile.buffer,
        `report-${batchId}-${Date.now()}.pdf`,
        'application/pdf'
      );
    } catch (ipfsErr) {
      logger.error('IPFS Upload Failed for Lab Report:', ipfsErr);
      return errorResponse(res, 502, 'Failed to upload report to IPFS storage. Please try again.');
    }

    // 2. Anchor to Blockchain
    let resultJson;
    try {
      resultJson = typeof results === 'string' ? JSON.parse(results) : results;
    } catch (parseErr) {
      logger.error('Failed to parse results JSON:', parseErr);
      return errorResponse(res, 400, 'Invalid format for laboratory results data');
    }

    if (!resultJson.overallResult) {
      return errorResponse(res, 400, 'Overall test result (PASS/FAIL) is missing from data');
    }

    logger.info(`Anchoring lab results to blockchain for batch: ${batchId}`);
    let fabricResult;
    try {
      fabricResult = await fabricService.submitTransaction(
        req.user.fabricIdentity,
        'recordLabResult',
        batchId,
        resultJson.overallResult,
        ipfsResult.cid,
        typeof results === 'string' ? results : JSON.stringify(results)
      );
    } catch (fabricErr) {
      logger.error('Fabric Transaction Failed (recordLabResult):', fabricErr);
      return errorResponse(res, 500, `Blockchain anchoring failed: ${fabricErr.message}`);
    }

    // 3. Save LabReport to MongoDB
    const report = await LabReport.create({
      batchId,
      labId: req.user._id,
      referenceNumber,
      testDate: testDate || new Date(),
      results: resultJson,
      document: {
        ipfsCid: ipfsResult.cid,
        ipfsUrl: ipfsResult.url,
        fileName: reportFile.originalname,
        fileSize: reportFile.size,
        uploadedAt: new Date()
      },
      blockchainRecord: {
        txId: fabricResult.txId,
        timestamp: new Date()
      },
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    });

    // 4. Update HerbCollection status
    const updatedCollection = await HerbCollection.findOneAndUpdate(
      { batchId },
      { 
        'blockchainRecord.status': resultJson.overallResult === 'PASS' ? 'LAB_PASSED' : 'LAB_FAILED',
        'blockchainRecord.txId': fabricResult.txId,
        'blockchainRecord.timestamp': new Date()
      },
      { new: true }
    );

    if (!updatedCollection) {
      logger.warn(`HerbCollection not found for batchId: ${batchId} during status update`);
    }

    logger.info(`Lab report successfully processed for batch: ${batchId}`);
    successResponse(res, report, 'Laboratory report uploaded and anchored to blockchain successfully');
  } catch (err) {
    logger.error('Lab Report Upload Error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return errorResponse(res, 400, `Validation failed: ${messages.join(', ')}`);
    }
    errorResponse(res, 500, `Internal server error during lab report upload: ${err.message}`);
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const labId = req.user._id;

    // 1. Quality Data (Purity per Herb)
    const qualityData = await LabReport.aggregate([
      { $match: { labId } },
      { $lookup: {
          from: 'herbcollections',
          localField: 'batchId',
          foreignField: 'batchId',
          as: 'herb'
      }},
      { $unwind: '$herb' },
      { $group: {
          _id: { $toUpper: '$herb.herbSpecies.common' },
          purity: { $avg: '$results.activeIngredient.measured' }
      }},
      { $project: {
          herb: '$_id',
          purity: { $round: ['$purity', 1] },
          _id: 0
      }},
      { $sort: { herb: 1 } }
    ]);

    // 2. Pass Fail Data
    const passFailStats = await LabReport.aggregate([
      { $match: { labId } },
      { $group: {
          _id: '$results.overallResult',
          count: { $sum: 1 }
      }}
    ]);

    const passFailData = [
      { name: 'Passed', value: passFailStats.find(s => s._id === 'PASS')?.count || 0 },
      { name: 'Failed', value: passFailStats.find(s => s._id === 'FAIL')?.count || 0 }
    ];

    // 3. Trend Data (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendStats = await LabReport.aggregate([
      { $match: { 
          labId,
          createdAt: { $gte: sevenDaysAgo }
      }},
      { $group: {
          _id: { $dateToString: { format: "%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0].substring(5, 10); // MM-DD
      const dayData = trendStats.find(s => s._id === dateStr);
      trendData.push({
        date: dateStr,
        count: dayData ? dayData.count : 0
      });
    }

    successResponse(res, {
      qualityData,
      passFailData,
      trendData
    });
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};
