const mongoose = require('mongoose');

const LabReportSchema = new mongoose.Schema({
  batchId: { type: String, required: true }, // The human-readable ID
  labId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  referenceNumber: { type: String, required: true },
  testDate: { type: Date, required: true },
  results: {
    overallResult: { 
      type: String, 
      enum: ['PASS', 'FAIL'], 
      required: true 
    },
    activeIngredient: {
      measured: { type: Number, default: 0 },
      expectedMin: { type: Number, default: 0 },
      expectedMax: { type: Number, default: 0 },
      unit: String,
      status: String
    },
    heavyMetals: {
      lead: { measured: { type: Number, default: 0 }, limit: { type: Number, default: 0 }, status: String },
      mercury: { measured: { type: Number, default: 0 }, limit: { type: Number, default: 0 }, status: String },
      arsenic: { measured: { type: Number, default: 0 }, limit: { type: Number, default: 0 }, status: String },
      cadmium: { measured: { type: Number, default: 0 }, limit: { type: Number, default: 0 }, status: String }
    },
    physicochemical: {
      ashContent: { 
        total: { type: Number, default: 0 }, 
        acidInsoluble: { type: Number, default: 0 },
        status: String
      },
      extractiveValues: {
        alcoholSoluble: { type: Number, default: 0 },
        waterSoluble: { type: Number, default: 0 },
        status: String
      },
      moisture: { value: { type: Number, default: 0 }, limit: { type: Number, default: 0 }, status: String }
    },
    organoleptic: {
      appearance: String,
      color: String,
      odor: String
    },
    pesticides: {
      detected: [String],
      totalResidues: { type: Number, default: 0 },
      status: String
    },
    microbiology: {
      totalPlateCount: { type: Number, default: 0 },
      yeastAndMould: { type: Number, default: 0 },
      ecoli: String,
      salmonella: String,
      status: String
    },
    verificationStatus: mongoose.Schema.Types.Mixed // For storing botanical image verification
  },
  document: {
    ipfsCid: String,
    ipfsUrl: String,
    fileName: String,
    fileSize: Number,
    uploadedAt: Date
  },
  blockchainRecord: {
    txId: String,
    blockNumber: Number,
    timestamp: Date
  },
  validUntil: Date,           // Certificate expiry (e.g. 90 days)
  notes: String
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for populating batch info via string batchId
LabReportSchema.virtual('batch', {
  ref: 'HerbCollection',
  localField: 'batchId',
  foreignField: 'batchId',
  justOne: true
});

module.exports = mongoose.model('LabReport', LabReportSchema);
