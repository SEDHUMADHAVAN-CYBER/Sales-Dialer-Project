const db = require('../config/database');

// Get all calls (with filters)
exports.getAllCalls = async (req, res) => {
    try {
        const { salesperson_id, lead_id, outcome, start_date, end_date } = req.query;

        let query = `
      SELECT c.*, 
             l.company_name, l.contact_person,
             u.full_name as salesperson_name
      FROM calls c
      JOIN leads l ON c.lead_id = l.id
      JOIN users u ON c.salesperson_id = u.id
      WHERE 1=1
    `;
        const params = [];

        if (salesperson_id) {
            query += ' AND c.salesperson_id = ?';
            params.push(salesperson_id);
        }
        if (lead_id) {
            query += ' AND c.lead_id = ?';
            params.push(lead_id);
        }
        if (outcome) {
            query += ' AND c.outcome = ?';
            params.push(outcome);
        }
        if (start_date) {
            query += ' AND c.start_time >= ?';
            params.push(start_date);
        }
        if (end_date) {
            query += ' AND c.start_time <= ?';
            params.push(end_date);
        }

        query += ' ORDER BY c.start_time DESC';

        const [calls] = await db.query(query, params);
        res.json({ calls });
    } catch (error) {
        console.error('Get all calls error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get calls for salesperson
exports.getMyCalls = async (req, res) => {
    try {
        const salespersonId = req.user.id;
        const { outcome, start_date, end_date } = req.query;

        let query = `
      SELECT c.*, 
             l.company_name, l.contact_person
      FROM calls c
      JOIN leads l ON c.lead_id = l.id
      WHERE c.salesperson_id = ?
    `;
        const params = [salespersonId];

        if (outcome) {
            query += ' AND c.outcome = ?';
            params.push(outcome);
        }
        if (start_date) {
            query += ' AND c.start_time >= ?';
            params.push(start_date);
        }
        if (end_date) {
            query += ' AND c.start_time <= ?';
            params.push(end_date);
        }

        query += ' ORDER BY c.start_time DESC';

        const [calls] = await db.query(query, params);
        res.json({ calls });
    } catch (error) {
        console.error('Get my calls error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get calls for a specific lead
exports.getLeadCalls = async (req, res) => {
    try {
        const { leadId } = req.params;

        const [calls] = await db.query(
            `SELECT c.*, u.full_name as salesperson_name
       FROM calls c
       JOIN users u ON c.salesperson_id = u.id
       WHERE c.lead_id = ?
       ORDER BY c.start_time DESC`,
            [leadId]
        );

        res.json({ calls });
    } catch (error) {
        console.error('Get lead calls error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Start a call
exports.startCall = async (req, res) => {
    try {
        const { lead_id } = req.body;
        const salesperson_id = req.user.id;

        // Check if lead exists
        const [leads] = await db.query('SELECT id FROM leads WHERE id = ?', [lead_id]);
        if (leads.length === 0) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        // Create call record
        const [result] = await db.query(
            'INSERT INTO calls (lead_id, salesperson_id, start_time) VALUES (?, ?, NOW())',
            [lead_id, salesperson_id]
        );

        const [newCall] = await db.query(
            `SELECT c.*, 
              l.company_name, l.contact_person,
              u.full_name as salesperson_name
       FROM calls c
       JOIN leads l ON c.lead_id = l.id
       JOIN users u ON c.salesperson_id = u.id
       WHERE c.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            message: 'Call started',
            call: newCall[0]
        });
    } catch (error) {
        console.error('Start call error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// End a call
exports.endCall = async (req, res) => {
    try {
        const { id } = req.params;
        const { outcome, notes } = req.body;

        // Get call
        const [calls] = await db.query('SELECT * FROM calls WHERE id = ?', [id]);
        if (calls.length === 0) {
            return res.status(404).json({ error: 'Call not found' });
        }

        const call = calls[0];

        // Check if call already ended
        if (call.end_time) {
            return res.status(400).json({ error: 'Call already ended' });
        }

        // Calculate duration
        const endTime = new Date();
        const startTime = new Date(call.start_time);
        const duration = Math.floor((endTime - startTime) / 1000); // in seconds

        // Update call
        await db.query(
            'UPDATE calls SET end_time = NOW(), duration = ?, outcome = ?, notes = ? WHERE id = ?',
            [duration, outcome, notes, id]
        );

        // Update lead status based on outcome
        let leadStatus = call.status;
        if (outcome === 'converted') {
            leadStatus = 'converted';
        } else if (outcome === 'interested') {
            leadStatus = 'qualified';
        } else if (outcome === 'connected') {
            leadStatus = 'contacted';
        } else if (outcome === 'not_interested') {
            leadStatus = 'lost';
        } else if (outcome === 'callback') {
            leadStatus = 'follow_up';
        }

        await db.query('UPDATE leads SET status = ? WHERE id = ?', [leadStatus, call.lead_id]);

        // Get updated call
        const [updatedCall] = await db.query(
            `SELECT c.*, 
              l.company_name, l.contact_person,
              u.full_name as salesperson_name
       FROM calls c
       JOIN leads l ON c.lead_id = l.id
       JOIN users u ON c.salesperson_id = u.id
       WHERE c.id = ?`,
            [id]
        );

        res.json({
            message: 'Call ended successfully',
            call: updatedCall[0]
        });
    } catch (error) {
        console.error('End call error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get call statistics
exports.getCallStats = async (req, res) => {
    try {
        const { salesperson_id, start_date, end_date } = req.query;

        let whereClause = 'WHERE 1=1';
        const params = [];

        if (salesperson_id) {
            whereClause += ' AND salesperson_id = ?';
            params.push(salesperson_id);
        }
        if (start_date) {
            whereClause += ' AND start_time >= ?';
            params.push(start_date);
        }
        if (end_date) {
            whereClause += ' AND start_time <= ?';
            params.push(end_date);
        }

        // Total calls
        const [totalCalls] = await db.query(
            `SELECT COUNT(*) as total FROM calls ${whereClause}`,
            params
        );

        // Average duration
        const [avgDuration] = await db.query(
            `SELECT AVG(duration) as avg_duration FROM calls ${whereClause} AND duration IS NOT NULL`,
            params
        );

        // Calls by outcome
        const [callsByOutcome] = await db.query(
            `SELECT outcome, COUNT(*) as count FROM calls ${whereClause} GROUP BY outcome`,
            params
        );

        // Conversion rate
        const [conversions] = await db.query(
            `SELECT COUNT(*) as converted FROM calls ${whereClause} AND outcome = 'converted'`,
            params
        );

        const conversionRate = totalCalls[0].total > 0
            ? (conversions[0].converted / totalCalls[0].total * 100).toFixed(2)
            : 0;

        res.json({
            total_calls: totalCalls[0].total,
            average_duration: Math.round(avgDuration[0].avg_duration || 0),
            calls_by_outcome: callsByOutcome,
            conversion_rate: parseFloat(conversionRate)
        });
    } catch (error) {
        console.error('Get call stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
