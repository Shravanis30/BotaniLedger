const HerbCollection = require('../models/HerbCollection');

class TrustService {
  async calculateTrustScore(stakeholderId, role) {
    let labPassRate = 0, avgSimilarity = 0, handoverRate = 0;

    if (role === 'farmer') {
      const batches = await HerbCollection.find({ farmerId: stakeholderId });
      
      const passed = batches.filter(
        b => b.blockchainRecord?.status === 'LAB_PASSED'
      ).length;
      labPassRate = batches.length > 0 
        ? (passed / batches.length) * 100 : 0;

      const similarities = batches
        .filter(b => b.similarityScore)
        .map(b => b.similarityScore);
      avgSimilarity = similarities.length > 0
        ? similarities.reduce((a, b) => a + b, 0) / similarities.length
        : 0;

      const dispatched = batches.filter(
        b => b.blockchainRecord?.status !== 'PENDING'
      ).length;
      const onTime = batches.filter(b => b.onTimeDispatch).length;
      handoverRate = dispatched > 0 
        ? (onTime / dispatched) * 100 : 0;
    }

    // Weighted formula: Lab 40% + Similarity 35% + Handover 25%
    const score = (
      (labPassRate * 0.40) +
      (avgSimilarity * 0.35) +
      (handoverRate * 0.25)
    );

    return {
      overall: Math.round(score),
      breakdown: {
        labPassRate: Math.round(labPassRate),
        avgSimilarity: Math.round(avgSimilarity),
        handoverRate: Math.round(handoverRate)
      },
      totalBatches: await HerbCollection.countDocuments({ farmerId: stakeholderId })
    };
  }
}

module.exports = new TrustService();
