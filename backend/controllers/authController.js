const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            full_name: user.full_name
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Register new user (Admin only)
exports.register = async (req, res) => {
    try {
        const { email, password, full_name, role_id } = req.body;

        // Check if user already exists
        const [existingUser] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (email, password, full_name, role_id) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, full_name, role_id]
        );

        // Get created user with role
        const [newUser] = await db.query(
            `SELECT u.id, u.email, u.full_name, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            message: 'User created successfully',
            user: newUser[0]
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user with role
        const [users] = await db.query(
            `SELECT u.id, u.email, u.password, u.full_name, u.is_active, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Check if user is active
        if (!user.is_active) {
            return res.status(403).json({ error: 'Account is deactivated' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        // Remove password from response
        delete user.password;

        res.json({
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT u.id, u.email, u.full_name, u.is_active, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: users[0] });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
