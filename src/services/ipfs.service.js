const axios = require('axios');
const FormData = require('form-data');
const ipfsConfig = require('../config/ipfs');
const logger = require('../utils/logger.util');

class IPFSService {
  async uploadFile(buffer, fileName, mimeType) {
    try {
      const form = new FormData();
      form.append('file', buffer, {
        filename: fileName,
        contentType: mimeType
      });
      form.append('pinataMetadata', JSON.stringify({ name: fileName }));
      form.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        form,
        {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${ipfsConfig.pinataJwt}`
          },
          maxContentLength: Infinity
        }
      );

      return {
        cid: response.data.IpfsHash,
        url: `${ipfsConfig.gateway}/ipfs/${response.data.IpfsHash}`,
        size: response.data.PinSize
      };
    } catch (err) {
      logger.error('IPFS upload failed:', err.response?.data || err.message);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  async uploadFolder(files) {
    if (!ipfsConfig.pinataJwt || ipfsConfig.pinataJwt.length < 50) {
      logger.warn('IPFS Configuration Missing: Using development mock CID');
      return 'QmSimulationModeActiveNoRealPinningDone';
    }

    try {
      const pinnedFiles = [];
      
      // Pin each file individually for maximum reliability
      for (const file of files) {
        try {
          const result = await this.uploadFile(file.buffer, file.name, file.type);
          pinnedFiles.push({ 
            name: file.name, 
            cid: result.cid,
            url: result.url 
          });
        } catch (pinErr) {
          logger.error(`Individual file pin failed: ${file.name}`, pinErr);
          // Continue with others if one fails, or could throw
        }
      }

      if (pinnedFiles.length === 0) throw new Error('No files were successfully pinned to IPFS');

      // Create a JSON manifest to represent the "folder"
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          pinataMetadata: { 
            name: `botaniledger-manifest-${Date.now()}` 
          },
          pinataContent: {
            type: 'batch_collection',
            timestamp: new Date(),
            files: pinnedFiles
          }
        },
        {
          headers: {
            Authorization: `Bearer ${ipfsConfig.pinataJwt}`
          }
        }
      );
      
      return response.data.IpfsHash;
    } catch (err) {
      const errorDetail = err.response?.data || err.message;
      logger.error('IPFS Manifest creation failed:', errorDetail);

      if (err.response?.status === 401) {
        logger.warn('Pinata 401 Unauthorized: Falling back to mock CID for development');
        return 'QmAuthFailedUsingMockCID';
      }

      throw new Error(`IPFS Manifest Failed: ${JSON.stringify(errorDetail)}`);
    }
  }

  async retrieve(cid) {
    const gateways = [ipfsConfig.gateway, ...ipfsConfig.fallbacks];

    for (const gateway of gateways) {
      try {
        const url = `${gateway}/ipfs/${cid}`;
        const response = await axios.get(url, { timeout: 5000 });
        return { data: response.data, url, gateway };
      } catch (err) {
        continue;
      }
    }
    throw new Error(`Cannot retrieve CID ${cid} from any gateway`);
  }
}

module.exports = new IPFSService();
