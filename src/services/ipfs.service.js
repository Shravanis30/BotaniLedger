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
    try {
      const form = new FormData();
      files.forEach(({ buffer, name, type }) => {
        form.append('file', buffer, {
          filename: `botanyledger/${name}`,
          contentType: type
        });
      });
      form.append('pinataMetadata', JSON.stringify({ 
        name: `batch-photos-${Date.now()}` 
      }));

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        form,
        {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${ipfsConfig.pinataJwt}`
          }
        }
      );
      return response.data.IpfsHash;
    } catch (err) {
      logger.error('IPFS folder upload failed:', err.response?.data || err.message);
      throw new Error('Failed to upload folder to IPFS');
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
