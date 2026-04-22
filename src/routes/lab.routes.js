const express = require('express');
const router = express.Router();
const labController = require('../controllers/lab.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const upload = require('../middleware/upload.middleware');
const { auditLog } = require('../middleware/audit.middleware');

router.use(protect);
router.get('/certificates', authorize('lab', 'admin', 'farmer'), labController.getCertificates);

router.use(authorize('lab'));
router.get('/pending', labController.getPending);
router.get('/analytics', labController.getAnalytics);
router.put('/start-testing/:batchId', auditLog('START_TESTING', 'LabReport'), labController.startTesting);
router.post('/report',
  upload.single('report'),
  auditLog('UPLOAD_REPORT', 'LabReport'),
  labController.uploadReport
);

module.exports = router;
