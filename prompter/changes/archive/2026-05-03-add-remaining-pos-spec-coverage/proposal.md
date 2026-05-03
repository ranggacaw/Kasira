# Change: Add remaining POS specification coverage

## Why
Current Prompter specs already cover most of `docs/kasira-pos-spec.md`, but several user-facing behaviors are still only implied by broad requirements or left undocumented. Those remaining gaps affect cashier efficiency and back-office clarity: grouped sidebar navigation, POS product search coverage, customer purchase history, distinct transaction void handling, default tax settings, and concrete shift cash tracking.

## What Changes
- Add a grouped back-office navigation requirement that maps the documented mobile/tablet menu structure onto the existing sidebar shell without introducing a new desktop-first layout.
- Add explicit POS product search and category-browsing requirements for cashier checkout.
- Add customer purchase history requirements to the customer workflow.
- Add a distinct transaction void workflow requirement separate from refunds, including cancelled-sale visibility in history.
- Add default checkout tax settings requirements and a dedicated shift-management capability covering open/close cash tracking and shift reconciliation.

## Impact
- Affected specs: `pwa-shell`, `pos-checkout`, `customer-membership`, `transaction-history`, `settings-management`, `shift-management`
- Affected code: `resources/js/Components/AppSidebar.jsx`, `resources/js/Layouts/AuthenticatedLayout.jsx`, `resources/js/Pages/Pos/Checkout.jsx`, `resources/js/Pages/Operations/Index.jsx`, `resources/js/Pages/Transactions/Index.jsx`, `resources/js/Pages/Transactions/Show.jsx`, `resources/js/Pages/Settings/Index.jsx`, `app/Http/Controllers/OperationsController.php`, `app/Http/Controllers/TransactionController.php`, `app/Http/Controllers/SettingsController.php`, `app/Http/Controllers/PremiumController.php`, `app/Http/Controllers/Pos/CheckoutController.php`, `app/Models/Transaction.php`, `app/Models/CashierShift.php`, `app/Models/AppSetting.php`, related migrations, and feature tests
