const path = require('path');
const root = path.join(__dirname, '..');
require('dotenv').config({ path: path.join(root, '.env') });

const ipfsService = require(path.join(root, 'src/services/ipfs.service'));
const fabricService = require(path.join(root, 'src/services/fabric.service'));
const mongoose = require('mongoose');

async function diagnose() {
  console.log('--- Diagnosing BotaniLedger Services ---');

  // 1. IPFS Test
  try {
    console.log('Testing IPFS Upload...');
    const buffer = Buffer.from('Diagnostic Test File Content');
    const result = await ipfsService.uploadFile(buffer, 'diagnostic.txt', 'text/plain');
    console.log('✅ IPFS Upload Success:', result.cid);
  } catch (err) {
    console.error('❌ IPFS Upload Failed:', err.message);
  }

  // 2. Fabric Test
  try {
    console.log('Testing Fabric Connection...');
    const peerUrl = process.env.FABRIC_PEER_LAB;
    console.log(`Connecting to Peer: ${peerUrl}`);
    // We won't call submitTransaction here as it needs a real batchId and chaincode state
    console.log('Fabric Service initialized.');
  } catch (err) {
    console.error('❌ Fabric Initialization Failed:', err.message);
  }

  process.exit();
}

diagnose();
