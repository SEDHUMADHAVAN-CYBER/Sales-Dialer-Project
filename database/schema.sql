-- Sales Dialer & Call Tracking System Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS followups;
DROP TABLE IF EXISTS calls;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Roles Table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Leads Table
CREATE TABLE leads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    status ENUM('new', 'contacted', 'qualified', 'converted', 'lost', 'follow_up') DEFAULT 'new',
    assigned_to INT,
    uploaded_by INT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Calls Table
CREATE TABLE calls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lead_id INT NOT NULL,
    salesperson_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration INT, -- in seconds
    outcome ENUM('no_answer', 'busy', 'voicemail', 'connected', 'interested', 'not_interested', 'callback', 'converted') DEFAULT 'no_answer',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (salesperson_id) REFERENCES users(id)
);

-- Follow-ups Table
CREATE TABLE followups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lead_id INT NOT NULL,
    call_id INT,
    salesperson_id INT NOT NULL,
    scheduled_date DATETIME NOT NULL,
    completed_date DATETIME,
    status ENUM('pending', 'completed', 'missed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (call_id) REFERENCES calls(id) ON DELETE SET NULL,
    FOREIGN KEY (salesperson_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_calls_salesperson ON calls(salesperson_id);
CREATE INDEX idx_calls_lead ON calls(lead_id);
CREATE INDEX idx_calls_start_time ON calls(start_time);
CREATE INDEX idx_followups_salesperson ON followups(salesperson_id);
CREATE INDEX idx_followups_status ON followups(status);
CREATE INDEX idx_followups_scheduled_date ON followups(scheduled_date);
