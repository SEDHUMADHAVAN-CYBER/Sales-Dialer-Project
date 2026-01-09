# 🚀 Quick Start Guide - Sales Dialer System

## ⚡ 5-Minute Setup

### Step 1: Database Setup (2 minutes)

1. **Create Database**
```bash
mysql -u root -p
```

```sql
CREATE DATABASE sales_dialer_db;
exit;
```

2. **Import Schema & Data**
```bash
cd sales-dialer
mysql -u root -p sales_dialer_db < database/schema.sql
mysql -u root -p sales_dialer_db < database/seed.sql
```

### Step 2: Backend Setup (1 minute)

1. **Install & Configure**
```bash
cd backend
npm install
```

2. **Create .env file** (copy from .env.example and update):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sales_dialer_db
JWT_SECRET=your_secret_key
```

3. **Start Server**
```bash
npm run dev
```

✅ Backend running on `http://localhost:5000`

### Step 3: Frontend Setup (2 minutes)

1. **Install & Start**
```bash
cd ../frontend
npm install
npm run dev
```

✅ Frontend running on `http://localhost:3000`

## 🔑 Login Credentials

**Admin Account:**
- Email: `admin@salesdialer.com`
- Password: `password123`

**Manager Account:**
- Email: `manager@salesdialer.com`
- Password: `password123`

**Salesperson Account:**
- Email: `sales1@salesdialer.com`
- Password: `password123`

## 🎯 Test the System

### As Salesperson:
1. Login with sales1@salesdialer.com
2. Go to "Leads" page
3. Click "Call" button on any lead
4. Click "Start Call" - watch the timer!
5. Select outcome and add notes
6. Click "End Call"
7. Check "Calls" page to see your call history
8. View your stats on "Dashboard"

### As Manager:
1. Login with manager@salesdialer.com
2. View team analytics on "Dashboard"
3. See leaderboard rankings
4. Go to "Analytics" for detailed reports
5. Export CSV reports
6. Assign leads to salespeople

### As Admin:
1. Login with admin@salesdialer.com
2. Go to "Users" page
3. Create new users
4. Manage user roles
5. View all system analytics

## 📊 Key Features to Test

### Call Tracking
- ✅ Start/End calls with automatic duration
- ✅ 8 different call outcomes
- ✅ Add call notes
- ✅ Schedule follow-ups during call

### Lead Management
- ✅ Filter leads by status
- ✅ Assign leads (Manager)
- ✅ Upload CSV (use sample-leads.csv)
- ✅ Track lead status changes

### Analytics
- ✅ Real-time dashboard
- ✅ Charts (Line, Bar, Doughnut)
- ✅ Leaderboard with rankings
- ✅ Export reports as CSV

### Follow-ups
- ✅ Schedule follow-ups
- ✅ Mark as completed
- ✅ See overdue items
- ✅ Filter by status

## 🐛 Troubleshooting

**Database Connection Error?**
- Check MySQL is running
- Verify credentials in backend/.env
- Ensure database exists

**Port Already in Use?**
- Backend: Change PORT in backend/.env
- Frontend: Change port in frontend/vite.config.js

**Login Not Working?**
- Verify seed data was imported
- Check backend console for errors
- Clear browser cache/localStorage

## 📁 Project Structure

```
sales-dialer/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   ├── routes/          # API endpoints
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth context
│   │   └── utils/       # API client
│   └── public/
└── database/
    ├── schema.sql       # Database structure
    └── seed.sql         # Sample data
```

## 🎨 UI Highlights

- **Modern Design**: Gradient backgrounds, smooth animations
- **Responsive**: Works on desktop, tablet, mobile
- **Charts**: Interactive Chart.js visualizations
- **Real-time**: Live call duration counter
- **Intuitive**: Clean, professional SaaS interface

## 🔐 Security Features

- JWT authentication
- Bcrypt password hashing
- Role-based access control
- Input validation
- SQL injection prevention

## 📈 Next Steps

1. **Customize**: Update branding, colors, logos
2. **Integrate**: Add Twilio for real calls
3. **Deploy**: Host on Heroku, Vercel, AWS
4. **Extend**: Add email notifications, SMS
5. **Scale**: Implement caching, load balancing

## 💡 Pro Tips

- Use Chrome DevTools to inspect API calls
- Check Network tab for debugging
- Monitor backend console for errors
- Test with different user roles
- Try CSV upload with sample-leads.csv

---

**Need Help?** Check the main README.md for detailed documentation!

**Ready to Deploy?** See production deployment section in README.md
