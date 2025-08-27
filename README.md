# Oasis Tides Restaurant - Full Stack Application

A complete Laravel-Next.js restaurant management system with authentication, reservations, menu management, ordering system, and payment integration.

## 🌊 Features

- **Multi-Role Authentication System** (Admin, Staff, Client)
- **Professional Dashboards** for each user role
- **Reservation Management System**
- **Menu Management** with categories and pricing
- **Shopping Cart & Ordering System**
- **Payment Integration** (Stripe/PayPal ready)
- **Responsive Ocean-Themed Design**
- **Real-time Order Tracking**
- **Admin Panel** for complete restaurant management

## 🛠️ Tech Stack

### Backend
- **Laravel 10** - PHP Framework
- **SQLite** - Database
- **Laravel Sanctum** - API Authentication
- **RESTful API** - Backend services

### Frontend
- **Next.js 15** - React Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form management

## 📋 Prerequisites

Before installation, ensure you have the following installed:

### Required Software
- **PHP 8.1+** with extensions:
  - php-cli
  - php-common
  - php-mysql
  - php-zip
  - php-gd
  - php-mbstring
  - php-curl
  - php-xml
  - php-bcmath
  - php-sqlite3
- **Composer** (PHP package manager)
- **Node.js 18+** and **npm**
- **Git**

### System Requirements
- **OS**: Ubuntu 20.04+, macOS 10.15+, or Windows 10+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space

## 🚀 Installation Guide

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd oasis-tides-restaurant
```

### Step 2: Backend Setup (Laravel)

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Install PHP Dependencies
```bash
composer install
```

#### 2.3 Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### 2.4 Configure Database
Edit `.env` file and set database configuration:
```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/your/project/backend/database/database.sqlite
```

#### 2.5 Create Database File
```bash
touch database/database.sqlite
```

#### 2.6 Run Database Migrations
```bash
php artisan migrate
```

#### 2.7 Create Admin User (Optional)
```bash
php artisan tinker
```
Then run in tinker:
```php
$user = new App\Models\User();
$user->name = 'Admin User';
$user->email = 'admin@oasistides.com';
$user->password = Hash::make('password123');
$user->role = 'admin';
$user->save();
exit
```

#### 2.8 Start Laravel Development Server
```bash
php artisan serve --host=0.0.0.0 --port=8001
```

Backend will be available at: `http://localhost:8001`

### Step 3: Frontend Setup (Next.js)

#### 3.1 Navigate to Frontend Directory
```bash
cd ../frontend
```

#### 3.2 Install Node.js Dependencies
```bash
npm install
```

#### 3.3 Environment Configuration
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8001/api
NEXT_PUBLIC_APP_NAME=Oasis Tides Restaurant
```

#### 3.4 Start Next.js Development Server
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration

#### CORS Setup
The backend is configured to accept requests from any origin. For production, update `config/cors.php`:

```php
'allowed_origins' => ['https://yourdomain.com'],
```

#### Database Seeding (Optional)
Create sample data:
```bash
php artisan db:seed
```

### Frontend Configuration

#### API Base URL
Update `src/lib/api.ts` if your backend URL changes:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start Backend Server**:
   ```bash
   cd backend
   php artisan serve --host=0.0.0.0 --port=8001
   ```

2. **Start Frontend Server** (in new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8001/api`

### Production Mode

#### Backend Deployment
1. Set up web server (Apache/Nginx)
2. Configure virtual host to point to `backend/public`
3. Set environment to production in `.env`:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```
4. Optimize application:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

#### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Start production server:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
oasis-tides-restaurant/
├── backend/                 # Laravel API Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/ # API Controllers
│   │   │   └── Middleware/  # Custom Middleware
│   │   └── Models/          # Eloquent Models
│   ├── database/
│   │   ├── migrations/      # Database Migrations
│   │   └── database.sqlite  # SQLite Database
│   ├── routes/
│   │   └── api.php         # API Routes
│   └── .env                # Environment Configuration
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router Pages
│   │   ├── components/    # Reusable Components
│   │   ├── contexts/      # React Contexts
│   │   └── lib/          # Utility Functions
│   ├── public/           # Static Assets
│   └── .env.local       # Environment Variables
└── README.md            # This file
```

## 🔐 Default User Accounts

### Admin Account
- **Email**: admin@oasistides.com
- **Password**: password123
- **Role**: Admin (Full access)

### Staff Account
- **Email**: staff@oasistides.com
- **Password**: password123
- **Role**: Staff (Limited admin access)

### Client Account
- **Email**: client@oasistides.com
- **Password**: password123
- **Role**: Client (Customer access)

## 🎯 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user

### Menu Management
- `GET /api/menu` - Get all menu items
- `GET /api/menu/{id}` - Get specific menu item
- `POST /api/menu` - Create menu item (Admin only)
- `PUT /api/menu/{id}` - Update menu item (Admin only)
- `DELETE /api/menu/{id}` - Delete menu item (Admin only)

### Reservations
- `GET /api/reservations` - Get user reservations
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/{id}` - Update reservation
- `DELETE /api/reservations/{id}` - Cancel reservation

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order
- `GET /api/orders/{id}` - Get order details

## 🛠️ Troubleshooting

### Common Issues

#### Backend Issues

**Issue**: `Class 'App\Models\User' not found`
**Solution**: Run `composer dump-autoload`

**Issue**: Database connection error
**Solution**: 
1. Check database file exists: `ls -la database/database.sqlite`
2. Verify `.env` database path is absolute
3. Check file permissions

**Issue**: CORS errors
**Solution**: Ensure `config/cors.php` allows your frontend domain

#### Frontend Issues

**Issue**: API connection failed
**Solution**: 
1. Verify backend server is running
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure no firewall blocking requests

**Issue**: Build errors
**Solution**: 
1. Delete `node_modules` and `.next` folders
2. Run `npm install` again
3. Check for TypeScript errors

### Performance Optimization

#### Backend
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

#### Frontend
```bash
# Analyze bundle size
npm run build
npm run analyze

# Optimize images
npm install next-optimized-images
```

## 🔒 Security Considerations

### Backend Security
- API rate limiting enabled
- CSRF protection for web routes
- SQL injection protection via Eloquent ORM
- Password hashing with bcrypt
- JWT token authentication

### Frontend Security
- XSS protection via React
- HTTPS enforcement in production
- Environment variables for sensitive data
- Input validation and sanitization

## 📞 Support

For technical support or questions:
- **Email**: support@oasistides.com
- **Documentation**: Check this README
- **Issues**: Create GitHub issue

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Oasis Tides Restaurant** - Where culinary excellence meets ocean serenity 🌊


