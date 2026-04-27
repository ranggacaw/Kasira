# Kasira

Kasira is a Laravel 12 POS foundation for small to medium businesses. The current baseline ships with Inertia.js, React, Breeze authentication, PostgreSQL-first configuration, and the initial `Owner`, `Admin`, and `Cashier` role model.

## Stack

- Laravel 12
- Inertia.js + React
- Tailwind CSS
- PostgreSQL as the primary application database
- Laravel Breeze for authentication scaffolding

## Local setup

1. Install PHP and Node dependencies:

```bash
composer install
npm install
```

2. Create your environment file and application key:

```bash
cp .env.example .env
php artisan key:generate
```

3. Update `.env` with your PostgreSQL credentials.

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=kasira
DB_USERNAME=postgres
DB_PASSWORD=
```

4. Run the database and seed the baseline users:

```bash
php artisan migrate --seed
```

5. Start the app:

```bash
composer run dev
```

## Demo users

Seeded local accounts use the password `password`.

- `owner@kasira.test`
- `admin@kasira.test`
- `cashier@kasira.test`

## Useful commands

```bash
composer run dev
composer run test
npm run build
```

## Current foundation scope

- Kasira-branded public landing page on Inertia and React
- Protected dashboard behind authentication
- Role-aware shared auth context for frontend pages
- PostgreSQL-first app configuration for development and deployment-oriented environments
