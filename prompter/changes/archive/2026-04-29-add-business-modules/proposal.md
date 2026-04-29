# Change: Add business modules roadmap

## Why
Kasira currently delivers the application foundation and a protected POS checkout flow, but the broader operating modules described in `docs/add-module.md` are not yet specified for delivery. A single phased proposal is needed so catalog, inventory, reporting, organization, customer, and premium capabilities can be reviewed as one cohesive product direction while still being implemented incrementally.

## What Changes
- Add catalog management requirements for products and categories.
- Add inventory management requirements for stock movements and low-stock monitoring.
- Add transaction history requirements for searchable sales records beyond checkout persistence.
- Add dashboard analytics requirements for daily revenue, transaction counts, top-selling products, and alerting.
- Add outlet, user access, and customer membership requirements for business operations management.
- Add premium extension requirements for plan-gated features such as exports, profit reporting, promotions, shifts, connected receipts, and offline-ready operation.
- Document phased delivery so MVP modules land before premium SaaS extensions.

## Impact
- Affected specs: `catalog-management`, `inventory-management`, `transaction-history`, `dashboard-analytics`, `outlet-management`, `user-access-management`, `customer-membership`, `premium-extensions`
- Affected code: `routes/web.php`, `resources/js/Layouts/AuthenticatedLayout.jsx`, `resources/js/Pages/Dashboard.jsx`, `resources/js/Pages/Pos/Checkout.jsx`, `app/Http/Controllers/Pos/CheckoutController.php`, `app/Models/*.php`, `database/migrations/*.php`
