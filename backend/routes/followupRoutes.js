const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const followupController = require('../controllers/followupController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation rules
const createFollowupValidation = [
    body('lead_id').isInt(),
    body('call_id').optional().isInt(),
    body('scheduled_date').isISO8601(),
    body('notes').optional().trim()
];

const updateFollowupValidation = [
    body('scheduled_date').isISO8601(),
    body('status').optional().isIn(['pending', 'completed', 'missed']),
    body('notes').optional().trim()
];

// Routes
router.get('/', auth, authorize('manager', 'admin'), followupController.getAllFollowups);
router.get('/my-followups', auth, authorize('salesperson'), followupController.getMyFollowups);
router.get('/lead/:leadId', auth, followupController.getLeadFollowups);
router.post('/', auth, authorize('salesperson'), createFollowupValidation, validate, followupController.createFollowup);
router.put('/:id', auth, updateFollowupValidation, validate, followupController.updateFollowup);
router.patch('/:id/complete', auth, authorize('salesperson'), followupController.completeFollowup);
router.delete('/:id', auth, followupController.deleteFollowup);
router.post('/mark-missed', auth, authorize('manager', 'admin'), followupController.markMissedFollowups);

module.exports = router;
