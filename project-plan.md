# Project Plan: Kasira

## Project Overview
Kasira is a modern web-based POS application for small to medium businesses such as cafes, retail stores, food stalls, laundries, and similar shops. The MVP focuses on fast cashier workflows, product and inventory management, and basic transaction reporting, with a path toward future SaaS expansion.

---

## MVP Scope

### In Scope
- [ ] POS checkout flow with cart, discounts, tax/service fee, payment methods, and transaction saving
- [ ] Product, category, and inventory management with stock movement tracking and low-stock alerts
- [ ] Transaction history and dashboard reporting for daily revenue, total transactions, and top-selling products

### Out of Scope (Deferred)
- Multi-outlet support -- adds data and permission complexity better handled after core flow is stable
- Subscription billing / SaaS plan management -- not needed to validate core POS operations first
- Offline mode / PWA -- adds sync and reliability complexity that should come after MVP
- Membership, vouchers, and loyalty features -- valuable but secondary to sales and stock accuracy

---

## User Roles
| Role | Description | MVP? |
|------|-------------|------|
| Owner | Reviews reports, settings, and overall business control | Yes |
| Admin | Manages products, categories, and inventory | Yes |
| Cashier | Handles daily POS transactions | Yes |

---

## Core Features (Prioritized)
| # | Feature | Priority | Complexity | Notes |
|---|---------|----------|------------|-------|
| 1 | POS checkout | Must-have | High | Core sales workflow with payment method recording |
| 2 | Product and inventory management | Must-have | Medium | Needed to keep stock and catalog accurate |
| 3 | Transactions and dashboard reports | Must-have | Medium | Gives visibility into sales and daily operations |

---

## Data Model Sketch

### Core Entities
- **Users**: name, email, password, role
- **Roles**: role name, permissions
- **Products**: name, SKU/barcode, category, selling price, cost price, stock status, image, active status
- **Categories**: name, type, status
- **Product Stocks**: product_id, quantity, minimum stock
- **Stock Movements**: product_id, type, quantity, reference, notes
- **Transactions**: invoice number, cashier, subtotal, discount, tax, total, payment method, paid at
- **Transaction Items**: transaction_id, product_id, quantity, price, subtotal
- **Payments**: transaction_id, method, amount, reference
- **Settings**: business name, tax/service defaults, receipt settings

### Key Relationships
- Users belong to Roles
- Categories have many Products
- Products have many Stock Movements
- Transactions have many Transaction Items
- Transaction Items belong to Products
- Transactions have one or many Payments

---

## Integrations & Services

| Capability | Needed? | Service/Tool | Notes |
|------------|---------|--------------|-------|
| Caching | No | None | Not needed for `<1k` users at MVP |
| Queues / Background Jobs | Yes | Laravel queue later, likely database or Redis-backed | Useful for future receipts, exports, notifications |
| Real-Time | No | None | Not needed for MVP |
| Full-Text Search | No | None | Standard filters are enough initially |
| File Storage | Yes | Local storage | Suitable for product images in MVP |
| Email / SMS | No | None | Can be added later |
| Analytics | Yes | Built-in reports first | External analytics can wait |
| Payments | Yes | Recorded methods: Cash, QRIS, Bank Transfer | Start with manual/recorded payment methods, not gateway integration |
| Third-Party | No | None for MVP | Avoid unnecessary external dependencies early |

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | React via Inertia.js | Modern UI without the overhead of a separate SPA backend |
| Backend | Laravel 12 | Fast development, built-in auth/tooling, strong ecosystem |
| ORM / DB Layer | Eloquent | Native Laravel ORM, productive for MVP |
| Database | PostgreSQL | Better default for a SaaS-ready app and explicitly preferred over SQLite |
| Styling | Tailwind CSS + shadcn/ui | Matches the product brief and supports fast UI development |
| Docker | Yes | Consistent local setup and easier VPS deployment |

---

## Deployment & Environments

| Environment | Platform | URL (if known) | Notes |
|-------------|----------|----------------|-------|
| Development | Local + Docker | localhost | Laravel app + PostgreSQL containers |
| Staging | Not planned initially | TBD | Can be added later if needed |
| Production | VPS | TBD | Dockerized deployment |

---

## Non-Functional Requirements

| Requirement | Detail |
|-------------|--------|
| Security | Standard login and role-based access |
| Performance | Expected traffic is `<1k users` |
| SEO | Not required |

---

## Open Questions / Risks
- Should customer records be included in MVP, or deferred until loyalty/membership features begin?
- Do QRIS and bank transfer only need manual payment recording first, or is real payment gateway integration needed in phase 2?

---

## Recommended Next Steps

### 1. Scaffold the project
```bash
composer create-project laravel/laravel:^12.0 kasira
```

### 2. Further steps
- Install and configure Inertia.js with React inside the Laravel project
- Set up Docker services for the app and PostgreSQL
- Define the initial database schema for users, roles, products, stocks, transactions, and payments
- Implement authentication and role-based access for Owner, Admin, and Cashier
- Build the POS checkout flow first, then inventory and reporting
- Prepare VPS deployment for `production`
