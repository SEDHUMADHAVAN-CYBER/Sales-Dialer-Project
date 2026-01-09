-- Seed Data for Sales Dialer & Call Tracking System

-- Insert Roles
INSERT INTO roles (name, description) VALUES
('admin', 'System administrator with full access'),
('manager', 'Sales manager with team oversight'),
('salesperson', 'Sales representative making calls');

-- Insert Users (password: 'password123' hashed with bcrypt)
-- Hash: $2b$10$rKZvVLKZ5xJ5xJ5xJ5xJ5uGZvVLKZ5xJ5xJ5xJ5xJ5xJ5xJ5xJ5xJ
INSERT INTO users (email, password, full_name, role_id) VALUES
('admin@salesdialer.com', '$2b$10$rKZvVLKZ5xJ5xJ5xJ5xJ5uGZvVLKZ5xJ5xJ5xJ5xJ5xJ5xJ5xJ5xJ', 'Admin User', 1),
('manager@salesdialer.com', '$2b$10$rKZvVLKZ5xJ5xJ5xJ5xJ5uGZvVLKZ5xJ5xJ5xJ5xJ5xJ5xJ5xJ5xJ', 'John Manager', 2),
('sales1@salesdialer.com', '$2b$10$rKZvVLKZ5xJ5xJ5xJ5xJ5uGZvVLKZ5xJ5xJ5xJ5xJ5xJ5xJ5xJ5xJ', 'Sarah Sales', 3),
('sales2@salesdialer.com', '$2b$10$rKZvVLKZ5xJ5xJ5xJ5xJ5uGZvVLKZ5xJ5xJ5xJ5xJ5xJ5xJ5xJ5xJ', 'Mike Johnson', 3),
('sales3@salesdialer.com', '$2b$10$rKZvVLKZ5xJ5xJ5xJ5xJ5uGZvVLKZ5xJ5xJ5xJ5xJ5xJ5xJ5xJ5xJ', 'Emily Davis', 3);

-- Insert Sample Leads
INSERT INTO leads (company_name, contact_person, email, phone, status, assigned_to, uploaded_by, priority, notes) VALUES
('Tech Solutions Inc', 'Robert Brown', 'robert@techsolutions.com', '+1-555-0101', 'new', 3, 2, 'high', 'Interested in enterprise package'),
('Digital Marketing Co', 'Lisa Anderson', 'lisa@digitalmarketing.com', '+1-555-0102', 'contacted', 3, 2, 'medium', 'Follow up next week'),
('Cloud Services Ltd', 'David Wilson', 'david@cloudservices.com', '+1-555-0103', 'qualified', 4, 2, 'high', 'Ready for demo'),
('StartUp Ventures', 'Jennifer Lee', 'jennifer@startupventures.com', '+1-555-0104', 'new', 4, 2, 'low', 'Early stage startup'),
('Enterprise Corp', 'Michael Chen', 'michael@enterprisecorp.com', '+1-555-0105', 'contacted', 5, 2, 'high', 'Decision maker identified'),
('Retail Group', 'Amanda White', 'amanda@retailgroup.com', '+1-555-0106', 'follow_up', 3, 2, 'medium', 'Requested callback'),
('Finance Solutions', 'Chris Martinez', 'chris@financesolutions.com', '+1-555-0107', 'new', 4, 2, 'medium', 'Warm lead from referral'),
('Healthcare Plus', 'Patricia Taylor', 'patricia@healthcareplus.com', '+1-555-0108', 'converted', 5, 2, 'high', 'Closed deal - $50k'),
('Education Systems', 'James Thompson', 'james@educationsystems.com', '+1-555-0109', 'not_interested', 3, 2, 'low', 'Not interested currently'),
('Manufacturing Inc', 'Mary Garcia', 'mary@manufacturinginc.com', '+1-555-0110', 'new', 5, 2, 'medium', 'Initial contact made'),
('Logistics Pro', 'Daniel Rodriguez', 'daniel@logisticspro.com', '+1-555-0111', 'contacted', 3, 2, 'high', 'Needs pricing info'),
('Consulting Group', 'Barbara Martinez', 'barbara@consultinggroup.com', '+1-555-0112', 'qualified', 4, 2, 'high', 'Budget approved'),
('Software Dynamics', 'Richard Hernandez', 'richard@softwaredynamics.com', '+1-555-0113', 'new', 5, 2, 'medium', 'Exploring options'),
('Real Estate Partners', 'Susan Lopez', 'susan@realestatepartners.com', '+1-555-0114', 'follow_up', 3, 2, 'low', 'Call back in 2 weeks'),
('Media Productions', 'Thomas Gonzalez', 'thomas@mediaproductions.com', '+1-555-0115', 'contacted', 4, 2, 'medium', 'Interested in trial');

