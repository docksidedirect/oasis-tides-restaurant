# 🚀 Oasis Tides Restaurant - Complete Installation Guide

This guide provides step-by-step instructions for setting up the Oasis Tides Restaurant application on different operating systems.

## 📋 System Requirements

### Minimum Requirements
- **CPU**: 2 cores, 2.0 GHz
- **RAM**: 4GB
- **Storage**: 5GB free space
- **Network**: Internet connection for package downloads

### Recommended Requirements
- **CPU**: 4 cores, 2.5 GHz+
- **RAM**: 8GB+
- **Storage**: 10GB+ SSD
- **Network**: Stable broadband connection

## 🖥️ Operating System Specific Installation

### Ubuntu/Debian Linux

#### Step 1: Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### Step 2: Install PHP and Extensions
```bash
# Install PHP 8.1 and required extensions
sudo apt install -y php8.1 php8.1-cli php8.1-common php8.1-mysql \
php8.1-zip php8.1-gd php8.1-mbstring php8.1-curl php8.1-xml \
php8.1-bcmath php8.1-sqlite3

# Verify PHP installation
php --version
```

#### Step 3: Install Composer
```bash
# Download and install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Verify Composer installation
composer --version
```

#### Step 4: Install Node.js and npm
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Step 5: Install Git
```bash
sudo apt install -y git
git --version
```

### macOS

#### Step 1: Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Step 2: Install PHP
```bash
# Install PHP 8.1
brew install php@8.1

# Link PHP
brew link php@8.1 --force

# Verify installation
php --version
```

#### Step 3: Install Composer
```bash
brew install composer
composer --version
```

#### Step 4: Install Node.js
```bash
brew install node@18
node --version
npm --version
```

#### Step 5: Install Git
```bash
brew install git
git --version
```

### Windows

