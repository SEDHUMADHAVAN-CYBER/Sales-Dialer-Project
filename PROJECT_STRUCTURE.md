# 📁 Project Structure

```
sales-dialer/
│
├── 📄 README.md                    # Main documentation
├── 📄 QUICKSTART.md                # 5-minute setup guide
├── 📄 API_DOCUMENTATION.md         # Complete API reference
├── 📄 PROJECT_SUMMARY.md           # Feature & implementation summary
├── 📄 .gitignore                   # Git ignore rules
├── 📄 sample-leads.csv             # Sample CSV for testing
├── 📄 setup.ps1                    # Automated setup script (Windows)
│
├── 📂 database/
│   ├── schema.sql                  # Database table definitions
│   └── seed.sql                    # Sample data (users, leads, calls)
│
├── 📂 backend/                     # Node.js + Express API
│   ├── 📄 package.json             # Backend dependencies
│   ├── 📄 server.js                # Express app entry point
│   ├── 📄 .env.example             # Environment variables template
│   │
│   ├── 📂 config/
│   │   └── database.js             # MySQL connection pool
│   │
│   ├── 📂 middleware/
│   │   ├── auth.js                 # JWT authentication & authorization
│   │   └── validate.js             # Input validation middleware
│   │
│   ├── 📂 controllers/
│   │   ├── authController.js       # Login, register, getCurrentUser
│   │   ├── userController.js       # User CRUD, roles
│   │   ├── leadController.js       # Lead management, CSV upload
│   │   ├── callController.js       # Call tracking, start/end, stats
│   │   ├── followupController.js   # Follow-up scheduling & completion
│   │   └── analyticsController.js  # Dashboard, leaderboard, exports
│   │
│   └── 📂 routes/
│       ├── authRoutes.js           # /api/auth/*
│       ├── userRoutes.js           # /api/users/*
│       ├── leadRoutes.js           # /api/leads/*
│       ├── callRoutes.js           # /api/calls/*
│       ├── followupRoutes.js       # /api/followups/*
│       └── analyticsRoutes.js      # /api/analytics/*
│
└── 📂 frontend/                    # React + Vite + Tailwind
    ├── 📄 package.json             # Frontend dependencies
    ├── 📄 index.html               # HTML entry point
    ├── 📄 vite.config.js           # Vite configuration
    ├── 📄 tailwind.config.js       # Tailwind CSS configuration
    ├── 📄 postcss.config.js        # PostCSS configuration
    │
    └── 📂 src/
        ├── 📄 main.jsx             # React entry point
        ├── 📄 App.jsx              # Router configuration
        ├── 📄 index.css            # Global styles + Tailwind
        │
        ├── 📂 context/
        │   └── AuthContext.jsx     # Authentication state management
        │
        ├── 📂 utils/
        │   └── api.js              # Axios client with interceptors
        │
        ├── 📂 components/
        │   ├── Layout.jsx          # Main layout with sidebar
        │   ├── ProtectedRoute.jsx  # Route protection wrapper
        │   └── CallModal.jsx       # Dialer modal component
        │
        └── 📂 pages/
            ├── Login.jsx           # Login page
            ├── Dashboard.jsx       # Analytics dashboard with charts
            ├── Leads.jsx           # Lead management & filtering
            ├── Calls.jsx           # Call history
            ├── Followups.jsx       # Follow-up tracking
            ├── Analytics.jsx       # Detailed analytics & reports
            └── Users.jsx           # User management (Admin only)
```

---

## 📊 File Count Summary

### Backend (18 files)
- **Configuration**: 2 files
- **Controllers**: 6 files
- **Middleware**: 2 files
- **Routes**: 6 files
- **Core**: 2 files (server.js, package.json)

### Frontend (20 files)
- **Pages**: 7 files
- **Components**: 3 files
- **Context**: 1 file
- **Utils**: 1 file
- **Core**: 4 files (App.jsx, main.jsx, index.css, index.html)
- **Config**: 4 files (package.json, vite, tailwind, postcss)

### Database (2 files)
- schema.sql
- seed.sql

### Documentation (5 files)
- README.md
- QUICKSTART.md
- API_DOCUMENTATION.md
- PROJECT_SUMMARY.md
- This file

