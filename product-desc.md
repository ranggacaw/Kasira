# Kasira - Modern POS Application

## Overview
Kasira is a modern Point of Sale (POS) application designed for small to medium businesses such as cafes, retail stores, food stalls, and service-based businesses.

Built with:
- Laravel (Backend)
- Inertia.js + React (Frontend)
- shadcn/ui + Tailwind CSS (UI)
- PostgreSQL (Database)

The system is designed to be scalable, user-friendly, and ready for SaaS distribution.

---

## Target Market

Kasira is suitable for:

- Coffee shops & cafes
- Retail stores
- Food stalls / booths
- Laundry services
- Barbershops
- Diaper shops / fragrance shops / frozen food stores
- Small franchise businesses

---

## Core Features (MVP)

### 1. Dashboard
- Daily revenue summary
- Total transactions
- Top-selling products
- Low stock alerts
- Sales charts

---

### 2. POS (Point of Sale)
- Product selection
- Shopping cart system
- Discounts
- Tax / service fee calculation
- Payment methods:
  - Cash
  - QRIS
  - Bank Transfer
- Receipt printing
- Save transactions

---

### 3. Product Management
- Product name
- SKU / barcode
- Category
- Selling price
- Cost price
- Stock quantity
- Product image
- Active / inactive status

---

### 4. Inventory Management
- Stock in
- Stock out
- Stock movement history
- Minimum stock alerts

---

### 5. Categories
- Food
- Beverage
- Retail items
- Promotions / bundles

---

### 6. Transactions
- Transaction history
- Filter by:
  - Date range
  - Cashier
  - Outlet
  - Payment method

---

### 7. Outlet Management
- Multiple outlets
- Product per outlet
- Stock per outlet
- Reports per outlet

---

### 8. User & Role Management
Roles:
- Owner
- Admin
- Cashier
- Manager

Permissions example:
- Cashier: only handle transactions
- Admin: manage products & stock
- Owner: access reports & settings

---

## Premium Features (For Paid Plans)

- Multi-outlet support
- Barcode scanner integration
- Export to Excel / PDF
- Profit & Loss report
- HPP / COGS calculation
- Customer membership system
- Promotions & vouchers
- Cashier shift management
- Thermal printer support
- Progressive Web App (PWA)
- Subscription system
- WhatsApp receipt
- QRIS integration
- Offline mode

---

## Navigation Structure

```

Dashboard
POS
Transactions
Products
Categories
Inventory
Customers
Outlets
Reports
User & Roles
Settings

```

---

## Tech Stack

### Backend
- Laravel

### Frontend
- React (via Inertia.js)

### UI
- shadcn/ui
- Tailwind CSS

### Database
- PostgreSQL

### Additional Tools
- Authentication: Laravel Breeze / Fortify
- Roles & Permissions: Spatie Laravel Permission
- Charts: Recharts
- Tables: TanStack Table
- Export: Laravel Excel
- PDF: DomPDF / Browsershot
- PWA: Vite PWA

---

## Database Structure

### Core Tables

```

users
roles
outlets
categories
products
product_stocks
stock_movements
customers
transactions
transaction_items
payments
shifts
settings

```

---

## Pricing Strategy (SaaS)

### Starter Plan
- Price: Rp99.000 / month
- 1 outlet
- 2 users
- Basic POS
- Daily reports

---

### Pro Plan
- Price: Rp199.000 / month
- 3 outlets
- 10 users
- Inventory management
- Export reports
- Role management

---

### Business Plan
- Price: Rp399.000 / month
- Unlimited outlets
- Multi cashier
- HPP / COGS
- Membership system
- Priority support

---

## MVP Development Roadmap

### Phase 1 (Core)
- Authentication
- Dashboard
- Product management
- Category management
- POS system
- Transactions
- Inventory
- Basic reports

---

### Phase 2 (Enhancement)
- Multi-outlet
- PWA support
- Receipt printing
- Advanced reporting

---

### Phase 3 (Monetization)
- Subscription system
- Payment integration
- QRIS
- Customer loyalty system

---

## Product Positioning

Kasira is positioned as:

> "A modern POS application for small and medium businesses, accessible from desktop, tablet, and mobile devices without requiring installation."

---

## Future Enhancements

- AI-based sales insights
- Forecasting & analytics
- Supplier management
- Multi-language support
- Mobile app (React Native / Flutter)

---

## Notes

- Prioritize simplicity and speed for MVP
- Focus on mobile-first UI/UX
- Ensure offline-first capability for reliability
- Design scalable database architecture for SaaS

---