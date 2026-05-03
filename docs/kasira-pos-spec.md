# Kasira POS - Full AI Coding Specification (Mobile & Tablet PWA)

## Overview
Build a modern POS (Point of Sale) web application optimized for **mobile and tablet only (PWA)**.

### Tech Stack
- Backend: Laravel
- Frontend: React (Inertia.js)
- UI: TailwindCSS + shadcn/ui
- Database: PostgreSQL

---

## Core Requirements

### Platform Rules
- Mobile-first design
- Tablet support (max width ~1024px)
- No desktop layout
- Must be installable as PWA
- Fast interaction (POS must feel instant)

---

## Application Modes

### 1. POS Mode (Cashier Screen)
- Fullscreen
- NO SIDEBAR
- Optimized for speed

Layout:
- Search Bar
- Product Grid
- Cart Panel
- Checkout Button

---

### 2. Back Office Mode
- Uses sidebar navigation

---

## Sidebar Menu Structure

- Dashboard
- POS
- Catalog
  - Products
  - Categories
- Inventory
  - Stock
  - Stock Movements
- Sales
  - Transactions
  - Reports
- Operations
  - Shifts
  - Outlets
- Customers
- Settings
- Profile
- Logout

---

## Modules

### Authentication
- Login
- Logout
- Role-based access

### POS
- Product search
- Add to cart
- Discount
- Tax
- Payment methods
- Split payment
- Receipt

### Products
- CRUD
- SKU
- Barcode
- Cost & selling price
- Stock

### Inventory
- Stock in/out
- Adjustment
- History

### Transactions
- History
- Refund / void

### HPP / COGS
- Track cost price
- Profit calculation
- Profit reports

### Reports
- Sales
- Revenue
- Profit
- Top products

### Customers
- CRUD
- Purchase history

### Outlet
- Multi outlet
- Stock per outlet

### Shift
- Open/close shift
- Cash tracking

### Settings
- Tax
- Receipt
- Store info

---

## PWA Requirements
- Installable
- Offline ready
- Fast loading

---

## Final Goal
Production-ready POS SaaS system for mobile & tablet.
