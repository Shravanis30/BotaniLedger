const axios = require('axios');
const logger = require('../utils/logger.util');

class AIService {
  async verifySpecies(photoBuffer, expectedSpecies) {
    try {
      const FormData = require('form-data');
      const form = new FormData();
      form.append('photo', photoBuffer, { filename: 'herb_macro.jpg' });
      form.append('species', expectedSpecies);

      const response = await axios.post(`${process.env.AI_SERVICE_URL}/verify-species`, form, {
        headers: form.getHeaders()
      });

      return response.data;
    } catch (err) {
      logger.error('AI Species verification failed:', err.message);
      // Fallback to safe failure if AI node is down
      return { speciesMatch: false, confidence: 0, matchedSpecies: 'unknown' };
    }
  }

  async calculateSimilarity(photoCidsA, photoCidsB) {
    try {
      // Mocking similarity check between collection and arrival photos
      return {
        overallScore: 94.2,
        photoScores: [95.1, 93.4, 94.1]
      };
    } catch (err) {
      logger.error('AI Similarity check failed:', err);
      return { overallScore: 0 };
    }
  }
}

module.exports = new AIService();
