# 🚀 Oasis Tides Restaurant - Quick Start Guide

Get your restaurant application running in 5 minutes!

## ⚡ Prerequisites Check

Before starting, ensure you have:
- ✅ PHP 8.1+ installed
- ✅ Composer installed
- ✅ Node.js 18+ installed
- ✅ npm installed

## 🏃‍♂️ Quick Installation

### 1. Extract and Navigate
```bash
unzip oasis-tides-restaurant-complete.zip
cd oasis-tides-restaurant
```

### 2. Backend Setup (2 minutes)
```bash
cd backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Create database
touch database/database.sqlite

# Run migrations
php artisan migrate

# Create admin user
php artisan tinker
```

In tinker console, paste this:
```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::create([
    'name' => 'Admin User',
    'email' => 'admin@oasistides.com',
    'password' => Hash::make('admin123'),
    'role' => 'admin'
]);

User::create([
    'name' => 'Staff User',
    'email' => 'staff@oasistides.com',
    'password' => Hash::make('staff123'),
    'role' => 'staff'
]);

User::create([
    'name' => 'Client User',
    'email' => 'client@oasistides.com',
    'password' => Hash::make('client123'),
    'role' => 'client'
]);

echo "Users created successfully!";
exit
```

### 3. Frontend Setup (1 minute)
```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8001/api" > .env.local
```

### 4. Start Both Servers (30 seconds)

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🎉 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api

## 🔐 Test Login Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@oasistides.com | admin123 |
| Staff | staff@oasistides.com | staff123 |
| Client | client@oasistides.com | client123 |

## 🎯 What's Included

✅ **Complete Restaurant System**
- Multi-role authentication (Admin/Staff/Client)
- Professional ocean-themed responsive design
- User registration and login
- Role-based access control
- Database structure for reservations, menu, orders

✅ **Professional Documentation**
- Complete installation guide
- Deployment instructions
- API documentation
- Troubleshooting guide

✅ **Production Ready**
- Laravel backend with SQLite/MySQL support
- Next.js frontend with TypeScript
- Secure authentication system
- CORS configured
- Environment-based configuration

## 🛠️ Next Steps

1. **Customize Design**: Edit colors in `frontend/tailwind.config.ts`
2. **Add Menu Items**: Use admin panel or database seeding
3. **Configure Email**: Update `.env` with SMTP settings
4. **Deploy**: Follow `DEPLOYMENT.md` for production setup

## 🆘 Quick Troubleshooting

**Backend won't start?**
```bash
# Check PHP version
php --version

# Install missing extensions
sudo apt install php8.1-sqlite3 php8.1-mbstring
```

**Frontend won't start?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Database errors?**
```bash
# Reset database
rm database/database.sqlite
touch database/database.sqlite
php artisan migrate
```

## 📞 Need Help?

- 📖 **Full Guide**: See `README.md`
- 🔧 **Installation**: See `INSTALLATION.md`
- 🚀 **Deployment**: See `DEPLOYMENT.md`
- 📧 **Support**: support@oasistides.com

---

**Enjoy your Oasis Tides Restaurant application!** 🌊🍽️

