const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verify.controller');

// Public routes
router.get('/:productBatchId', verifyController.verifyProduct);

module.exports = router;
