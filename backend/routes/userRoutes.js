const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation rules
const createUserValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').trim().notEmpty(),
    body('role_id').isInt()
];

const updateUserValidation = [
    body('email').isEmail().normalizeEmail(),
    body('full_name').trim().notEmpty(),
    body('role_id').isInt(),
    body('is_active').isBoolean()
];

// Routes
router.get('/', auth, authorize('admin', 'manager'), userController.getAllUsers);
router.get('/salespeople', auth, authorize('manager', 'admin'), userController.getSalespeople);
router.get('/roles', auth, userController.getRoles);
router.post('/', auth, authorize('admin'), createUserValidation, validate, userController.createUser);
router.put('/:id', auth, authorize('admin'), updateUserValidation, validate, userController.updateUser);
router.delete('/:id', auth, authorize('admin'), userController.deleteUser);

module.exports = router;
