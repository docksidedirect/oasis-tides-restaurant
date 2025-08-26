# 🚀 Oasis Tides Restaurant - Deployment Guide

This guide covers deploying the Oasis Tides Restaurant application to production environments.

## 🌐 Deployment Options

### 1. Traditional VPS/Dedicated Server
### 2. Cloud Platforms (AWS, DigitalOcean, Linode)
### 3. Shared Hosting (cPanel)
### 4. Container Deployment (Docker)
### 5. Platform as a Service (Heroku, Vercel)

## 🖥️ VPS/Dedicated Server Deployment

### Prerequisites
- Ubuntu 20.04+ or CentOS 8+
- Root or sudo access
- Domain name pointed to server IP
- SSL certificate (Let's Encrypt recommended)

### Step 1: Server Setup

#### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Required Software
```bash
# Install Nginx
sudo apt install nginx -y

# Install PHP 8.1 and extensions
sudo apt install php8.1-fpm php8.1-cli php8.1-common php8.1-mysql \
php8.1-zip php8.1-gd php8.1-mbstring php8.1-curl php8.1-xml \
php8.1-bcmath php8.1-sqlite3 -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for Node.js process management
sudo npm install -g pm2
```

### Step 2: Deploy Backend (Laravel)

#### Create Application Directory
```bash
sudo mkdir -p /var/www/oasis-tides
sudo chown $USER:$USER /var/www/oasis-tides
```

#### Upload and Setup Application
```bash
cd /var/www/oasis-tides

# Upload your code (via git, scp, or ftp)
git clone <your-repository-url> .

# Install dependencies
cd backend
composer install --no-dev --optimize-autoloader

# Set permissions
sudo chown -R www-data:www-data /var/www/oasis-tides
sudo chmod -R 755 /var/www/oasis-tides
sudo chmod -R 775 /var/www/oasis-tides/backend/storage
sudo chmod -R 775 /var/www/oasis-tides/backend/bootstrap/cache
```

#### Configure Environment
```bash
cd /var/www/oasis-tides/backend

# Copy and configure environment
cp .env.example .env
nano .env
```

Production `.env` configuration:
```env
APP_NAME="Oasis Tides Restaurant"
APP_ENV=production
APP_KEY=base64:your-generated-key
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database (MySQL recommended for production)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=oasis_tides_prod
DB_USERNAME=oasis_user
DB_PASSWORD=secure_password

# Cache Configuration
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Oasis Tides Restaurant"
```

#### Setup Database
```bash
# Install MySQL
sudo apt install mysql-server -y

# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

In MySQL console:
```sql
CREATE DATABASE oasis_tides_prod;
CREATE USER 'oasis_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON oasis_tides_prod.* TO 'oasis_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Run Migrations and Optimization
```bash
cd /var/www/oasis-tides/backend

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Create admin user
php artisan tinker
```

In tinker:
```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::create([
    'name' => 'Restaurant Admin',
    'email' => 'admin@yourdomain.com',
    'password' => Hash::make('secure_admin_password'),
    'role' => 'admin',
    'phone' => '+1234567890',
    'is_active' => true
]);
exit
```

#### Optimize Laravel
```bash
# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create symbolic link for storage
php artisan storage:link
```

### Step 3: Configure Nginx

#### Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/oasis-tides
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/oasis-tides/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    # Handle Laravel API routes
    location /api {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Handle Laravel routes
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}

# Frontend proxy (if serving from same domain)
server {
    listen 80;
    server_name app.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable Site
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/oasis-tides /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 4: Deploy Frontend (Next.js)

#### Build Frontend
```bash
cd /var/www/oasis-tides/frontend

# Install dependencies
npm ci --only=production

# Create production environment file
nano .env.local
```

Production `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_NAME="Oasis Tides Restaurant"
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
```

#### Build and Start Application
```bash
# Build application
npm run build

# Start with PM2
pm2 start npm --name "oasis-tides-frontend" -- start
pm2 save
pm2 startup
```

### Step 5: SSL Certificate (Let's Encrypt)

#### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### Obtain SSL Certificate
```bash
# For backend domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# For frontend domain
sudo certbot --nginx -d app.yourdomain.com
```

#### Auto-renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab
sudo crontab -e
```

Add this line:
```bash
0 12 * * * /usr/bin/certbot renew --quiet
```

## ☁️ Cloud Platform Deployment

### AWS Deployment

#### Using AWS EC2
1. Launch EC2 instance (Ubuntu 20.04)
2. Configure security groups (ports 80, 443, 22)
3. Follow VPS deployment steps above
4. Use RDS for database (recommended)
5. Use S3 for file storage
6. Use CloudFront for CDN

#### Using AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize application
cd backend
eb init

# Deploy
eb create production
eb deploy
```

### DigitalOcean Deployment

#### Using Droplet
1. Create Ubuntu 20.04 droplet
2. Follow VPS deployment steps
3. Use managed database for production
4. Configure firewall rules

#### Using App Platform
```yaml
# .do/app.yaml
name: oasis-tides
services:
- name: backend
  source_dir: backend
  github:
    repo: your-username/oasis-tides-restaurant
    branch: main
  run_command: php artisan serve --host=0.0.0.0 --port=8080
  environment_slug: php
  instance_count: 1
  instance_size_slug: basic-xxs
  
- name: frontend
  source_dir: frontend
  github:
    repo: your-username/oasis-tides-restaurant
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs

databases:
- name: oasis-db
  engine: PG
  version: "13"
```

## 🐳 Docker Deployment

### Docker Compose Production

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "8001:8000"
    environment:
      - APP_ENV=production
      - DB_HOST=database
    depends_on:
      - database
    volumes:
      - ./backend/storage:/var/www/html/storage

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000/api
    depends_on:
      - backend

  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: oasis_tides
      MYSQL_USER: oasis_user
      MYSQL_PASSWORD: userpassword
    volumes:
      - mysql_data:/var/lib/mysql

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend

volumes:
  mysql_data:
```

### Deploy with Docker
```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec backend php artisan migrate --force

# Create admin user
docker-compose exec backend php artisan tinker
```

## 🔧 Production Optimizations

### Backend Optimizations

#### PHP-FPM Configuration
```bash
sudo nano /etc/php/8.1/fpm/pool.d/www.conf
```

Optimize settings:
```ini
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
```

#### Laravel Optimizations
```bash
# Install Redis for caching
sudo apt install redis-server -y

# Configure Laravel caching
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Setup queue worker
php artisan queue:work --daemon
```

### Frontend Optimizations

#### Next.js Production Build
```bash
# Optimize build
npm run build

# Analyze bundle
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

#### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'oasis-tides-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/oasis-tides/frontend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

## 📊 Monitoring and Maintenance

### Setup Monitoring

#### Install Monitoring Tools
```bash
# Install htop for system monitoring
sudo apt install htop -y

# Install log monitoring
sudo apt install logwatch -y

# Setup automated backups
sudo apt install automysqlbackup -y
```

#### Application Monitoring
```bash
# Monitor Laravel logs
tail -f /var/www/oasis-tides/backend/storage/logs/laravel.log

# Monitor Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Monitor PM2 processes
pm2 monit
```

### Backup Strategy

#### Database Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u oasis_user -p oasis_tides_prod > /backups/db_backup_$DATE.sql
find /backups -name "db_backup_*.sql" -mtime +7 -delete
```

#### File Backup
```bash
# Backup application files
tar -czf /backups/app_backup_$(date +%Y%m%d).tar.gz /var/www/oasis-tides

# Sync to remote storage (optional)
rsync -av /backups/ user@backup-server:/backups/oasis-tides/
```

### Security Hardening

#### Firewall Configuration
```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

#### Fail2Ban Setup
```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Configure for Nginx
sudo nano /etc/fail2ban/jail.local
```

Add configuration:
```ini
[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
```

## 🚨 Troubleshooting Production Issues

### Common Issues

#### 500 Internal Server Error
```bash
# Check Laravel logs
tail -f /var/www/oasis-tides/backend/storage/logs/laravel.log

# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Check PHP-FPM logs
tail -f /var/log/php8.1-fpm.log
```

#### Database Connection Issues
```bash
# Test database connection
mysql -u oasis_user -p oasis_tides_prod

# Check Laravel database configuration
php artisan tinker
DB::connection()->getPdo();
```

#### Frontend Not Loading
```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs oasis-tides-frontend

# Restart application
pm2 restart oasis-tides-frontend
```

### Performance Issues

#### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
```

#### Cache Optimization
```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📞 Support and Maintenance

### Regular Maintenance Tasks

#### Weekly Tasks
- [ ] Check application logs for errors
- [ ] Monitor server resources (CPU, RAM, disk)
- [ ] Verify backup integrity
- [ ] Update security patches

#### Monthly Tasks
- [ ] Update dependencies (composer update, npm update)
- [ ] Review and optimize database queries
- [ ] Check SSL certificate expiration
- [ ] Performance testing

#### Quarterly Tasks
- [ ] Full security audit
- [ ] Disaster recovery testing
- [ ] Capacity planning review
- [ ] Update documentation

### Getting Help

For deployment support:
- **Email**: devops@oasistides.com
- **Documentation**: Check deployment logs
- **Emergency**: Include server details and error messages

---

**Deployment Complete!** 🎉

Your Oasis Tides Restaurant application is now live in production. Remember to:
- Monitor application performance
- Keep regular backups
- Update security patches
- Monitor user feedback

