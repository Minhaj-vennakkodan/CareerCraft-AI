const express = require('express');
const { logDownload, getDashboardStats, getChartData } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/download', protect, logDownload);
router.get('/stats', protect, getDashboardStats);
router.get('/charts', protect, getChartData);

module.exports = router;
