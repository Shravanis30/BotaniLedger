const HerbCollection = require('../models/HerbCollection');
const LabReport = require('../models/LabReport');
const fabricService = require('../services/fabric.service');
const ipfsService = require('../services/ipfs.service');
const { successResponse, errorResponse } = require('../utils/response.util');

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
      .populate('batchId')
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

    // 1. Upload PDF to IPFS
    const ipfsResult = await ipfsService.uploadFile(
      reportFile.buffer,
      `report-${batchId}.pdf`,
      'application/pdf'
    );

    // 2. Anchor to Blockchain
    const resultJson = JSON.parse(results);
    const fabricResult = await fabricService.submitTransaction(
      req.user.fabricIdentity,
      'recordLabResult',
      batchId,
      resultJson.overallResult,
      ipfsResult.cid,
      results
    );

    // 3. Save LabReport to MongoDB
    const report = await LabReport.create({
      batchId,
      labId: req.user._id,
      referenceNumber,
      testDate,
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
    await HerbCollection.findOneAndUpdate(
      { batchId },
      { 'blockchainRecord.status': resultJson.overallResult === 'PASS' ? 'LAB_PASSED' : 'LAB_FAILED' }
    );

    successResponse(res, report, 'Lab report uploaded and anchored to blockchain');
  } catch (err) {
    errorResponse(res, 500, err.message);
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
          _id: '$herb.herbSpecies.common',
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

    const trendData = trendStats.map(s => ({
      date: s._id,
      count: s.count
    }));

    successResponse(res, {
      qualityData,
      passFailData,
      trendData
    });
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};
