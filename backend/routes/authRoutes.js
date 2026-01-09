const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation rules
const registerValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').trim().notEmpty(),
    body('role_id').isInt()
];

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

// Routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
