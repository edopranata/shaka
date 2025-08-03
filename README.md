# 🚀 Shaka POS - Point of Sales Application

## 📋 Project Overview

Shaka POS adalah aplikasi Point of Sales (POS) modern yang dibangun dengan Laravel 12+ sebagai backend API dan Vue 3 + Quasar Framework sebagai frontend. Aplikasi ini dirancang untuk mendukung operasional toko retail dengan fitur lengkap mulai dari manajemen produk, transaksi penjualan, hingga pelaporan bisnis.

**Repository:** https://github.com/edopranata/shaka

## 🛠️ Technology Stack

### Backend
- **Framework:** Laravel 12+
- **Authentication:** Laravel Sanctum
- **Authorization:** Spatie Laravel Permission
- **Database:** MySQL/PostgreSQL
- **API Documentation:** Laravel Scribe
- **Testing:** Pest/PHPUnit

### Frontend
- **Framework:** Vue 3
- **UI Framework:** Quasar Framework
- **State Management:** Pinia
- **HTTP Client:** Axios
- **Testing:** Vitest, Cypress

### DevOps
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Monitoring:** Laravel Telescope, Sentry

## 🏗️ Project Structure

```
shaka/
├── backend/              # Laravel API
├── frontend/             # Vue 3 + Quasar
├── docs/                 # Documentation
├── database/             # Database scripts & seeders
├── docker/               # Docker configurations
├── .github/              # GitHub workflows & templates
├── README.md
├── CHANGELOG.md
├── .gitignore
└── docker-compose.yml
```

## 🚦 Development Status

**Current Phase:** Sprint 0 - Technical Spikes & Foundation Setup

### MVP Features (Week 1-12):
- [x] Project Structure Setup
- [x] Backend API with Laravel 12 + Sanctum + Spatie Permission
- [x] Frontend with Vue 3 + Quasar Framework + Pinia
- [x] Authentication & Authorization System
- [x] Role-based Access Control (Admin, Manager, Cashier)
- [x] Development Environment Setup
- [ ] Product Management
- [ ] Basic POS Interface
- [ ] Cash Transaction Processing
- [ ] Basic Reporting

### Post-MVP Features (Week 13-20):
- [ ] Purchase Management
- [ ] Member & Advanced Pricing
- [ ] Advanced Stock Management
- [ ] Discount System & Electronic Payments
- [ ] Advanced Reporting & Analytics

## 🛠️ Quick Start

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer
- MySQL/PostgreSQL
- Docker (optional)

### Backend Setup (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend Setup (Vue + Quasar)
```bash
cd frontend
npm install
npm run dev
```

### Docker Setup (Optional)
```bash
docker-compose up -d
```

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Frontend Documentation](./docs/frontend.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guide](./docs/contributing.md)

## 🧪 Testing

### Backend Testing
```bash
cd backend
php artisan test
```

### Frontend Testing
```bash
cd frontend
npm run test
npm run test:e2e
```

## 🔧 Environment Variables

### Backend (.env)
```env
APP_NAME="Shaka POS"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=shaka_pos
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:9000
SPA_URL=http://localhost:9000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME="Shaka POS"
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer:** Edo Pranata
- **Project Manager:** Edo Pranata
- **Repository:** https://github.com/edopranata/shaka

## 📞 Support

For support, please create an issue in this repository or contact the development team.

---

*Last updated: August 3, 2025*
*Version: 0.1.0-alpha*