#### Step 1: Install PHP
1. Download PHP 8.1+ from [php.net](https://www.php.net/downloads.php)
2. Extract to `C:\php`
3. Add `C:\php` to system PATH
4. Copy `php.ini-development` to `php.ini`
5. Enable required extensions in `php.ini`:
   ```ini
   extension=curl
   extension=gd
   extension=mbstring
   extension=openssl
   extension=pdo_sqlite
   extension=sqlite3
   extension=zip
   ```

#### Step 2: Install Composer
1. Download from [getcomposer.org](https://getcomposer.org/download/)
2. Run the installer
3. Verify: `composer --version`

#### Step 3: Install Node.js
1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Verify: `node --version` and `npm --version`

#### Step 4: Install Git
1. Download from [git-scm.com](https://git-scm.com/)
2. Run the installer
3. Verify: `git --version`

## 📦 Application Installation

### Step 1: Clone Repository
```bash
# Clone the project
git clone <your-repository-url>
cd oasis-tides-restaurant

# Or if you have the ZIP file
unzip oasis-tides-restaurant.zip
cd oasis-tides-restaurant
```

### Step 2: Backend Setup

#### 2.1 Install Dependencies
```bash
cd backend
composer install --no-dev --optimize-autoloader
```

#### 2.2 Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### 2.3 Configure Environment
Edit `.env` file with your settings:
```env
APP_NAME="Oasis Tides Restaurant"
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8001

# Database Configuration
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/your/project/backend/database/database.sqlite

# Mail Configuration (Optional)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@oasistides.com
MAIL_FROM_NAME="Oasis Tides Restaurant"
```

#### 2.4 Database Setup
```bash
# Create SQLite database file
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed database with sample data (optional)
php artisan db:seed
```

#### 2.5 Create Admin User
```bash
php artisan tinker
```
In the tinker console:
```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

$admin = User::create([
    'name' => 'Restaurant Admin',
    'email' => 'admin@oasistides.com',
    'password' => Hash::make('admin123'),
    'role' => 'admin',
    'phone' => '+1234567890',
    'is_active' => true
]);

$staff = User::create([
    'name' => 'Restaurant Staff',
    'email' => 'staff@oasistides.com',
    'password' => Hash::make('staff123'),
    'role' => 'staff',
    'phone' => '+1234567891',
    'is_active' => true
]);

echo "Admin and Staff users created successfully!";
exit
```

### Step 3: Frontend Setup

#### 3.1 Install Dependencies
```bash
cd ../frontend
npm install
```

#### 3.2 Environment Configuration
Create `.env.local` file:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8001/api
NEXT_PUBLIC_APP_NAME="Oasis Tides Restaurant"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Payment Configuration (Add when implementing payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

#### 3.3 Build Application (Production)
```bash
# For production deployment
npm run build
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Terminal 1 - Backend
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8001
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Production Mode

#### Backend Production Setup
```bash
cd backend

# Set production environment
sed -i 's/APP_ENV=local/APP_ENV=production/' .env
sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize autoloader
composer install --no-dev --optimize-autoloader
```

#### Frontend Production Setup
```bash
cd frontend

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration Options

### Backend Configuration

#### Database Options
```env
# SQLite (Default - Recommended for development)
DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite

# MySQL (Production recommended)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=oasis_tides
DB_USERNAME=your_username
DB_PASSWORD=your_password

# PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=oasis_tides
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### Email Configuration
```env
# Gmail SMTP
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls

# Mailgun
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=your-domain.mailgun.org
MAILGUN_SECRET=your-mailgun-secret

# SendGrid
MAIL_MAILER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
```

### Frontend Configuration

#### API Configuration
```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:8001/api

# Production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## 🧪 Testing Installation

### Backend Tests
```bash
cd backend

# Test API endpoints
curl http://localhost:8001/api/menu
curl -X POST http://localhost:8001/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","password_confirmation":"password123"}'
```

### Frontend Tests
```bash
cd frontend

# Run tests
npm test

# Run linting
npm run lint

# Check build
npm run build
```

## 🐳 Docker Installation (Alternative)

### Using Docker Compose
```bash
# Clone repository
git clone <repository-url>
cd oasis-tides-restaurant

# Build and start containers
docker-compose up -d

# Run migrations
docker-compose exec backend php artisan migrate

# Create admin user
docker-compose exec backend php artisan tinker
```

### Docker Compose File
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8001:8000"
    volumes:
      - ./backend:/var/www/html
    environment:
      - APP_ENV=local
      - DB_CONNECTION=sqlite
      - DB_DATABASE=/var/www/html/database/database.sqlite

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8001/api
    depends_on:
      - backend
```

## 🔍 Verification Checklist

After installation, verify these items:

### Backend Verification
- [ ] PHP version 8.1+ installed
- [ ] Composer installed and working
- [ ] Laravel server starts without errors
- [ ] Database migrations completed
- [ ] Admin user created successfully
- [ ] API endpoints respond correctly

### Frontend Verification
- [ ] Node.js 18+ installed
- [ ] npm packages installed successfully
- [ ] Next.js development server starts
- [ ] Application loads in browser
- [ ] API connection working
- [ ] Authentication flow functional

### Integration Verification
- [ ] Frontend can communicate with backend
- [ ] User registration works
- [ ] User login works
- [ ] Protected routes require authentication
- [ ] Role-based access control working

## 🆘 Troubleshooting

### Common Installation Issues

#### PHP Issues
```bash
# If PHP extensions missing
sudo apt install php8.1-{extension-name}

# If Composer fails
composer diagnose
composer clear-cache
```

#### Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

#### Database Issues
```bash
# Reset database
rm database/database.sqlite
touch database/database.sqlite
php artisan migrate:fresh --seed
```

#### Permission Issues (Linux/macOS)
```bash
# Fix Laravel permissions
sudo chown -R $USER:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### Getting Help

If you encounter issues:

1. **Check Logs**:
   - Backend: `backend/storage/logs/laravel.log`
   - Frontend: Browser console and terminal output

2. **Verify Requirements**:
   - Run `php --version`, `composer --version`, `node --version`
   - Check all required extensions are installed

3. **Reset Installation**:
   - Delete `vendor/` and `node_modules/` folders
   - Re-run installation steps

4. **Contact Support**:
   - Email: support@oasistides.com
   - Include error messages and system information

---

**Installation Complete!** 🎉

Your Oasis Tides Restaurant application should now be running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api

Default admin login:
- **Email**: admin@oasistides.com
- **Password**: admin123

