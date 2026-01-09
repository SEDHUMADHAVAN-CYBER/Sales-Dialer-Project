const db = require('../config/database');

// Get overall analytics (Admin/Manager)
exports.getOverallAnalytics = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let dateFilter = '';
        const params = [];

        if (start_date && end_date) {
            dateFilter = 'WHERE start_time BETWEEN ? AND ?';
            params.push(start_date, end_date);
        }

        // Total calls
        const [totalCalls] = await db.query(
            `SELECT COUNT(*) as total FROM calls ${dateFilter}`,
            params
        );

        // Total leads
        const [totalLeads] = await db.query('SELECT COUNT(*) as total FROM leads');

        // Active salespeople
        const [activeSales] = await db.query(
            `SELECT COUNT(*) as total FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE r.name = 'salesperson' AND u.is_active = TRUE`
        );

        // Calls per day (last 7 days)
        const [callsPerDay] = await db.query(
            `SELECT DATE(start_time) as date, COUNT(*) as count
       FROM calls
       WHERE start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(start_time)
       ORDER BY date ASC`
        );

        // Average call duration
        const [avgDuration] = await db.query(
            `SELECT AVG(duration) as avg_duration FROM calls ${dateFilter} AND duration IS NOT NULL`,
            params
        );

        // Calls by outcome
        const [callsByOutcome] = await db.query(
            `SELECT outcome, COUNT(*) as count FROM calls ${dateFilter} GROUP BY outcome`,
            params
        );

        // Conversion rate
        const [conversions] = await db.query(
            `SELECT COUNT(*) as converted FROM calls ${dateFilter} AND outcome = 'converted'`,
            params
        );

        const conversionRate = totalCalls[0].total > 0
            ? (conversions[0].converted / totalCalls[0].total * 100).toFixed(2)
            : 0;

        // Leads by status
        const [leadsByStatus] = await db.query(
            'SELECT status, COUNT(*) as count FROM leads GROUP BY status'
        );

        // Follow-up completion rate
        const [totalFollowups] = await db.query(
            'SELECT COUNT(*) as total FROM followups WHERE scheduled_date < NOW()'
        );
        const [completedFollowups] = await db.query(
            'SELECT COUNT(*) as completed FROM followups WHERE status = "completed"'
        );

        const followupCompletionRate = totalFollowups[0].total > 0
            ? (completedFollowups[0].completed / totalFollowups[0].total * 100).toFixed(2)
            : 0;

        res.json({
            summary: {
                total_calls: totalCalls[0].total,
                total_leads: totalLeads[0].total,
                active_salespeople: activeSales[0].total,
                average_duration: Math.round(avgDuration[0].avg_duration || 0),
                conversion_rate: parseFloat(conversionRate),
                followup_completion_rate: parseFloat(followupCompletionRate)
            },
            calls_per_day: callsPerDay,
            calls_by_outcome: callsByOutcome,
            leads_by_status: leadsByStatus
        });
    } catch (error) {
        console.error('Get overall analytics error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get salesperson leaderboard
exports.getSalespersonLeaderboard = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let dateFilter = '';
        const params = [];

        if (start_date && end_date) {
            dateFilter = 'AND c.start_time BETWEEN ? AND ?';
            params.push(start_date, end_date);
        }

        const [leaderboard] = await db.query(
            `SELECT 
         u.id,
         u.full_name,
         COUNT(c.id) as total_calls,
         AVG(c.duration) as avg_duration,
         SUM(CASE WHEN c.outcome = 'converted' THEN 1 ELSE 0 END) as conversions,
         ROUND(SUM(CASE WHEN c.outcome = 'converted' THEN 1 ELSE 0 END) / COUNT(c.id) * 100, 2) as conversion_rate
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN calls c ON u.id = c.salesperson_id ${dateFilter}
       WHERE r.name = 'salesperson' AND u.is_active = TRUE
       GROUP BY u.id, u.full_name
       ORDER BY conversions DESC, total_calls DESC`,
            params
        );

        res.json({ leaderboard });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get salesperson performance
exports.getSalespersonPerformance = async (req, res) => {
    try {
        const salespersonId = req.user.role === 'salesperson' ? req.user.id : req.params.id;
        const { start_date, end_date } = req.query;

        let dateFilter = '';
        const params = [salespersonId];

        if (start_date && end_date) {
            dateFilter = 'AND start_time BETWEEN ? AND ?';
            params.push(start_date, end_date);
        }

        // Total calls
        const [totalCalls] = await db.query(
            `SELECT COUNT(*) as total FROM calls WHERE salesperson_id = ? ${dateFilter}`,
            params
        );

        // Average duration
        const [avgDuration] = await db.query(
            `SELECT AVG(duration) as avg_duration FROM calls 
       WHERE salesperson_id = ? AND duration IS NOT NULL ${dateFilter}`,
            params
        );

        // Calls by outcome
        const [callsByOutcome] = await db.query(
            `SELECT outcome, COUNT(*) as count FROM calls 
       WHERE salesperson_id = ? ${dateFilter}
       GROUP BY outcome`,
            params
        );

        // Conversions
        const [conversions] = await db.query(
            `SELECT COUNT(*) as converted FROM calls 
       WHERE salesperson_id = ? AND outcome = 'converted' ${dateFilter}`,
            params
        );

        const conversionRate = totalCalls[0].total > 0
            ? (conversions[0].converted / totalCalls[0].total * 100).toFixed(2)
            : 0;

        // Assigned leads
        const [assignedLeads] = await db.query(
            'SELECT COUNT(*) as total FROM leads WHERE assigned_to = ?',
            [salespersonId]
        );

        // Pending follow-ups
        const [pendingFollowups] = await db.query(
            'SELECT COUNT(*) as total FROM followups WHERE salesperson_id = ? AND status = "pending"',
            [salespersonId]
        );

        // Missed follow-ups
        const [missedFollowups] = await db.query(
            'SELECT COUNT(*) as total FROM followups WHERE salesperson_id = ? AND status = "missed"',
            [salespersonId]
        );

        // Calls per day (last 7 days)
        const [callsPerDay] = await db.query(
            `SELECT DATE(start_time) as date, COUNT(*) as count
       FROM calls
       WHERE salesperson_id = ? AND start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(start_time)
       ORDER BY date ASC`,
            [salespersonId]
        );

        res.json({
            summary: {
                total_calls: totalCalls[0].total,
                average_duration: Math.round(avgDuration[0].avg_duration || 0),
                conversion_rate: parseFloat(conversionRate),
                assigned_leads: assignedLeads[0].total,
                pending_followups: pendingFollowups[0].total,
                missed_followups: missedFollowups[0].total
            },
            calls_per_day: callsPerDay,
            calls_by_outcome: callsByOutcome
        });
    } catch (error) {
        console.error('Get salesperson performance error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Export report data
exports.exportReport = async (req, res) => {
    try {
        const { type, start_date, end_date } = req.query;

        let data = [];
        let filename = 'report.csv';

        if (type === 'calls') {
            let query = 'SELECT c.*, l.company_name, l.contact_person, u.full_name as salesperson FROM calls c JOIN leads l ON c.lead_id = l.id JOIN users u ON c.salesperson_id = u.id WHERE 1=1';
            const params = [];

            if (start_date && end_date) {
                query += ' AND c.start_time BETWEEN ? AND ?';
                params.push(start_date, end_date);
            }

            query += ' ORDER BY c.start_time DESC';

            const [calls] = await db.query(query, params);
            data = calls;
            filename = 'calls_report.csv';
        } else if (type === 'leads') {
            const [leads] = await db.query(
                `SELECT l.*, u1.full_name as assigned_to_name, u2.full_name as uploaded_by_name
         FROM leads l
         LEFT JOIN users u1 ON l.assigned_to = u1.id
         LEFT JOIN users u2 ON l.uploaded_by = u2.id
         ORDER BY l.created_at DESC`
            );
            data = leads;
            filename = 'leads_report.csv';
        } else if (type === 'followups') {
            const [followups] = await db.query(
                `SELECT f.*, l.company_name, l.contact_person, u.full_name as salesperson
         FROM followups f
         JOIN leads l ON f.lead_id = l.id
         JOIN users u ON f.salesperson_id = u.id
         ORDER BY f.scheduled_date DESC`
            );
            data = followups;
            filename = 'followups_report.csv';
        }

        // Convert to CSV
        if (data.length === 0) {
            return res.status(404).json({ error: 'No data found' });
        }

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n');
        const csv = `${headers}\n${rows}`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (error) {
        console.error('Export report error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
