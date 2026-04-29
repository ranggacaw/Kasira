# Mobile & Tablet PWA POS Application Specification

## Project Goal

Build a modern Point of Sale application inspired by common POS products such as Qasir POS and Moka POS, but focused only on **mobile and tablet PWA usage**.

This application is not designed for desktop or computer users.

## Tech Stack

- Backend: Laravel
- Frontend: Inertia.js + React.js
- UI: shadcn/ui + Tailwind CSS
- Database: PostgreSQL
- Authentication: Laravel Breeze / Laravel Fortify
- Authorization: Spatie Laravel Permission
- PWA: Vite PWA
- Charts: Recharts
- Tables: TanStack Table
- Forms: React Hook Form + Zod
- Date: date-fns
- Icons: Lucide React

---

# Main UX Rules

## Device Target

The app must be optimized for:

- Mobile phones
- Tablets
- Android POS devices
- iPad / tablet browsers

The app must not prioritize desktop layout.

## Layout Rules

### POS View

The POS cashier screen must not use a sidebar.

The POS view should use:

- Full-screen mobile/tablet layout
- Bottom navigation or top segmented tabs
- Product grid
- Cart drawer / cart panel
- Fast checkout button
- Large touch-friendly buttons

### Back Office / Master Data View

All non-POS pages should use a sidebar layout.

Because the app is mobile/tablet only, the sidebar must behave as:

- Drawer sidebar on mobile
- Collapsible sidebar on tablet
- Opened by hamburger button
- Closed after menu selection on mobile

The sidebar is used for:

- Dashboard
- Master Data
- Products
- Categories
- Inventory
- Customers
- Employees
- Reports
- Settings

---

# Application Roles

## Owner

Can access all modules.

## Admin

Can manage products, inventory, employees, and reports.

## Cashier

Can only access POS, transactions, shift, and receipt.

## Manager

Can access reports, inventory, and operational monitoring.

---

# Main Navigation Structure

```txt
POS
Dashboard
Master Data
  - Products
  - Categories
  - Units
  - Modifiers
  - Discounts
  - Taxes
Inventory
  - Stock Overview
  - Stock In
  - Stock Out
  - Stock Adjustment
  - Stock Movement History
Transactions
  - Sales History
  - Refunds
  - Draft Orders
Customers
Employees
Outlets
Reports
Settings
```

---

# Module 1: Authentication

## Features

- Login
- Logout
- Forgot password
- Reset password
- User session
- Role-based redirect

## Login Behavior

After login:

- Cashier redirects to `/pos`
- Owner/Admin redirects to `/dashboard`

---

# Module 2: Dashboard

## Purpose

Show business performance summary.

## Features

- Today sales
- Today transactions
- Average order value
- Top-selling products
- Low stock products
- Sales chart
- Payment method summary
- Outlet filter
- Date filter

## Pages

```txt
/dashboard
```

## UI Components

- Summary cards
- Sales chart
- Top product list
- Low stock alert
- Date range picker
- Outlet selector

---

# Module 3: POS / Cashier

## Purpose

Fast sales transaction screen for cashier.

## Important Rule

POS screen must not use sidebar.

## Pages

```txt
/pos
/pos/checkout
/pos/success/{transaction}
```

## POS Screen Layout

### Mobile

- Header:
  - Outlet name
  - Cashier name
  - Search icon
  - Cart icon
- Category horizontal scroll
- Product grid
- Floating cart button
- Cart drawer from bottom

### Tablet

- Left area:
  - Category tabs
  - Product grid
- Right area:
  - Cart panel
  - Checkout summary

## Features

- Search product
- Filter by category
- Add product to cart
- Increase/decrease quantity
- Remove item
- Add item note
- Apply discount
- Apply tax
- Choose payment method
- Cash payment with change calculation
- QRIS/manual digital payment
- Bank transfer/manual payment
- Save transaction
- Print receipt
- Share receipt
- Hold order / draft order
- Resume draft order

## Cart Calculation

```txt
Subtotal = sum(product_price * quantity)
Discount = fixed amount or percentage
Tax = percentage from taxable amount
Service Charge = optional percentage/fixed
Grand Total = Subtotal - Discount + Tax + Service Charge
Change = Paid Amount - Grand Total
```

## Payment Methods

- Cash
- QRIS
- Bank Transfer
- Debit Card
- Credit Card
- E-Wallet
- Split Payment

## Transaction Status

- draft
- paid
- cancelled
- refunded
- partially_refunded

---

# Module 4: Products

## Purpose

Manage items sold in POS.

## Pages

```txt
/products
/products/create
/products/{id}/edit
/products/{id}
```

## Fields

```txt
id
outlet_id
category_id
unit_id
name
sku
barcode
description
image
cost_price
selling_price
stock_tracking_enabled
minimum_stock
is_active
created_at
updated_at
```

