# 📡 API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "sales1@salesdialer.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "email": "sales1@salesdialer.com",
    "full_name": "Sarah Sales",
    "role": "salesperson",
    "is_active": true
  }
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": 3,
    "email": "sales1@salesdialer.com",
    "full_name": "Sarah Sales",
    "role": "salesperson",
    "is_active": true
  }
}
```

---

## 👥 User Endpoints

### Get All Users (Admin Only)
**GET** `/users`

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@salesdialer.com",
      "full_name": "Admin User",
      "role": "admin",
      "is_active": true,
      "created_at": "2026-01-09T10:00:00.000Z"
    }
  ]
}
```

### Get Salespeople (Manager/Admin)
**GET** `/users/salespeople`

**Response:**
```json
{
  "salespeople": [
    {
      "id": 3,
      "email": "sales1@salesdialer.com",
      "full_name": "Sarah Sales",
      "is_active": true
    }
  ]
}
```

### Create User (Admin Only)
**POST** `/users`

**Request Body:**
```json
{
  "email": "newsales@salesdialer.com",
  "password": "password123",
  "full_name": "New Salesperson",
  "role_id": 3
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 6,
    "email": "newsales@salesdialer.com",
    "full_name": "New Salesperson",
    "role": "salesperson",
    "is_active": true
  }
}
```

### Get Roles
**GET** `/users/roles`

**Response:**
```json
{
  "roles": [
    { "id": 1, "name": "admin", "description": "System administrator" },
    { "id": 2, "name": "manager", "description": "Sales manager" },
    { "id": 3, "name": "salesperson", "description": "Sales representative" }
  ]
}
```

---

## 📋 Lead Endpoints

### Get All Leads
**GET** `/leads`

**Query Parameters:**
- `status` (optional): new, contacted, qualified, converted, lost, follow_up
- `assigned_to` (optional): User ID
- `priority` (optional): low, medium, high

**Response:**
```json
{
  "leads": [
    {
      "id": 1,
      "company_name": "Tech Solutions Inc",
      "contact_person": "Robert Brown",
      "email": "robert@techsolutions.com",
      "phone": "+1-555-0101",
      "status": "new",
      "priority": "high",
      "assigned_to": 3,
      "assigned_to_name": "Sarah Sales",
      "uploaded_by_name": "John Manager",
      "notes": "Interested in enterprise package",
      "created_at": "2026-01-09T10:00:00.000Z"
    }
  ]
}
```

### Get My Leads (Salesperson)
**GET** `/leads/my-leads`

**Query Parameters:**
- `status` (optional)

**Response:** Same as Get All Leads

### Create Lead (Manager/Admin)
**POST** `/leads`

**Request Body:**
```json
{
  "company_name": "New Company",
  "contact_person": "John Doe",
  "email": "john@newcompany.com",
  "phone": "+1-555-9999",
  "assigned_to": 3,
  "priority": "high",
  "notes": "Warm lead from referral"
}
```

### Upload Leads CSV (Manager/Admin)
**POST** `/leads/upload-csv`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: CSV file

**CSV Format:**
```csv
company_name,contact_person,email,phone,priority,notes
Acme Corp,John Doe,john@acme.com,+1-555-1234,high,Interested
```

**Response:**
```json
{
  "message": "15 leads uploaded successfully",
  "count": 15
}
```

### Assign Lead (Manager/Admin)
**PATCH** `/leads/:id/assign`

**Request Body:**
```json
{
  "assigned_to": 3
}
```

---

## 📞 Call Endpoints

### Get All Calls (Manager/Admin)
**GET** `/calls`

**Query Parameters:**
- `salesperson_id` (optional)
- `lead_id` (optional)
- `outcome` (optional)
- `start_date` (optional): ISO date
- `end_date` (optional): ISO date

**Response:**
```json
{
  "calls": [
    {
      "id": 1,
      "lead_id": 1,
      "salesperson_id": 3,
      "start_time": "2026-01-09T09:15:00.000Z",
      "end_time": "2026-01-09T09:23:00.000Z",
      "duration": 480,
      "outcome": "connected",
      "notes": "Good conversation, sending proposal",
      "company_name": "Tech Solutions Inc",
      "contact_person": "Robert Brown",
      "salesperson_name": "Sarah Sales"
    }
  ]
}
```

### Get My Calls (Salesperson)
**GET** `/calls/my-calls`

**Query Parameters:** Same as Get All Calls

### Start Call (Salesperson)
**POST** `/calls/start`

**Request Body:**
```json
{
  "lead_id": 1
}
```

**Response:**
```json
{
  "message": "Call started",
  "call": {
    "id": 15,
    "lead_id": 1,
    "salesperson_id": 3,
    "start_time": "2026-01-09T14:30:00.000Z",
    "company_name": "Tech Solutions Inc",
    "contact_person": "Robert Brown"
  }
}
```

### End Call (Salesperson)
**PATCH** `/calls/:id/end`

**Request Body:**
```json
{
  "outcome": "connected",
  "notes": "Discussed pricing and features"
}
```

**Outcome Options:**
- `no_answer`
- `busy`
- `voicemail`
- `connected`
- `interested`
- `not_interested`
- `callback`
- `converted`

