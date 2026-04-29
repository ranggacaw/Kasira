## 1. Foundation and Navigation
- [x] 1.1 Add the Manager role to the seeded operational role model and implement role-aware post-login redirects.
- [x] 1.2 Replace the shared desktop-style authenticated shell with a mobile drawer/collapsible back-office shell and a dedicated POS shell with no sidebar.
- [x] 1.3 Align route families and page entry points with the target product surface: `/pos`, `/dashboard`, `/products`, `/categories`, `/inventory`, `/transactions`, `/reports`, and `/settings`.

## 2. MVP Workflow Alignment
- [x] 2.1 Update the dashboard to use outlet and date filters plus payment summaries, top products, low-stock alerts, and mobile/tablet card layouts.
- [x] 2.2 Update products, categories, and units to use outlet-aware administration, touch-friendly list/detail patterns, and sticky save actions on forms.
- [x] 2.3 Expand POS into a full-screen mobile/tablet workspace with category browsing, cart drawer or panel behavior, draft orders, payment capture, and receipt handoff.
- [x] 2.4 Expand transactions and inventory so status, movement history, low-stock behavior, receipt actions, and refund entry points match the updated product surface.

## 3. PWA, Receipt, and Settings
- [x] 3.1 Ship a supported manifest, service worker, and offline fallback experience for the protected application shell.
- [x] 3.2 Add receipt views and delivery actions for print, share, and download flows, with premium-only thermal or connected extensions layered separately.
- [x] 3.3 Add settings pages for business identity, receipt configuration, payment methods, and PWA appearance.

## 4. Premium and Advanced Extensions
- [x] 4.1 Update premium reporting to cover sales, product, inventory, payment, cashier, and profit-and-loss views with export support.
- [x] 4.2 Gate split payment, promotions, vouchers, cashier shifts, QRIS integration, thermal printing, and offline draft sync behind premium entitlements.

## 5. Validation
- [x] 5.1 Add or update Laravel feature tests for role redirects, access control, outlet scoping, and the renamed workflow routes.
- [x] 5.2 Add or update frontend verification for the mobile/tablet shell and POS layout behavior using the repo's existing test strategy.
- [x] 5.3 Run the relevant automated tests and `npm run build` before implementation is considered complete.