## Features

- Product list
- Product search
- Filter by category
- Create product
- Edit product
- Delete product
- Activate/deactivate product
- Upload product image
- Set selling price
- Set cost price
- Set stock tracking
- Set minimum stock alert
- Barcode field
- SKU auto-generate option

## UI Rules

- Product list must use mobile card layout
- Tablet may use compact table/card hybrid
- Create/edit form should use bottom sticky save button

---

# Module 5: Categories

## Purpose

Group products.

## Pages

```txt
/categories
/categories/create
/categories/{id}/edit
```

## Fields

```txt
id
outlet_id
name
description
color
sort_order
is_active
```

## Features

- Create category
- Edit category
- Delete category
- Sort category
- Set active/inactive
- Category color for POS display

---

# Module 6: Units

## Purpose

Define product units.

## Examples

- pcs
- box
- cup
- bottle
- pack
- kg
- gram
- liter

## Pages

```txt
/units
/units/create
/units/{id}/edit
```

## Fields

```txt
id
name
short_name
description
```

---

# Module 7: Inventory

## Purpose

Track product stock movement.

## Pages

```txt
/inventory
/inventory/stock-in
/inventory/stock-out
/inventory/adjustment
/inventory/movements
```

## Features

- Stock overview
- Stock in
- Stock out
- Stock adjustment
- Stock movement history
- Low stock alert
- Inventory valuation
- Filter by outlet
- Filter by product
- Filter by movement type

## Stock Movement Types

```txt
stock_in
stock_out
sale
refund
adjustment
transfer_in
transfer_out
damage
expired
```

## Stock Movement Fields

```txt
id
outlet_id
product_id
type
quantity
before_stock
after_stock
reference_type
reference_id
notes
created_by
created_at
```

---

# Module 8: Transactions

## Purpose

Store all sales activity.

## Pages

```txt
/transactions
/transactions/{id}
/transactions/{id}/receipt
/transactions/{id}/refund
```

## Features

- Transaction list
- Transaction detail
- Filter by date range
- Filter by cashier
- Filter by outlet
- Filter by payment method
- Filter by transaction status
- Print receipt
- Share receipt
- Refund transaction
- Export report

## Transaction Fields

```txt
id
transaction_number
outlet_id
cashier_id
customer_id
subtotal
discount_total
tax_total
service_charge_total
grand_total
paid_amount
change_amount
status
notes
paid_at
created_at
updated_at
```

## Transaction Item Fields

```txt
id
transaction_id
product_id
product_name
sku
quantity
unit_price
cost_price
discount_amount
tax_amount
subtotal
notes
```

---

# Module 9: Payments

## Purpose

Handle payment records for each transaction.

## Features

- Single payment
- Split payment
- Cash payment
- Manual QRIS payment
- Manual bank transfer payment
- Payment status tracking

## Payment Fields

```txt
id
transaction_id
method
amount
reference_number
status
paid_at
created_at
```

## Payment Status

```txt
pending
paid
failed
cancelled
refunded
```

---

# Module 10: Discounts

## Purpose

Create reusable discounts for products or transactions.

## Pages

```txt
/discounts
/discounts/create
/discounts/{id}/edit
```

## Discount Types

- Fixed amount
- Percentage

## Fields

```txt
id
name
type
value
minimum_purchase
start_date
end_date
is_active
```

---

# Module 11: Taxes & Service Charges

## Purpose

Configure tax and service fee.

## Pages

```txt
/taxes
/service-charges
```

## Fields

```txt
id
name
type
value
is_default
is_active
```

## Type

```txt
percentage
fixed
```

---

# Module 12: Customers

## Purpose

Store customer information and purchase history.

## Pages

```txt
/customers
/customers/create
/customers/{id}
```

## Fields

```txt
id
name
phone
email
address
birthdate
notes
created_at
updated_at
```

## Features

- Customer list
- Customer detail
- Purchase history
- Customer notes
- Optional membership level

---

# Module 13: Employees

## Purpose

Manage users, roles, and permissions.

## Pages

```txt
/employees
/employees/create
/employees/{id}/edit
```

## Features

- Create employee
- Assign role
- Assign outlet
- Activate/deactivate employee
- Reset password
- Manage permissions

## Employee Fields

```txt
id
name
email
phone
role
outlet_id
is_active
```

---

# Module 14: Shifts

## Purpose

Track cashier working sessions.

## Pages

```txt
/shifts
/shifts/open
/shifts/current
/shifts/{id}/close
```

## Features

- Open shift
- Input opening cash
- Close shift
- Input closing cash
- Expected cash calculation
- Cash difference
- Shift sales summary

## Shift Fields

