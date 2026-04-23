const mongoose = require('mongoose');

const ImageAssetSchema = new mongoose.Schema(
  {
    imageHash: { type: String, required: true, unique: true, index: true },
    ipfsFolderCid: { type: String },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileRole: {
      type: String,
      enum: ['macro', 'texture', 'bulk', 'packaging', 'context'],
      required: true
    },
    species: { type: String, enum: ['ashwagandha', 'tulsi'], required: true },
    batchId: { type: String, required: true, index: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ImageAsset', ImageAssetSchema);