### Other (3 files)
- .gitignore
- sample-leads.csv
- setup.ps1

**Total: 48 files** 🎯

---

## 🔗 File Dependencies

### Backend Flow
```
server.js
  ├── routes/* (all route files)
  │   ├── controllers/* (business logic)
  │   │   └── config/database.js (MySQL)
  │   └── middleware/* (auth, validation)
  └── config/database.js
```

### Frontend Flow
```
main.jsx
  └── App.jsx
      ├── context/AuthContext.jsx
      ├── components/Layout.jsx
      │   └── pages/* (all page components)
      │       ├── components/CallModal.jsx
      │       └── utils/api.js
      └── components/ProtectedRoute.jsx
```

---

## 📦 Key Dependencies

### Backend
- **express** - Web framework
- **mysql2** - Database driver
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin requests
- **express-validator** - Input validation
- **multer** - File uploads
- **csv-parser** - CSV processing
- **dotenv** - Environment variables

### Frontend
- **react** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **chart.js** - Charts
- **react-chartjs-2** - React Chart.js wrapper
- **react-icons** - Icon library
- **date-fns** - Date formatting
- **tailwindcss** - CSS framework

---

## 🎯 Entry Points

### Development
1. **Backend**: `backend/server.js` (port 5000)
2. **Frontend**: `frontend/src/main.jsx` (port 3000)

### Production
1. **Backend**: `node backend/server.js`
2. **Frontend**: Build with `npm run build`, serve `dist/`

---

## 🔧 Configuration Files

### Backend
- `.env` - Environment variables (DB, JWT, CORS)
- `.env.example` - Template for .env

### Frontend
- `vite.config.js` - Dev server, proxy settings
- `tailwind.config.js` - Design tokens, colors
- `postcss.config.js` - CSS processing

---

## 📝 Documentation Files

1. **README.md** - Main documentation
   - Installation guide
   - Features overview
   - API endpoints
   - Deployment instructions

2. **QUICKSTART.md** - Quick setup
   - 5-minute setup
   - Test scenarios
   - Troubleshooting

3. **API_DOCUMENTATION.md** - API reference
   - All endpoints
   - Request/response examples
   - Error codes
   - Role permissions

4. **PROJECT_SUMMARY.md** - Implementation details
   - Features checklist
   - Architecture overview
   - Security implementation
   - Extension ideas

---

## 🗄️ Database Files

### schema.sql
- Creates 5 tables
- Defines relationships
- Adds indexes
- Sets constraints

### seed.sql
- 3 roles
- 5 users (1 admin, 1 manager, 3 sales)
- 15 sample leads
- 15 call records
- 10 follow-ups

---

## 🎨 Style Files

### index.css
- Tailwind directives
- Custom component classes
- Utility classes
- Animations
- Scrollbar styles

### tailwind.config.js
- Custom color palette
- Font configuration
- Breakpoints
- Plugins

---

## 🚀 Build Outputs (Generated)

### Backend
- `node_modules/` - Dependencies
- `uploads/` - CSV uploads (temporary)

### Frontend
- `node_modules/` - Dependencies
- `dist/` - Production build

---

## 🔒 Protected Files (.gitignore)

- `.env` - Environment variables
- `node_modules/` - Dependencies
- `uploads/` - Temporary files
- `dist/` - Build output
- IDE files (.vscode, .idea)
- OS files (.DS_Store)

---

## 📊 Lines of Code (Approximate)

- **Backend**: ~2,500 lines
- **Frontend**: ~3,000 lines
- **Database**: ~300 lines
- **Documentation**: ~2,000 lines
- **Total**: ~7,800 lines

---

## 🎯 Code Organization Principles

1. **Separation of Concerns**
   - Routes handle HTTP
   - Controllers handle logic
   - Models handle data

2. **DRY (Don't Repeat Yourself)**
   - Reusable components
   - Shared utilities
   - Common middleware

3. **Single Responsibility**
   - Each file has one purpose
   - Each function does one thing
   - Clear naming conventions

4. **Scalability**
   - Modular structure
   - Easy to add features
   - Clear dependencies

---

**Navigate with confidence! 🧭**
