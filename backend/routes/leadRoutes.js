const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const leadController = require('../controllers/leadController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Multer configuration for CSV upload
const upload = multer({ dest: 'uploads/' });

// Validation rules
const createLeadValidation = [
    body('company_name').trim().notEmpty(),
    body('contact_person').trim().notEmpty(),
    body('phone').trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('priority').optional().isIn(['low', 'medium', 'high'])
];

const updateLeadValidation = [
    body('company_name').trim().notEmpty(),
    body('contact_person').trim().notEmpty(),
    body('phone').trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('status').optional().isIn(['new', 'contacted', 'qualified', 'converted', 'lost', 'follow_up']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
];

// Routes
router.get('/', auth, leadController.getAllLeads);
router.get('/my-leads', auth, authorize('salesperson'), leadController.getMyLeads);
router.get('/:id', auth, leadController.getLead);
router.post('/', auth, authorize('manager', 'admin'), createLeadValidation, validate, leadController.createLead);
router.put('/:id', auth, authorize('manager', 'admin'), updateLeadValidation, validate, leadController.updateLead);
router.patch('/:id/assign', auth, authorize('manager', 'admin'), leadController.assignLead);
router.delete('/:id', auth, authorize('manager', 'admin'), leadController.deleteLead);
router.post('/upload-csv', auth, authorize('manager', 'admin'), upload.single('file'), leadController.uploadLeadsCSV);

module.exports = router;
