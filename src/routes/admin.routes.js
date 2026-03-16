const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard-stats', adminController.getStats);
router.get('/anomaly-alerts', adminController.getAnomalies);
router.put('/anomaly-alerts/:id', adminController.resolveAnomaly);

router.get('/pending-users', adminController.getPendingUsers);
router.post('/verify-user/:userId', adminController.verifyUser);

module.exports = router;