```txt
id
outlet_id
cashier_id
opening_cash
closing_cash
expected_cash
cash_difference
opened_at
closed_at
status
```

---

# Module 15: Outlets

## Purpose

Support multi-branch businesses.

## Pages

```txt
/outlets
/outlets/create
/outlets/{id}/edit
```

## Fields

```txt
id
name
code
phone
address
city
province
postal_code
is_active
```

## Features

- Create outlet
- Edit outlet
- Delete outlet
- Assign employees to outlet
- View outlet-specific reports
- Product and stock per outlet

---

# Module 16: Reports

## Purpose

Provide business insights.

## Pages

```txt
/reports/sales
/reports/products
/reports/inventory
/reports/payments
/reports/cashier
/reports/profit-loss
```

## Report Types

### Sales Report

- Total sales
- Total transactions
- Average order value
- Sales by date
- Sales by outlet
- Sales by cashier

### Product Report

- Top-selling products
- Slow-moving products
- Product sales by category

### Inventory Report

- Current stock
- Low stock
- Stock movement
- Inventory valuation

### Payment Report

- Sales by payment method
- Cash total
- QRIS total
- Bank transfer total

### Profit & Loss Report

```txt
Revenue
- Cost of Goods Sold
= Gross Profit
- Discounts
- Operational Cost
= Net Profit
```

---

# Module 17: Receipt

## Purpose

Generate customer receipt.

## Receipt Data

```txt
Outlet name
Outlet address
Transaction number
Date and time
Cashier name
Items
Subtotal
Discount
Tax
Service charge
Grand total
Payment method
Paid amount
Change amount
Thank you message
```

## Features

- Print receipt
- Share receipt
- Download receipt PDF
- Thermal printer ready layout
- 58mm and 80mm layout options

---

# Module 18: Settings

## Pages

```txt
/settings/business
/settings/receipt
/settings/payment-methods
/settings/pwa
/settings/security
```

## Business Settings

- Business name
- Logo
- Phone
- Address
- Currency
- Timezone

## Receipt Settings

- Receipt header
- Receipt footer
- Show logo
- Show cashier name
- Show customer name
- Paper size

## Payment Settings

- Enable cash
- Enable QRIS
- Enable bank transfer
- Enable card payment
- Enable e-wallet

## PWA Settings

- App name
- App short name
- Theme color
- Icon
- Splash screen

---

# PWA Requirements

## Features

- Installable on Android and iOS
- Mobile-first UI
- Tablet-friendly layout
- App manifest
- Service worker
- Offline fallback page
- Cache static assets
- Optional offline draft transaction
- Responsive touch-friendly interface

## PWA Routes

```txt
/pos
/dashboard
/products
/transactions
/inventory
/reports
/settings
```

## Offline Behavior

Minimum requirement:

- User can open app shell offline
- User can see offline notice
- User cannot sync unpaid transaction without internet unless offline transaction mode is enabled

Advanced requirement:

- Save draft transactions locally
- Sync when internet is restored
- Prevent duplicate transaction sync

---

# Database Tables

## Required Tables

```txt
users
outlets
categories
units
products
product_stocks
stock_movements
customers
transactions
transaction_items
payments
discounts
taxes
service_charges
shifts
settings
roles
permissions
model_has_roles
model_has_permissions
role_has_permissions
```

---

# Suggested Laravel Models

```txt
User
Outlet
Category
Unit
Product
ProductStock
StockMovement
Customer
Transaction
TransactionItem
Payment
Discount
Tax
ServiceCharge
Shift
Setting
```

---

# Suggested Controllers

```txt
DashboardController
POSController
ProductController
CategoryController
UnitController
InventoryController
TransactionController
PaymentController
CustomerController
EmployeeController
OutletController
ReportController
ShiftController
SettingController
ReceiptController
```

---

# Suggested React Pages

```txt
resources/js/Pages/Auth/Login.tsx
resources/js/Pages/Dashboard/Index.tsx

resources/js/Pages/POS/Index.tsx
resources/js/Pages/POS/Checkout.tsx
resources/js/Pages/POS/Success.tsx

resources/js/Pages/Products/Index.tsx
resources/js/Pages/Products/Create.tsx
resources/js/Pages/Products/Edit.tsx
resources/js/Pages/Products/Show.tsx

resources/js/Pages/Categories/Index.tsx
resources/js/Pages/Inventory/Index.tsx
resources/js/Pages/Transactions/Index.tsx
resources/js/Pages/Transactions/Show.tsx
resources/js/Pages/Customers/Index.tsx
resources/js/Pages/Employees/Index.tsx
resources/js/Pages/Outlets/Index.tsx
resources/js/Pages/Reports/Index.tsx
resources/js/Pages/Settings/Index.tsx
```

---

# Layout Components

## POSLayout

