const express = require('express');
const router = express.Router();
const manufacturerController = require('../controllers/manufacturer.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const upload = require('../middleware/upload.middleware');
const { auditLog } = require('../middleware/audit.middleware');

router.use(protect);
router.use(authorize('manufacturer'));

router.post('/receipt/:batchId', auditLog('CONFIRM_RECEIPT', 'HerbCollection'), manufacturerController.confirmReceipt);
router.post('/similarity-check', 
  upload.array('arrivalPhotos', 5), 
  auditLog('SIMILARITY_CHECK', 'HerbCollection'),
  manufacturerController.similarityCheck
);
router.post('/product-batch', auditLog('CREATE_PRODUCT_BATCH', 'ProductBatch'), manufacturerController.createProductBatch);

module.exports = router;
