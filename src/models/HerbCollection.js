const mongoose = require('mongoose');

const HerbCollectionSchema = new mongoose.Schema({
  batchId: { 
    type: String, 
    unique: true,
    default: () => `BL-${new Date().getFullYear()}-${
      Math.random().toString(36).substr(2,5).toUpperCase()
    }`
  },
  farmerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  herbSpecies: {
    common: { type: String, required: true },
    botanical: String,
    code: String
  },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  collectionDate: { type: Date, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],      // [longitude, latitude]
    accuracy: Number,
    address: String,
    zone: String
  },
  photos: {
    macro: { cid: String, url: String },
    texture: { cid: String, url: String },
    bulk: { cid: String, url: String },
    packaging: { cid: String, url: String },
    context: { cid: String, url: String },
    ipfsFolderCid: String       // CID of entire folder
  },
  aiVerification: {
    speciesMatch: Boolean,
    confidence: Number,
    matchedSpecies: String,
    purityScore: Number,
    qualityGrade: String,
    moistureLevel: Number,
    inferenceTimestamp: Date,
    modelVersion: String
  },
  blockchainRecord: {
    txId: String,
    blockNumber: Number,
    timestamp: Date,
    status: {
      type: String,
      enum: [
        'PENDING',
        'LAB_TESTING', 
        'LAB_PASSED',
        'LAB_FAILED',
        'IN_TRANSIT',
        'RECEIVED',
        'PENDING_QC_REVIEW',
        'MANUFACTURER_APPROVED',
        'MANUFACTURER_REJECTED',
        'QR_GENERATED',
        'RECALLED'
      ],
      default: 'PENDING'
    }
  },
  syncStatus: {
    type: String,
    enum: ['synced', 'pending', 'failed'],
    default: 'pending'
  },
  notes: String,
  isAnomaly: { type: Boolean, default: false },
  anomalyType: String,
  onTimeDispatch: { type: Boolean, default: true },
  similarityScore: Number
}, {
  timestamps: true,
});

HerbCollectionSchema.index({ 'location': '2dsphere' });
HerbCollectionSchema.index({ 'farmerId': 1 });
HerbCollectionSchema.index({ 'blockchainRecord.status': 1 });
HerbCollectionSchema.index({ 'batchId': 1 }, { unique: true });

module.exports = mongoose.model('HerbCollection', HerbCollectionSchema);
