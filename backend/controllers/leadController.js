const db = require('../config/database');
const fs = require('fs');
const csv = require('csv-parser');

// Get all leads (with filters)
exports.getAllLeads = async (req, res) => {
    try {
        const { status, assigned_to, priority } = req.query;

        let query = `
      SELECT l.*, 
             u1.full_name as assigned_to_name,
             u2.full_name as uploaded_by_name
      FROM leads l
      LEFT JOIN users u1 ON l.assigned_to = u1.id
      LEFT JOIN users u2 ON l.uploaded_by = u2.id
      WHERE 1=1
    `;
        const params = [];

        if (status) {
            query += ' AND l.status = ?';
            params.push(status);
        }
        if (assigned_to) {
            query += ' AND l.assigned_to = ?';
            params.push(assigned_to);
        }
        if (priority) {
            query += ' AND l.priority = ?';
            params.push(priority);
        }

        query += ' ORDER BY l.created_at DESC';

        const [leads] = await db.query(query, params);
        res.json({ leads });
    } catch (error) {
        console.error('Get all leads error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get leads assigned to salesperson
exports.getMyLeads = async (req, res) => {
    try {
        const salespersonId = req.user.id;
        const { status } = req.query;

        let query = `
      SELECT l.*, u.full_name as uploaded_by_name
      FROM leads l
      LEFT JOIN users u ON l.uploaded_by = u.id
      WHERE l.assigned_to = ?
    `;
        const params = [salespersonId];

        if (status) {
            query += ' AND l.status = ?';
            params.push(status);
        }

        query += ' ORDER BY l.created_at DESC';

        const [leads] = await db.query(query, params);
        res.json({ leads });
    } catch (error) {
        console.error('Get my leads error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get single lead
exports.getLead = async (req, res) => {
    try {
        const { id } = req.params;

        const [leads] = await db.query(
            `SELECT l.*, 
              u1.full_name as assigned_to_name,
              u2.full_name as uploaded_by_name
       FROM leads l
       LEFT JOIN users u1 ON l.assigned_to = u1.id
       LEFT JOIN users u2 ON l.uploaded_by = u2.id
       WHERE l.id = ?`,
            [id]
        );

        if (leads.length === 0) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        res.json({ lead: leads[0] });
    } catch (error) {
        console.error('Get lead error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create lead
exports.createLead = async (req, res) => {
    try {
        const { company_name, contact_person, email, phone, assigned_to, priority, notes } = req.body;
        const uploaded_by = req.user.id;

        const [result] = await db.query(
            `INSERT INTO leads (company_name, contact_person, email, phone, assigned_to, uploaded_by, priority, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [company_name, contact_person, email, phone, assigned_to, uploaded_by, priority, notes]
        );

        const [newLead] = await db.query(
            `SELECT l.*, 
              u1.full_name as assigned_to_name,
              u2.full_name as uploaded_by_name
       FROM leads l
       LEFT JOIN users u1 ON l.assigned_to = u1.id
       LEFT JOIN users u2 ON l.uploaded_by = u2.id
       WHERE l.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            message: 'Lead created successfully',
            lead: newLead[0]
        });
    } catch (error) {
        console.error('Create lead error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update lead
exports.updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { company_name, contact_person, email, phone, status, assigned_to, priority, notes } = req.body;

        const [existing] = await db.query('SELECT id FROM leads WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        await db.query(
            `UPDATE leads 
       SET company_name = ?, contact_person = ?, email = ?, phone = ?, 
           status = ?, assigned_to = ?, priority = ?, notes = ?
       WHERE id = ?`,
            [company_name, contact_person, email, phone, status, assigned_to, priority, notes, id]
        );

        const [updatedLead] = await db.query(
            `SELECT l.*, 
              u1.full_name as assigned_to_name,
              u2.full_name as uploaded_by_name
       FROM leads l
       LEFT JOIN users u1 ON l.assigned_to = u1.id
       LEFT JOIN users u2 ON l.uploaded_by = u2.id
       WHERE l.id = ?`,
            [id]
        );

        res.json({
            message: 'Lead updated successfully',
            lead: updatedLead[0]
        });
    } catch (error) {
        console.error('Update lead error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Assign lead
exports.assignLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { assigned_to } = req.body;

        const [existing] = await db.query('SELECT id FROM leads WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        await db.query('UPDATE leads SET assigned_to = ? WHERE id = ?', [assigned_to, id]);

        const [updatedLead] = await db.query(
            `SELECT l.*, u.full_name as assigned_to_name
       FROM leads l
       LEFT JOIN users u ON l.assigned_to = u.id
       WHERE l.id = ?`,
            [id]
        );

        res.json({
            message: 'Lead assigned successfully',
            lead: updatedLead[0]
        });
    } catch (error) {
        console.error('Assign lead error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete lead
exports.deleteLead = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT id FROM leads WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        await db.query('DELETE FROM leads WHERE id = ?', [id]);

        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        console.error('Delete lead error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Upload leads from CSV
exports.uploadLeadsCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploaded_by = req.user.id;
        const leads = [];
        const filePath = req.file.path;

        // Parse CSV
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                leads.push({
                    company_name: row.company_name || row.Company,
                    contact_person: row.contact_person || row.Contact,
                    email: row.email || row.Email,
                    phone: row.phone || row.Phone,
                    priority: row.priority || row.Priority || 'medium',
                    notes: row.notes || row.Notes || ''
                });
            })
            .on('end', async () => {
                try {
                    // Insert leads
                    const insertPromises = leads.map(lead =>
                        db.query(
                            `INSERT INTO leads (company_name, contact_person, email, phone, uploaded_by, priority, notes)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            [lead.company_name, lead.contact_person, lead.email, lead.phone, uploaded_by, lead.priority, lead.notes]
                        )
                    );

                    await Promise.all(insertPromises);

                    // Delete uploaded file
                    fs.unlinkSync(filePath);

                    res.json({
                        message: `${leads.length} leads uploaded successfully`,
                        count: leads.length
                    });
                } catch (error) {
                    console.error('CSV insert error:', error);
                    res.status(500).json({ error: 'Error inserting leads' });
                }
            });
    } catch (error) {
        console.error('Upload CSV error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
