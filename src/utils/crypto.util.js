const crypto = require('crypto');

const hash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

const generateHMAC = (data, secret) => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
};

const verifyHMAC = (data, hmac, secret) => {
  const generated = generateHMAC(data, secret);
  return crypto.timingSafeEqual(Buffer.from(generated), Buffer.from(hmac));
};

module.exports = {
  hash,
  generateHMAC,
  verifyHMAC
};
