const mongoose = require('mongoose');

const ProductBatchSchema = new mongoose.Schema({
  productBatchId: {
    type: String,
    unique: true,
    default: () => `BP-${new Date().getFullYear()}-${
      Math.random().toString(36).substr(2,5).toUpperCase()
    }`
  },
  manufacturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productName: { type: String, required: true },
  productType: {
    type: String,
    enum: ['tablet', 'capsule', 'oil', 'powder', 'extract', 'syrup', 'HERBAL_SUPPLEMENT'],
    required: true
  },
  linkedHerbBatches: [{
    batchId: String,
    quantity: Number,
    unit: String,
    similarityScore: Number
  }],
  manufacturingDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  quantity: { type: Number, required: true },
  qrCode: {
    data: String,            // QR code image base64
    url: String,             // /verify/:productBatchId
    generatedAt: Date,
    signature: String        // HMAC signature
  },
  integrityChecks: {
    allBatchesLabPassed: Boolean,
    allSimilarityPassed: Boolean,
    allHandoversComplete: Boolean,
    checkedAt: Date
  },
  blockchainRecord: {
    txId: String,
    blockNumber: Number,
    timestamp: Date,
    status: {
      type: String,
      enum: ['ACTIVE', 'RECALLED'],
      default: 'ACTIVE'
    }
  },
  recallInfo: {
    isRecalled: { type: Boolean, default: false },
    recalledAt: Date,
    recalledBy: String,
    reason: String
  }
}, { timestamps: true });

module.exports = mongoose.model('ProductBatch', ProductBatchSchema);
