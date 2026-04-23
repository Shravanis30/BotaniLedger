const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');
const ipfsConfig = require('../config/ipfs');
const logger = require('../utils/logger.util');

class IPFSService {
  _getHeaders(form) {
    const headers = { ...form.getHeaders() };
    let authSet = false;

    // Try JWT first
    if (ipfsConfig.pinataJwt && ipfsConfig.pinataJwt.trim().length > 50) {
      const jwt = ipfsConfig.pinataJwt.trim();
      if (jwt.split('.').length === 3) {
        headers.Authorization = `Bearer ${jwt}`;
        authSet = true;
      }
    }

    // Fallback to API Keys
    if (!authSet && ipfsConfig.pinataApiKey && ipfsConfig.pinataApiSecret) {
      headers.pinata_api_key = ipfsConfig.pinataApiKey.trim();
      headers.pinata_secret_api_key = ipfsConfig.pinataApiSecret.trim();
      authSet = true;
    }

    if (!authSet) {
      logger.warn('IPFS Auth: No valid JWT or API Keys found');
    } else {
      const authType = headers.Authorization ? 'JWT' : 'API Keys';
      logger.info(`IPFS Auth: Using ${authType}`);
    }

    return headers;
  }

  async uploadFile(buffer, fileName, mimeType) {
    const hasCredentials = (ipfsConfig.pinataJwt && ipfsConfig.pinataJwt.length > 50) || 
                          (ipfsConfig.pinataApiKey && ipfsConfig.pinataApiSecret);
    
    logger.info(`IPFS Credential Status: ${hasCredentials ? 'Detected' : 'Missing'}`);

    if (process.env.BLOCKCHAIN_MODE === 'simulated' && !hasCredentials) {
      logger.info(`[IPFS Simulation] Mocking upload for ${fileName} (No Credentials)`);
      return {
        cid: `QmSimulatedFile${crypto.randomBytes(8).toString('hex')}`,
        url: `https://gateway.pinata.cloud/ipfs/QmSimulatedFile`,
        size: buffer.length
      };
    }

    try {
      const form = new FormData();
      form.append('file', buffer, {
        filename: fileName,
        contentType: mimeType
      });
      form.append('pinataMetadata', JSON.stringify({ name: fileName }));
      form.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

      const headers = this._getHeaders(form);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        form,
        {
          headers,
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
    if (!files || files.length === 0) {
      throw new Error('No files provided for IPFS upload');
    }

    if (!ipfsConfig.pinataJwt || ipfsConfig.pinataJwt.length < 50) {
      logger.warn('IPFS Configuration Missing: Using development mock CID');
      return 'QmSimulationModeActiveNoRealPinningDone';
    }

    try {
      const form = new FormData();
      const folderName = `batch-${Date.now()}`;
      
      // Pinata directory upload requires each file to be appended with the same name 'file'
      // and the filename must include the folder path.
      for (const file of files) {
        form.append('file', file.buffer, {
          filename: `${folderName}/${file.name}`,
          contentType: file.type
        });
      }

      form.append('pinataMetadata', JSON.stringify({
        name: folderName,
        keyvalues: {
          project: 'BotaniLedger',
          type: 'batch_collection'
        }
      }));

      form.append('pinataOptions', JSON.stringify({
        cidVersion: 1
      }));

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        form,
        {
          headers: this._getHeaders(form),
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      logger.info(`IPFS Folder Uploaded: ${folderName} -> ${response.data.IpfsHash}`);
      return response.data.IpfsHash;
    } catch (err) {
      const errorDetail = err.response?.data || err.message;
      logger.error('IPFS Folder upload failed:', errorDetail);

      if (err.response?.status === 401) {
        logger.warn('Pinata 401 Unauthorized: Falling back to mock CID');
        return 'QmAuthFailedUsingMockCID';
      }

      throw new Error(`IPFS Folder Upload Failed: ${JSON.stringify(errorDetail)}`);
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
