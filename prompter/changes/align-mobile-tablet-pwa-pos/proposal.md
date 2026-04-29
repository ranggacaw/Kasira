# Change: Align Kasira with the mobile/tablet POS PWA specification

## Why
Kasira already has an MVP POS foundation, but its current route map, shared shell, and navigation model still reflect a desktop-oriented operations app with only partial PWA support. The requested product direction is different: a mobile/tablet-first POS, a dedicated cashier workspace with no sidebar, a touch-oriented back-office shell, formal installable PWA behavior, and a broader operational module map.

## What Changes
- Modify the existing app, access, outlet, POS, catalog, inventory, dashboard, transaction, and premium specs so they match a mobile/tablet-first information architecture.
- Add missing specs for the protected PWA shell, receipt delivery, and settings management so the requested behavior is captured explicitly instead of living only in partial implementation details.
- Introduce role-aware landing pages and a four-role operational model that distinguishes Owner, Admin, Manager, and Cashier workflows.
- Keep implementation staged so the shell and MVP workflows land first, while premium and advanced behavior such as split payments, offline draft sync, QRIS integration, and thermal printing remain explicitly sequenced.

## Impact
- Affected specs: `bootstrap-application`, `user-access-management`, `outlet-management`, `pos-checkout`, `catalog-management`, `inventory-management`, `transaction-history`, `dashboard-analytics`, `premium-extensions`, `pwa-shell`, `receipt-delivery`, `settings-management`
- Affected code: `routes/web.php`, `app/Http/Middleware/HandleInertiaRequests.php`, `app/Http/Controllers/**`, `resources/js/Layouts/AuthenticatedLayout.jsx`, `resources/js/Pages/Pos/Checkout.jsx`, `resources/js/Pages/Dashboard.jsx`, `resources/js/Pages/Catalog/Index.jsx`, `resources/js/Pages/Operations/Index.jsx`, `resources/js/Pages/Transactions/**`, `resources/js/app.jsx`, `resources/views/app.blade.php`, `public/manifest.webmanifest`, `public/sw.js`, related models, migrations, and feature tests
