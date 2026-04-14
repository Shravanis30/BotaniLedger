const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', adminController.getStats);
router.get('/anomalies', adminController.getAnomalies);
router.put('/anomalies/:id', adminController.resolveAnomaly);

router.get('/pending-users', adminController.getPendingUsers);
router.post('/verify/:userId', adminController.verifyUser);

router.get('/batches', adminController.getAllBatches);
router.get('/farmers', adminController.getAllUsers);

module.exports = router;
