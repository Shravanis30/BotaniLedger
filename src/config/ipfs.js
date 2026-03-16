module.exports = {
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataApiSecret: process.env.PINATA_API_SECRET,
  pinataJwt: process.env.PINATA_JWT,
  gateway: process.env.PINATA_GATEWAY,
  fallbacks: [
    process.env.IPFS_FALLBACK_1,
    process.env.IPFS_FALLBACK_2,
    process.env.IPFS_FALLBACK_3
  ].filter(Boolean)
};
