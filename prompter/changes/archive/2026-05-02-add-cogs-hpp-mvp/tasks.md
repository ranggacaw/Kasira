## 1. Data Model
- [x] 1.1 Add product margin-threshold fields, default margin settings, transaction item snapshot/profit columns, and a `product_cost_histories` table with legacy transaction-item backfill.
- [x] 1.2 Update models, casts, and relationships so products, transaction items, settings, and cost history records expose the new data consistently.

## 2. Catalog And Settings
- [x] 2.1 Extend product create and update workflows to capture margin thresholds, show estimated profit and margin feedback, and surface low-margin warnings before save.
- [x] 2.2 Record a product cost history entry whenever an existing product's cost price changes.
- [x] 2.3 Add a settings workflow for the default minimum product margin percentage used when a product does not define its own override.

## 3. Checkout And Transaction Review
- [x] 3.1 Remove cost and profitability data from the POS workspace payload and UI while keeping server-side totals authoritative.
- [x] 3.2 Persist immutable transaction item snapshots for product name, selling price, cost price, subtotal revenue, subtotal cost, gross profit, and gross margin during checkout.
- [x] 3.3 Update transaction detail and receipt review surfaces so owner, admin, and manager users can review profitability snapshots while cashier users cannot see cost or gross profit fields.

## 4. Reporting
- [x] 4.1 Add a dedicated `/reports/cogs` workflow with outlet-aware summary metrics and filters for date range, cashier, category, product, and payment method.
- [x] 4.2 Add a product profitability view sorted from transaction snapshot data, including quantity sold, revenue, COGS, gross profit, gross margin, and average selling and cost prices.

## 5. Validation
- [x] 5.1 Add or update feature tests for product cost history, low-margin warnings, immutable checkout snapshots, cashier-safe visibility, and COGS reporting filters.
- [x] 5.2 Run `php artisan test` and the relevant frontend verification command for touched report and catalog surfaces.
