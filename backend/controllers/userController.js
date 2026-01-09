const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT u.id, u.email, u.full_name, u.is_active, u.created_at, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       ORDER BY u.created_at DESC`
        );

        res.json({ users });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get salespeople (Manager only)
exports.getSalespeople = async (req, res) => {
    try {
        const [salespeople] = await db.query(
            `SELECT u.id, u.email, u.full_name, u.is_active 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE r.name = 'salesperson' AND u.is_active = TRUE
       ORDER BY u.full_name`
        );

        res.json({ salespeople });
    } catch (error) {
        console.error('Get salespeople error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create user (Admin only)
exports.createUser = async (req, res) => {
    try {
        const { email, password, full_name, role_id } = req.body;

        // Check if user exists
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (email, password, full_name, role_id) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, full_name, role_id]
        );

        // Get created user
        const [newUser] = await db.query(
            `SELECT u.id, u.email, u.full_name, u.is_active, r.name as role 
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
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, full_name, role_id, is_active } = req.body;

        // Check if user exists
        const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user
        await db.query(
            'UPDATE users SET email = ?, full_name = ?, role_id = ?, is_active = ? WHERE id = ?',
            [email, full_name, role_id, is_active, id]
        );

        // Get updated user
        const [updatedUser] = await db.query(
            `SELECT u.id, u.email, u.full_name, u.is_active, r.name as role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
            [id]
        );

        res.json({
            message: 'User updated successfully',
            user: updatedUser[0]
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Soft delete - deactivate user
        await db.query('UPDATE users SET is_active = FALSE WHERE id = ?', [id]);

        res.json({ message: 'User deactivated successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get roles
exports.getRoles = async (req, res) => {
    try {
        const [roles] = await db.query('SELECT * FROM roles ORDER BY id');
        res.json({ roles });
    } catch (error) {
        console.error('Get roles error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