-- Insert Sample Calls
INSERT INTO calls (lead_id, salesperson_id, start_time, end_time, duration, outcome, notes) VALUES
(1, 3, '2026-01-08 09:15:00', '2026-01-08 09:23:00', 480, 'connected', 'Good conversation, sending proposal'),
(2, 3, '2026-01-08 10:30:00', '2026-01-08 10:35:00', 300, 'interested', 'Wants to schedule demo'),
(3, 4, '2026-01-08 11:00:00', '2026-01-08 11:15:00', 900, 'interested', 'Very interested, decision in 1 week'),
(4, 4, '2026-01-08 13:45:00', '2026-01-08 13:47:00', 120, 'callback', 'Asked to call back tomorrow'),
(5, 5, '2026-01-08 14:20:00', '2026-01-08 14:35:00', 900, 'connected', 'Discussed pricing and features'),
(6, 3, '2026-01-08 15:10:00', '2026-01-08 15:18:00', 480, 'interested', 'Scheduling follow-up call'),
(7, 4, '2026-01-09 09:00:00', '2026-01-09 09:12:00', 720, 'connected', 'Positive response, needs approval'),
(8, 5, '2026-01-09 10:30:00', '2026-01-09 10:50:00', 1200, 'converted', 'Deal closed! $50k contract'),
(9, 3, '2026-01-09 11:15:00', '2026-01-09 11:17:00', 120, 'not_interested', 'Not interested at this time'),
(10, 5, '2026-01-09 13:00:00', '2026-01-09 13:08:00', 480, 'connected', 'Initial discovery call'),
(11, 3, '2026-01-09 14:30:00', '2026-01-09 14:38:00', 480, 'interested', 'Sending pricing details'),
(12, 4, '2026-01-09 15:45:00', '2026-01-09 16:00:00', 900, 'interested', 'Budget confirmed, moving forward'),
(1, 3, '2026-01-07 10:00:00', '2026-01-07 10:05:00', 300, 'voicemail', 'Left voicemail'),
(2, 3, '2026-01-07 11:30:00', '2026-01-07 11:31:00', 60, 'no_answer', 'No answer'),
(5, 5, '2026-01-07 14:00:00', '2026-01-07 14:02:00', 120, 'busy', 'Line busy');

-- Insert Sample Follow-ups
INSERT INTO followups (lead_id, call_id, salesperson_id, scheduled_date, status, notes) VALUES
(1, 1, 3, '2026-01-10 10:00:00', 'pending', 'Follow up on proposal'),
(2, 2, 3, '2026-01-11 14:00:00', 'pending', 'Schedule product demo'),
(3, 3, 4, '2026-01-12 11:00:00', 'pending', 'Check on decision timeline'),
(4, 4, 4, '2026-01-10 09:00:00', 'pending', 'Callback as requested'),
(6, 6, 3, '2026-01-13 15:00:00', 'pending', 'Follow-up discussion'),
(7, 7, 4, '2026-01-14 10:00:00', 'pending', 'Get approval status'),
(11, 11, 3, '2026-01-11 13:00:00', 'pending', 'Send pricing and answer questions'),
(14, NULL, 3, '2026-01-20 10:00:00', 'pending', 'Call back in 2 weeks as requested'),
(5, 5, 5, '2026-01-08 10:00:00', 'completed', 'Completed follow-up call'),
(10, 10, 5, '2026-01-09 09:00:00', 'completed', 'Second call completed');

-- Update lead statuses based on call outcomes
UPDATE leads SET status = 'contacted' WHERE id IN (1, 2, 5, 7, 10, 11);
UPDATE leads SET status = 'qualified' WHERE id IN (3, 12);
UPDATE leads SET status = 'converted' WHERE id = 8;
UPDATE leads SET status = 'lost' WHERE id = 9;
UPDATE leads SET status = 'follow_up' WHERE id IN (4, 6, 14);
