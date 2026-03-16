const path = require('path');

module.exports = {
  channelName: process.env.FABRIC_CHANNEL || 'default-channel',
  chaincodeName: process.env.FABRIC_CHAINCODE || 'botanyledger',
  connectionProfiles: {
    'u1hpn7jii5': path.resolve(__dirname, '../../blockchain/network/connection-profiles/kaleido-connection.json'),
    // Mapping legacy names for compatibility
    'FarmerOrgMSP': path.resolve(__dirname, '../../blockchain/network/connection-profiles/kaleido-connection.json'),
    'LabOrgMSP': path.resolve(__dirname, '../../blockchain/network/connection-profiles/kaleido-connection.json'),
    'ManufacturerOrgMSP': path.resolve(__dirname, '../../blockchain/network/connection-profiles/kaleido-connection.json'),
  }
};