Used only for POS-related pages.

```txt
POSLayout
- MobileHeader
- CategoryTabs
- ProductGrid
- CartDrawer
- CheckoutButton
```

## AppLayout

Used for back-office/master data pages.

```txt
AppLayout
- TopBar
- SidebarDrawer
- MainContent
- BottomSafeArea
```

---

# shadcn/ui Components to Use

```txt
Button
Card
Input
Textarea
Select
Dialog
Sheet
Drawer
Tabs
Badge
DropdownMenu
AlertDialog
Calendar
Popover
Table
Toast
```

---

# Mobile UI Rules

## General

- Minimum button height: 44px
- Bottom sticky action button on forms
- Use cards instead of wide tables on mobile
- Use drawer for filters
- Use sheet for sidebar
- Use dialog only when necessary
- Avoid hover-only interactions
- All critical actions must be thumb-friendly

## POS

- Product card must be large enough for touch
- Cart button must be sticky/floating
- Checkout button must be fixed at bottom
- Quantity controls must be large
- Payment buttons must be easy to tap

---

# API / Route Design

## Web Routes

```txt
GET /dashboard
GET /pos
POST /pos/cart
POST /transactions
GET /transactions
GET /transactions/{transaction}
POST /transactions/{transaction}/refund

GET /products
GET /products/create
POST /products
GET /products/{product}/edit
PUT /products/{product}
DELETE /products/{product}

GET /categories
POST /categories
PUT /categories/{category}
DELETE /categories/{category}

GET /inventory
POST /inventory/stock-in
POST /inventory/stock-out
POST /inventory/adjustment

GET /reports/sales
GET /reports/products
GET /reports/inventory

GET /settings
PUT /settings/business
PUT /settings/receipt
```

---

# Development Phases

## Phase 1: MVP

Build these first:

```txt
Authentication
Dashboard
POS
Products
Categories
Transactions
Payments
Basic Inventory
Receipt
Settings
```

## Phase 2: Operational Features

```txt
Outlets
Employees
Roles & Permissions
Shifts
Reports
Stock Adjustment
Discounts
Taxes
Service Charges
```

## Phase 3: Advanced Features

```txt
PWA offline mode
Thermal printer support
Customer membership
Split payment
Refund system
QRIS integration
Export Excel/PDF
Multi-outlet reporting
```

---

# Acceptance Criteria

## POS

- Cashier can create a paid transaction from mobile/tablet.
- Cashier can add products to cart.
- Cashier can calculate cash change.
- Cashier can select payment method.
- Stock decreases automatically after successful payment.
- Receipt can be viewed after transaction.

## Product

- Admin can create, edit, delete, and deactivate product.
- Product appears in POS when active.
- Product stock can be tracked.

## Inventory

- Stock movement is recorded for every sale.
- Admin can manually add or reduce stock.
- Low stock products appear in dashboard.

## Transactions

- Owner can view transaction history.
- Owner can filter by date, cashier, outlet, and payment method.
- Owner can view transaction detail.

## PWA

- App can be installed on mobile.
- App has manifest and service worker.
- App layout works properly on mobile and tablet.
- Desktop layout is not required.

---

# AI Coding Instruction

Build this project as a production-ready Laravel + Inertia React POS PWA.

Important requirements:

1. Use Laravel for backend.
2. Use Inertia.js with React for frontend.
3. Use shadcn/ui and Tailwind CSS for UI.
4. Use PostgreSQL as database.
5. Build mobile-first and tablet-first layouts only.
6. Do not prioritize desktop layout.
7. POS page must not use sidebar.
8. POS page must use a full-screen cashier layout.
9. Back-office pages must use sidebar drawer layout.
10. Use role-based access control.
11. Use clean database migrations.
12. Use service classes for business logic.
13. Use form request validation.
14. Use policies for authorization.
15. Use reusable React components.
16. Use responsive mobile card layouts.
17. Make the application PWA installable.
18. Keep code clean, scalable, and SaaS-ready.

---

# Suggested First Build Order

```txt
1. Install Laravel + Inertia React
2. Install Tailwind CSS
3. Install shadcn/ui
4. Configure PostgreSQL
5. Install authentication
6. Install Spatie Permission
7. Create database migrations
8. Create models and relationships
9. Create AppLayout and POSLayout
10. Build Products module
11. Build Categories module
12. Build POS module
13. Build Transactions module
14. Build Inventory stock movement
15. Build Dashboard
16. Build Receipt
17. Add PWA support
```

---

# Product Positioning

This application is a mobile-first and tablet-first POS PWA for small and medium businesses.

It helps business owners:

- Sell faster
- Manage products
- Track inventory
- Monitor sales
- Manage employees
- View business reports
- Use the app from mobile or tablet without installing from app stores
