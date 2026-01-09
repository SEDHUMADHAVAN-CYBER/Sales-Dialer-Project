# Sales Dialer & Call Tracking System 📞

A complete, production-ready SaaS application for managing sales calls, tracking performance, and analyzing team metrics. Built with React, Node.js, Express, and MySQL.

## 🚀 Features

### Core Functionality
- ✅ **Call Tracking** - Start/end calls with automatic duration calculation
- ✅ **Lead Management** - Upload, assign, and manage leads
- ✅ **Follow-up Scheduling** - Schedule and track follow-ups
- ✅ **Analytics Dashboard** - Comprehensive performance metrics
- ✅ **Role-Based Access** - Admin, Manager, and Salesperson roles
- ✅ **CSV Import/Export** - Bulk lead upload and report export

### User Roles

#### Admin
- Create and manage users
- View overall analytics
- Manage all roles and permissions

#### Manager
- Upload leads via CSV
- Assign leads to salespeople
- View team performance dashboard
- Export reports
- Monitor live call logs

#### Salesperson
- View assigned leads
- One-click call button with simulated dialer
- Auto call logging (start time, end time, duration)
- Select call outcomes and add notes
- Schedule follow-ups
- View personal performance stats

## 📋 Tech Stack

### Backend
- Node.js & Express.js
- MySQL Database
- JWT Authentication
- Bcrypt for password hashing
- Express Validator for input validation
- Multer for CSV uploads

### Frontend
- React.js 18
- Tailwind CSS
- Axios for API calls
- Chart.js for analytics
- React Router for navigation
- React Icons

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Database Setup

1. **Create MySQL Database**
```sql
CREATE DATABASE sales_dialer_db;
```

2. **Run Schema**
```bash
mysql -u root -p sales_dialer_db < database/schema.sql
```

3. **Seed Data (Optional)**
```bash
mysql -u root -p sales_dialer_db < database/seed.sql
```

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sales_dialer_db
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000
```

4. **Start backend server**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔐 Demo Credentials

After seeding the database, use these credentials:

**Admin:**
- Email: `admin@salesdialer.com`
- Password: `password123`

**Manager:**
- Email: `manager@salesdialer.com`
- Password: `password123`

**Salesperson:**
- Email: `sales1@salesdialer.com`
- Password: `password123`

## 📊 Database Schema

### Tables
- `roles` - User roles (admin, manager, salesperson)
- `users` - User accounts with authentication
- `leads` - Lead information and status
- `calls` - Call records with duration and outcomes
- `followups` - Scheduled follow-ups

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/salespeople` - Get salespeople (Manager)
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Deactivate user (Admin)

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/my-leads` - Get assigned leads (Salesperson)
- `POST /api/leads` - Create lead (Manager/Admin)
- `PUT /api/leads/:id` - Update lead
- `PATCH /api/leads/:id/assign` - Assign lead
- `POST /api/leads/upload-csv` - Upload leads CSV

### Calls
- `GET /api/calls` - Get all calls
- `GET /api/calls/my-calls` - Get salesperson calls
- `POST /api/calls/start` - Start a call
- `PATCH /api/calls/:id/end` - End a call
- `GET /api/calls/stats` - Get call statistics

### Follow-ups
- `GET /api/followups` - Get all follow-ups
- `GET /api/followups/my-followups` - Get salesperson follow-ups
- `POST /api/followups` - Create follow-up
- `PATCH /api/followups/:id/complete` - Complete follow-up

### Analytics
- `GET /api/analytics/overall` - Overall analytics (Manager/Admin)
- `GET /api/analytics/leaderboard` - Salesperson leaderboard
- `GET /api/analytics/performance` - Personal performance
- `GET /api/analytics/export` - Export reports (CSV)

## 🎨 Features Showcase

### Call Tracking
- Simulated dialer with visual feedback
- Real-time duration counter
- 8 call outcomes (no answer, busy, voicemail, connected, interested, not interested, callback, converted)
- Call notes and follow-up scheduling

### Analytics
- Calls per day trend chart
- Call outcome distribution
- Conversion rate tracking
- Salesperson leaderboard
- Team performance comparison
- CSV export for reports

### Lead Management
- Filter by status and priority
- Bulk CSV upload
- Lead assignment
- Status tracking (new, contacted, qualified, converted, lost, follow_up)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

## 📱 Responsive Design

- Mobile-friendly interface
- Responsive tables and charts
- Touch-optimized buttons
- Collapsible sidebar navigation

## 🚀 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Environment Variables
Update `.env` for production:
- Change `JWT_SECRET` to a strong random string
- Update `DB_PASSWORD` with secure password
- Set `NODE_ENV=production`
- Configure `CORS_ORIGIN` to your domain

### Recommended Hosting
- **Backend**: Heroku, AWS EC2, DigitalOcean
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: AWS RDS, DigitalOcean Managed MySQL

## 📝 CSV Upload Format

For bulk lead upload, use this CSV format:

```csv
company_name,contact_person,email,phone,priority,notes
Tech Solutions Inc,John Doe,john@techsolutions.com,+1-555-0101,high,Interested in enterprise package
Digital Marketing Co,Jane Smith,jane@digitalmarketing.com,+1-555-0102,medium,Follow up next week
```

## 🤝 Contributing

This is a production-ready starter template. Feel free to:
- Add Twilio/Exotel integration for real calls
- Implement email notifications
- Add SMS reminders for follow-ups
- Integrate with CRM systems
- Add more analytics visualizations

## 📄 License

MIT License - Free to use for commercial and personal projects

## 🆘 Support

For issues or questions:
1. Check the API documentation
2. Review the database schema
3. Verify environment variables
4. Check browser console for errors

## 🎯 Future Enhancements

- [ ] Real phone integration (Twilio/Exotel)
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Call recording
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Team chat integration

---

**Built with ❤️ for sales teams worldwide**
