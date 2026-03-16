const express = require('express');
const router = express.Router();
const regulatorController = require('../controllers/regulator.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

router.use(protect);
router.use(authorize('regulator', 'admin'));

router.get('/audit-trail', regulatorController.getAuditTrail);
router.get('/batch/:batchId/history', regulatorController.getBatchHistory);

module.exports = router;
