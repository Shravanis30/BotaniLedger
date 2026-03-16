const mongoose = require('mongoose');

const LabReportSchema = new mongoose.Schema({
  batchId: { type: String, required: true, ref: 'HerbCollection' },
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
      measured: Number,
      expectedMin: Number,
      expectedMax: Number,
      unit: String,
      status: String
    },
    heavyMetals: {
      lead: { measured: Number, limit: Number, status: String },
      mercury: { measured: Number, limit: Number, status: String },
      arsenic: { measured: Number, limit: Number, status: String },
      cadmium: { measured: Number, limit: Number, status: String }
    },
    pesticides: {
      detected: [String],
      totalResidues: Number,
      status: String
    },
    microbiology: {
      totalPlateCount: Number,
      ecoli: String,
      salmonella: String,
      status: String
    },
    moisture: { value: Number, limit: Number, status: String }
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
}, { timestamps: true });

module.exports = mongoose.model('LabReport', LabReportSchema);
