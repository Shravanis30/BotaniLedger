const { z } = require('zod');
const logger = require('../utils/logger.util');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  PINATA_JWT: z.string(),
  FABRIC_CHANNEL: z.string().default('botanyledger-channel'),
  FABRIC_CHAINCODE: z.string().default('botanyledger'),
  AI_SERVICE_URL: z.string().url().default('http://localhost:8000'),
});

const validateEnv = () => {
  try {
    envSchema.parse(process.env);
    logger.info('Environment variables validated successfully');
  } catch (err) {
    logger.error('Environment validation failed:', err.errors);
    process.exit(1);
  }
};

module.exports = { validateEnv };
