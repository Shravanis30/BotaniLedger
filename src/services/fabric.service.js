const { connect, signers } = require('@hyperledger/fabric-gateway');
const grpc = require('@grpc/grpc-js');
const crypto = require('crypto');
const fs = require('fs');
const fabricConfig = require('../config/fabric');
const logger = require('../utils/logger.util');

class FabricService {
  constructor() {
    this.client = null;
    this.gateway = null;
    this.contract = null;
  }

  async connect(identity) {
    try {
      const profilePath = fabricConfig.connectionProfiles[identity.mspId] || fabricConfig.connectionProfiles['u1hpn7jii5'];
      const connectionProfile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
      const peerName = connectionProfile.organizations[identity.mspId]?.peers[0] || 'LabNode';
      const peer = connectionProfile.peers[peerName];

      // Create gRPC client with Kaleido Basic Auth
      const authHeader = Buffer.from(process.env.FABRIC_AUTH).toString('base64');
      const credentials = grpc.credentials.createSsl(fs.readFileSync(peer.tlsCACerts.path));
      
      this.client = new grpc.Client(peer.url.replace('grpcs://', ''), credentials, {
        'grpc.ssl_target_name_override': peer.grpcOptions['ssl-target-name-override'],
        'grpc.default_authority': peer.grpcOptions['ssl-target-name-override']
      });

      // Prepare Identity and Signer for the Gateway
      const gatewayIdentity = {
        mspId: identity.mspId,
        credentials: Buffer.from(identity.certificate),
      };

      const signer = signers.newPrivateKeySigner(crypto.createPrivateKey(identity.privateKey));

      // Connect to the gateway
      this.gateway = connect({
        client: this.client,
        identity: gatewayIdentity,
        signer,
        interceptors: [
          (options, nextCall) => {
            return new grpc.InterceptingCall(nextCall(options), {
              start: (metadata, listener, next) => {
                metadata.add('authorization', `Basic ${authHeader}`);
                next(metadata, listener);
              }
            });
          }
        ]
      });

      const network = this.gateway.getNetwork(fabricConfig.channelName);
      this.contract = network.getContract(fabricConfig.chaincodeName);
      
      return this.contract;
    } catch (err) {
      logger.error('Fabric connection failed:', err);
      throw err;
    }
  }

  async submitTransaction(identity, fnName, ...args) {
    const contract = await this.connect(identity);
    try {
      const result = await contract.submitTransaction(fnName, ...args);
      return JSON.parse(new TextDecoder().decode(result));
    } finally {
      if (this.gateway) {
        this.gateway.close();
      }
      if (this.client) {
        this.client.close();
      }
    }
  }

  async evaluateTransaction(identity, fnName, ...args) {
    const contract = await this.connect(identity);
    try {
      const result = await contract.evaluateTransaction(fnName, ...args);
      return JSON.parse(new TextDecoder().decode(result));
    } finally {
      if (this.gateway) {
        this.gateway.close();
      }
      if (this.client) {
        this.client.close();
      }
    }
  }
}

module.exports = new FabricService();


// update on 2026-03-15 - refactor: optimize backend performance
// update on 2026-03-16 - feat: optimize blockchain interaction
// update on 2026-03-17 - docs: update API documentation
// update on 2026-03-17 - docs: update API documentation
// update on 2026-03-20 - style: improve UI responsiveness
// update on 2026-03-20 - feat: enhance authentication flow
// update on 2026-03-21 - style: improve UI responsiveness
// update on 2026-03-22 - fix: resolve API validation issue
// update on 2026-03-23 - feat: optimize blockchain interaction
// update on 2026-03-24 - docs: update API documentation
// update on 2026-03-24 - refactor: optimize backend performance
// update on 2026-03-26 - feat: update dashboard UI components
// update on 2026-03-27 - feat: enhance authentication flow
// update on 2026-04-02 - feat: optimize blockchain interaction
// update on 2026-04-08 - fix: resolve API validation issue
// update on 2026-04-08 - refactor: improve code structure
// update on 2026-04-09 - refactor: optimize backend performance
// update on 2026-04-09 - fix: correct edge case in service logic
// update on 2026-03-18 - refactor: improve code structure
// update on 2026-03-19 - feat: enhance authentication flow
// update on 2026-03-21 - feat: improve farmer batch handling
