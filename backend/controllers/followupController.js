const db = require('../config/database');

// Get all follow-ups (with filters)
exports.getAllFollowups = async (req, res) => {
    try {
        const { salesperson_id, status, start_date, end_date } = req.query;

        let query = `
      SELECT f.*, 
             l.company_name, l.contact_person,
             u.full_name as salesperson_name
      FROM followups f
      JOIN leads l ON f.lead_id = l.id
      JOIN users u ON f.salesperson_id = u.id
      WHERE 1=1
    `;
        const params = [];

        if (salesperson_id) {
            query += ' AND f.salesperson_id = ?';
            params.push(salesperson_id);
        }
        if (status) {
            query += ' AND f.status = ?';
            params.push(status);
        }
        if (start_date) {
            query += ' AND f.scheduled_date >= ?';
            params.push(start_date);
        }
        if (end_date) {
            query += ' AND f.scheduled_date <= ?';
            params.push(end_date);
        }

        query += ' ORDER BY f.scheduled_date ASC';

        const [followups] = await db.query(query, params);
        res.json({ followups });
    } catch (error) {
        console.error('Get all followups error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get follow-ups for salesperson
exports.getMyFollowups = async (req, res) => {
    try {
        const salespersonId = req.user.id;
        const { status } = req.query;

        let query = `
      SELECT f.*, 
             l.company_name, l.contact_person
      FROM followups f
      JOIN leads l ON f.lead_id = l.id
      WHERE f.salesperson_id = ?
    `;
        const params = [salespersonId];

        if (status) {
            query += ' AND f.status = ?';
            params.push(status);
        }

        query += ' ORDER BY f.scheduled_date ASC';

        const [followups] = await db.query(query, params);
        res.json({ followups });
    } catch (error) {
        console.error('Get my followups error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get follow-ups for a lead
exports.getLeadFollowups = async (req, res) => {
    try {
        const { leadId } = req.params;

        const [followups] = await db.query(
            `SELECT f.*, u.full_name as salesperson_name
       FROM followups f
       JOIN users u ON f.salesperson_id = u.id
       WHERE f.lead_id = ?
       ORDER BY f.scheduled_date DESC`,
            [leadId]
        );

        res.json({ followups });
    } catch (error) {
        console.error('Get lead followups error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create follow-up
exports.createFollowup = async (req, res) => {
    try {
        const { lead_id, call_id, scheduled_date, notes } = req.body;
        const salesperson_id = req.user.id;

        // Check if lead exists
        const [leads] = await db.query('SELECT id FROM leads WHERE id = ?', [lead_id]);
        if (leads.length === 0) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        const [result] = await db.query(
            `INSERT INTO followups (lead_id, call_id, salesperson_id, scheduled_date, notes)
       VALUES (?, ?, ?, ?, ?)`,
            [lead_id, call_id, salesperson_id, scheduled_date, notes]
        );

        const [newFollowup] = await db.query(
            `SELECT f.*, 
              l.company_name, l.contact_person,
              u.full_name as salesperson_name
       FROM followups f
       JOIN leads l ON f.lead_id = l.id
       JOIN users u ON f.salesperson_id = u.id
       WHERE f.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            message: 'Follow-up scheduled successfully',
            followup: newFollowup[0]
        });
    } catch (error) {
        console.error('Create followup error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update follow-up
exports.updateFollowup = async (req, res) => {
    try {
        const { id } = req.params;
        const { scheduled_date, notes, status } = req.body;

        const [existing] = await db.query('SELECT id FROM followups WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Follow-up not found' });
        }

        await db.query(
            'UPDATE followups SET scheduled_date = ?, notes = ?, status = ? WHERE id = ?',
            [scheduled_date, notes, status, id]
        );

        const [updatedFollowup] = await db.query(
            `SELECT f.*, 
              l.company_name, l.contact_person,
              u.full_name as salesperson_name
       FROM followups f
       JOIN leads l ON f.lead_id = l.id
       JOIN users u ON f.salesperson_id = u.id
       WHERE f.id = ?`,
            [id]
        );

        res.json({
            message: 'Follow-up updated successfully',
            followup: updatedFollowup[0]
        });
    } catch (error) {
        console.error('Update followup error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Complete follow-up
exports.completeFollowup = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const [existing] = await db.query('SELECT id FROM followups WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Follow-up not found' });
        }

        await db.query(
            'UPDATE followups SET status = ?, completed_date = NOW(), notes = ? WHERE id = ?',
            ['completed', notes, id]
        );

        const [updatedFollowup] = await db.query(
            `SELECT f.*, 
              l.company_name, l.contact_person,
              u.full_name as salesperson_name
       FROM followups f
       JOIN leads l ON f.lead_id = l.id
       JOIN users u ON f.salesperson_id = u.id
       WHERE f.id = ?`,
            [id]
        );

        res.json({
            message: 'Follow-up marked as completed',
            followup: updatedFollowup[0]
        });
    } catch (error) {
        console.error('Complete followup error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete follow-up
exports.deleteFollowup = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT id FROM followups WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Follow-up not found' });
        }

        await db.query('DELETE FROM followups WHERE id = ?', [id]);

        res.json({ message: 'Follow-up deleted successfully' });
    } catch (error) {
        console.error('Delete followup error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Mark missed follow-ups
exports.markMissedFollowups = async (req, res) => {
    try {
        await db.query(
            `UPDATE followups 
       SET status = 'missed' 
       WHERE status = 'pending' AND scheduled_date < NOW()`
        );

        res.json({ message: 'Missed follow-ups updated' });
    } catch (error) {
        console.error('Mark missed followups error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
