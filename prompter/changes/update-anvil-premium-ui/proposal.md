# Change: Apply the Anvil Premium POS design model across the full application

## Why
Kasira now has a broader protected product surface, but the current UI still mixes default Tailwind styling, dark utility-heavy layouts, and page-by-page visual decisions. The provided `docs/design-model.md` defines a clear premium POS visual language that should become the consistent design contract for public, auth, back-office, POS, receipt, report, and settings surfaces.

## What Changes
- Add a shared Anvil Premium POS visual design capability that turns `docs/design-model.md` into the application-wide source of truth for colors, typography, spacing, elevation, and interaction states.
- Redesign public landing and authentication surfaces so they match the premium retail presentation instead of the current starter-style look.
- Redesign the protected back-office shell, POS workspace, transaction review, and reporting surfaces so they use one tactile, rounded, touch-friendly design system with clearer hierarchy.
- Keep this as a separate design-focused change from `align-mobile-tablet-pwa-pos`, but treat that active change as a dependency for route naming and module coverage.

## Impact
- Affected specs: `bootstrap-application`, `pos-checkout`, `dashboard-analytics`, `catalog-management`, `transaction-history`, `premium-extensions`, `visual-design-system`
- Affected code: `tailwind.config.js`, `resources/css/app.css`, `resources/views/app.blade.php`, `resources/js/Layouts/**`, `resources/js/Pages/Auth/**`, `resources/js/Pages/Welcome.jsx`, `resources/js/Pages/Dashboard.jsx`, `resources/js/Pages/Pos/**`, `resources/js/Pages/Products/**`, `resources/js/Pages/Categories/**`, `resources/js/Pages/Inventory/**`, `resources/js/Pages/Transactions/**`, `resources/js/Pages/Premium/**`, `resources/js/Pages/Settings/**`, receipt views, shared UI components, and related frontend tests
