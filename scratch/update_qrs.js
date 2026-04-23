require('dotenv').config();
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const { generateHMAC } = require('../src/utils/crypto.util');
const ProductBatch = require('../src/models/ProductBatch');

async function updateQRs() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const batches = await ProductBatch.find({ 'qrCode.url': { $exists: true } });
    console.log(`Found ${batches.length} batches to update.`);

    for (const batch of batches) {
      console.log(`Updating batch: ${batch.productBatchId}`);
      
      const productBatchId = batch.productBatchId;
      const url = `${process.env.QR_BASE_URL}/${productBatchId}`;
      const signature = generateHMAC(productBatchId, process.env.QR_SECRET);
      const signedUrl = `${url}?sig=${signature}`;

      const qrData = await QRCode.toDataURL(signedUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      batch.qrCode = {
        data: qrData,
        url: signedUrl,
        generatedAt: new Date(),
        signature: signature
      };

      await batch.save();
      console.log(`Successfully updated batch: ${productBatchId}`);
    }

    console.log('Finished updating all batches.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating QRs:', error);
    process.exit(1);
  }
}

updateQRs();
