const HerbCollection = require('../models/HerbCollection');
const LabReport = require('../models/LabReport');
const { calculateDistance } = require('../utils/geo.util');
const logger = require('../utils/logger.util');

class AnomalyService {
  async checkForAnomalies(batchData, farmerId) {
    const anomalies = [];

    // Check 1: Duplicate IPFS CID (same photos submitted twice)
    const duplicatePhoto = await HerbCollection.findOne({
      'photos.ipfsFolderCid': batchData.ipfsFolderCid,
      farmerId: { $ne: farmerId }
    });
    if (duplicatePhoto) {
      anomalies.push({
        type: 'DUPLICATE_PHOTO',
        severity: 'HIGH',
        description: `IPFS folder CID matches existing batch ${duplicatePhoto.batchId}`,
        metadata: { duplicateBatchId: duplicatePhoto.batchId }
      });
    }

    // Check 2: Geographic inconsistency
    const recentBatches = await HerbCollection.find({
      farmerId,
      createdAt: { $gte: new Date(Date.now() - 4 * 60 * 60 * 1000) }
    });

    for (const recent of recentBatches) {
      const distance = calculateDistance(
        batchData.location.coordinates,
        recent.location.coordinates
      );
      if (distance > 100) {  // 100km threshold
        anomalies.push({
          type: 'GEO_INCONSISTENCY',
          severity: 'CRITICAL',
          description: `Farmer registered batches ${distance.toFixed(0)}km apart within 4 hours`,
          metadata: {
            distance,
            previousBatchId: recent.batchId,
            previousLocation: recent.location.coordinates
          }
        });
      }
    }

    // Check 3: Rapid successive registrations
    const recentCount = await HerbCollection.countDocuments({
      farmerId,
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
    });
    if (recentCount > 10) {
      anomalies.push({
        type: 'SUSPICIOUS_PATTERN',
        severity: 'MEDIUM',
        description: `Farmer registered ${recentCount} batches in the last hour`,
        metadata: { count: recentCount }
      });
    }

    return anomalies;
  }

  async checkExpiredCertificate(herbBatchId) {
    const report = await LabReport.findOne({ batchId: herbBatchId });
    if (!report) return null;
    const isExpired = new Date(report.validUntil) < new Date();
    if (isExpired) {
      return {
        type: 'EXPIRED_CERTIFICATE',
        severity: 'HIGH',
        description: `Lab certificate for ${herbBatchId} expired on ${report.validUntil}`,
        metadata: { validUntil: report.validUntil }
      };
    }
    return null;
  }
}

module.exports = new AnomalyService();
