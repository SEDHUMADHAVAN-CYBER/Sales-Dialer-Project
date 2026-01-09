const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, authorize } = require('../middleware/auth');

// Routes
router.get('/overall', auth, authorize('manager', 'admin'), analyticsController.getOverallAnalytics);
router.get('/leaderboard', auth, authorize('manager', 'admin'), analyticsController.getSalespersonLeaderboard);
router.get('/performance', auth, authorize('salesperson'), analyticsController.getSalespersonPerformance);
router.get('/performance/:id', auth, authorize('manager', 'admin'), analyticsController.getSalespersonPerformance);
router.get('/export', auth, authorize('manager', 'admin'), analyticsController.exportReport);

module.exports = router;
