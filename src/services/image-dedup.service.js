const crypto = require('crypto');
const ImageAsset = require('../models/ImageAsset');

class ImageDedupService {
  createHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  async findDuplicate(fileEntries) {
    if (!fileEntries.length) return null;
    const hashes = fileEntries.map((entry) => entry.imageHash);
    const existing = await ImageAsset.findOne({ imageHash: { $in: hashes } }).lean();
    if (!existing) return null;

    return {
      imageHash: existing.imageHash,
      batchId: existing.batchId,
      fileName: existing.fileName,
      fileRole: existing.fileRole,
      createdAt: existing.createdAt
    };
  }

  async saveMetadata(fileEntries, context) {
    if (!fileEntries.length) return;

    const docs = fileEntries.map((entry) => ({
      imageHash: entry.imageHash,
      ipfsFolderCid: context.ipfsFolderCid,
      fileName: entry.originalname,
      mimeType: entry.mimetype,
      fileSize: entry.size,
      fileRole: entry.role,
      species: context.species,
      batchId: context.batchId,
      farmerId: context.farmerId
    }));

    await ImageAsset.insertMany(docs, { ordered: false });
  }
}

module.exports = new ImageDedupService();
