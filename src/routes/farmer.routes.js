const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmer.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const upload = require('../middleware/upload.middleware');
const { auditLog } = require('../middleware/audit.middleware');

router.use(protect);
router.use(authorize('farmer'));

router.post('/collection',
  upload.fields([
    { name: 'macro', maxCount: 1 },
    { name: 'texture', maxCount: 1 },
    { name: 'bulk', maxCount: 1 },
    { name: 'packaging', maxCount: 1 },
    { name: 'context', maxCount: 1 }
  ]),
  auditLog('CREATE_COLLECTION', 'HerbCollection'),
  farmerController.createCollection
);

router.get('/batches', farmerController.getBatches);
router.post('/dispatch/:batchId', auditLog('DISPATCH_BATCH', 'HerbCollection'), farmerController.dispatchBatch);

module.exports = router;
