## 1. Catalog And Inventory Foundation
- [x] 1.1 Extend the product data model for category, cost price, stock quantity, image, and active status management while keeping checkout compatibility intact.
- [x] 1.2 Add authenticated product and category management pages, routes, validation, and feature tests for Owner and Admin access.
- [x] 1.3 Add stock movement recording, running stock balances, minimum stock thresholds, and tests covering stock in, stock out, and low-stock alert behavior.

## 2. Sales Visibility
- [x] 2.1 Add transaction history pages and filters for date range, cashier, outlet, and payment method with Laravel feature tests.
- [x] 2.2 Expand the dashboard with daily revenue, transaction totals, top-selling products, low-stock alerts, and sales chart data backed by tested server queries.
- [x] 2.3 Add receipt retrieval and reprint foundations needed by the transaction and checkout workflows.

## 3. Business Operations Administration
- [x] 3.1 Add outlet management with outlet-scoped product availability, stock ownership, and report segmentation.
- [x] 3.2 Add user administration, Manager role support, and role-aware access rules for cashier, admin, manager, and owner workflows.
- [x] 3.3 Add customer records and transaction association hooks that prepare the application for membership features.

## 4. Premium Extensions
- [x] 4.1 Add plan-aware feature gating for Starter, Pro, and Business entitlements.
- [x] 4.2 Add premium reporting capabilities for exports, COGS, and profit-and-loss views.
- [x] 4.3 Add premium commerce extensions for promotions, vouchers, cashier shifts, QRIS integrations, thermal printing, WhatsApp receipts, and offline-capable PWA support.
- [x] 4.4 Add subscription and billing management needed to enforce plan limits such as outlet and user counts.

## 5. Validation
- [x] 5.1 Run targeted Laravel feature tests for each delivered module slice.
- [x] 5.2 Run frontend build and any module-specific UI verification before shipping.
- [x] 5.3 Update project guidance if implementation introduces new enduring conventions.