**Response:**
```json
{
  "message": "Call ended successfully",
  "call": {
    "id": 15,
    "duration": 420,
    "outcome": "connected",
    "end_time": "2026-01-09T14:37:00.000Z"
  }
}
```

### Get Call Statistics
**GET** `/calls/stats`

**Query Parameters:**
- `salesperson_id` (optional)
- `start_date` (optional)
- `end_date` (optional)

**Response:**
```json
{
  "total_calls": 150,
  "average_duration": 360,
  "calls_by_outcome": [
    { "outcome": "connected", "count": 45 },
    { "outcome": "interested", "count": 30 }
  ],
  "conversion_rate": 12.5
}
```

---

## 📅 Follow-up Endpoints

### Get All Follow-ups (Manager/Admin)
**GET** `/followups`

**Query Parameters:**
- `salesperson_id` (optional)
- `status` (optional): pending, completed, missed
- `start_date` (optional)
- `end_date` (optional)

**Response:**
```json
{
  "followups": [
    {
      "id": 1,
      "lead_id": 1,
      "call_id": 1,
      "salesperson_id": 3,
      "scheduled_date": "2026-01-10T10:00:00.000Z",
      "completed_date": null,
      "status": "pending",
      "notes": "Follow up on proposal",
      "company_name": "Tech Solutions Inc",
      "contact_person": "Robert Brown",
      "salesperson_name": "Sarah Sales"
    }
  ]
}
```

### Get My Follow-ups (Salesperson)
**GET** `/followups/my-followups`

**Query Parameters:**
- `status` (optional)

### Create Follow-up (Salesperson)
**POST** `/followups`

**Request Body:**
```json
{
  "lead_id": 1,
  "call_id": 15,
  "scheduled_date": "2026-01-12T14:00:00",
  "notes": "Schedule product demo"
}
```

### Complete Follow-up (Salesperson)
**PATCH** `/followups/:id/complete`

**Request Body:**
```json
{
  "notes": "Completed follow-up call"
}
```

### Mark Missed Follow-ups (Manager/Admin)
**POST** `/followups/mark-missed`

Updates all pending follow-ups with past dates to "missed" status.

---

## 📊 Analytics Endpoints

### Get Overall Analytics (Manager/Admin)
**GET** `/analytics/overall`

**Query Parameters:**
- `start_date` (optional)
- `end_date` (optional)

**Response:**
```json
{
  "summary": {
    "total_calls": 150,
    "total_leads": 75,
    "active_salespeople": 3,
    "average_duration": 360,
    "conversion_rate": 12.5,
    "followup_completion_rate": 85.0
  },
  "calls_per_day": [
    { "date": "2026-01-08", "count": 25 },
    { "date": "2026-01-09", "count": 30 }
  ],
  "calls_by_outcome": [
    { "outcome": "connected", "count": 45 },
    { "outcome": "interested", "count": 30 }
  ],
  "leads_by_status": [
    { "status": "new", "count": 20 },
    { "status": "contacted", "count": 30 }
  ]
}
```

### Get Salesperson Leaderboard (Manager/Admin)
**GET** `/analytics/leaderboard`

**Response:**
```json
{
  "leaderboard": [
    {
      "id": 3,
      "full_name": "Sarah Sales",
      "total_calls": 50,
      "avg_duration": 420,
      "conversions": 8,
      "conversion_rate": 16.0
    }
  ]
}
```

### Get Performance (Salesperson)
**GET** `/analytics/performance`

**Response:**
```json
{
  "summary": {
    "total_calls": 50,
    "average_duration": 420,
    "conversion_rate": 16.0,
    "assigned_leads": 25,
    "pending_followups": 5,
    "missed_followups": 1
  },
  "calls_per_day": [...],
  "calls_by_outcome": [...]
}
```

### Export Report (Manager/Admin)
**GET** `/analytics/export`

**Query Parameters:**
- `type`: calls, leads, or followups
- `start_date` (optional)
- `end_date` (optional)

**Response:** CSV file download

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "No authentication token, access denied"
}
```

### 403 Forbidden
```json
{
  "error": "Access forbidden: Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Lead not found"
}
```

### 500 Server Error
```json
{
  "error": "Server error"
}
```

---

## 🔒 Role Permissions

| Endpoint | Admin | Manager | Salesperson |
|----------|-------|---------|-------------|
| Create User | ✅ | ❌ | ❌ |
| View All Users | ✅ | ✅ | ❌ |
| Create Lead | ✅ | ✅ | ❌ |
| Upload CSV | ✅ | ✅ | ❌ |
| Assign Lead | ✅ | ✅ | ❌ |
| View All Calls | ✅ | ✅ | ❌ |
| Start/End Call | ✅ | ✅ | ✅ |
| View Analytics | ✅ | ✅ | Own Only |
| Export Reports | ✅ | ✅ | ❌ |

---

## 📝 Notes

- All dates should be in ISO 8601 format
- Duration is in seconds
- Passwords must be at least 6 characters
- Email must be unique
- JWT tokens expire after 7 days (configurable)
