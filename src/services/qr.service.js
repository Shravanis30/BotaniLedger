const QRCode = require('qrcode');
const { generateHMAC } = require('../utils/crypto.util');

class QRService {
  async generateProductQR(productBatchId) {
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

    return {
      data: qrData,
      url: signedUrl,
      signature
    };
  }
}

module.exports = new QRService();
