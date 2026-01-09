# Sales Dialer Setup Script for Windows
# Run this script in PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sales Dialer Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MySQL is installed
Write-Host "Checking MySQL installation..." -ForegroundColor Yellow
try {
    $mysqlVersion = mysql --version
    Write-Host "✓ MySQL is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ MySQL is not installed!" -ForegroundColor Red
    Write-Host "Please install MySQL from https://dev.mysql.com/downloads/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 1: Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$mysqlUser = Read-Host "Enter MySQL username (default: root)"
if ([string]::IsNullOrWhiteSpace($mysqlUser)) {
    $mysqlUser = "root"
}

$mysqlPassword = Read-Host "Enter MySQL password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword)
$mysqlPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host "Creating database..." -ForegroundColor Yellow
$createDbQuery = "CREATE DATABASE IF NOT EXISTS sales_dialer_db;"
echo $createDbQuery | mysql -u $mysqlUser -p$mysqlPasswordPlain 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database created successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create database" -ForegroundColor Red
    exit 1
}

Write-Host "Importing schema..." -ForegroundColor Yellow
mysql -u $mysqlUser -p$mysqlPasswordPlain sales_dialer_db < database/schema.sql 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Schema imported successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to import schema" -ForegroundColor Red
    exit 1
}

Write-Host "Importing seed data..." -ForegroundColor Yellow
mysql -u $mysqlUser -p$mysqlPasswordPlain sales_dialer_db < database/seed.sql 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Seed data imported successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to import seed data" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 2: Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location backend

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Create .env file
Write-Host "Creating .env file..." -ForegroundColor Yellow
$envContent = @"
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_USER=$mysqlUser
DB_PASSWORD=$mysqlPasswordPlain
DB_NAME=sales_dialer_db
DB_PORT=3306

JWT_SECRET=sales_dialer_secret_key_2026_change_in_production
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8
Write-Host "✓ .env file created" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 3: Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location frontend

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start Backend (in one terminal):" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2. Start Frontend (in another terminal):" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Open browser:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Login Credentials:" -ForegroundColor Cyan
Write-Host "  Admin:  admin@salesdialer.com / password123" -ForegroundColor White
Write-Host "  Manager: manager@salesdialer.com / password123" -ForegroundColor White
Write-Host "  Sales:  sales1@salesdialer.com / password123" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see QUICKSTART.md" -ForegroundColor Gray
Write-Host ""
