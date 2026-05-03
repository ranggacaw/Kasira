## 1. Implementation
- [x] 1.1 Update `AuthenticatedLayout` and `AppSidebar` to support grouped, role-filtered back-office navigation that matches the documented menu structure while reusing existing consolidated module routes.
- [x] 1.2 Extend POS checkout filtering so the cashier search bar narrows products by name, SKU, or barcode alongside category selection.
- [x] 1.3 Add customer purchase history loading and transaction-detail linking inside the customer workflow.
- [x] 1.4 Add a separate transaction void workflow with cancelled-status filtering, stock restoration, and distinct audit handling from refunds.
- [x] 1.5 Add default tax settings persistence and prefill fresh POS sales from the saved rate while keeping sale-level edits available.
- [x] 1.6 Expand shift workflows to capture opening cash, counted closing cash, expected cash, cash difference, and shift sales summary for entitled plans.

## 2. Validation
- [x] 2.1 Add or update feature tests for navigation visibility, POS search, customer history, transaction voids, tax defaults, and shift reconciliation.
- [x] 2.2 Run `php artisan test`.
- [x] 2.3 Run `npm run build`.
