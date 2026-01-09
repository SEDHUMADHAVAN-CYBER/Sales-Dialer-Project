const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const callController = require('../controllers/callController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation rules
const startCallValidation = [
    body('lead_id').isInt()
];

const endCallValidation = [
    body('outcome').isIn(['no_answer', 'busy', 'voicemail', 'connected', 'interested', 'not_interested', 'callback', 'converted']),
    body('notes').optional().trim()
];

// Routes
router.get('/', auth, authorize('manager', 'admin'), callController.getAllCalls);
router.get('/my-calls', auth, authorize('salesperson'), callController.getMyCalls);
router.get('/lead/:leadId', auth, callController.getLeadCalls);
router.get('/stats', auth, callController.getCallStats);
router.post('/start', auth, authorize('salesperson'), startCallValidation, validate, callController.startCall);
router.patch('/:id/end', auth, authorize('salesperson'), endCallValidation, validate, callController.endCall);

module.exports = router;
