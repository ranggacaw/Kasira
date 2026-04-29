## 1. Foundation
- [x] 1.1 Map `docs/design-model.md` into shared Tailwind theme extensions, CSS variables, typography loading, and base interaction utilities.
- [x] 1.2 Introduce or refactor shared layout and presentation primitives for shells, cards, buttons, inputs, badges, filters, and list states.

## 2. Public and Auth Surfaces
- [x] 2.1 Redesign the public landing page to match the Anvil Premium POS brand, type hierarchy, spacing rhythm, and primary CTA treatment.
- [x] 2.2 Redesign authentication and profile-facing forms so they use the shared token system, persistent labels, tactile focus states, and premium card treatment.

## 3. Protected Shells
- [x] 3.1 Redesign the back-office shell with the Anvil navigation, tonal layers, responsive drawer behavior, and consistent page-header patterns.
- [x] 3.2 Redesign the dedicated POS shell using the premium cashier presentation model, including clear action zones and touch-first framing.

## 4. Workflow Pages
- [x] 4.1 Redesign dashboard analytics using premium KPI cards, trend sections, and secondary insight panels for mobile/tablet operation.
- [x] 4.2 Redesign products, categories, and inventory pages with tactile cards, list/detail editing, persistent labels, and sticky save actions.
- [x] 4.3 Redesign POS checkout and success flows with category chips, premium product cards, clearer totals hierarchy, and receipt-handoff presentation.
- [x] 4.4 Redesign transaction history, receipt detail, reporting, and settings pages so they share one cohesive premium workflow language.

## 5. Validation
- [x] 5.1 Add or update frontend verification for shared shells and key responsive POS/back-office layouts using the repo's existing test strategy.
- [x] 5.2 Run relevant automated tests and `npm run build` after the redesign changes land.
- [x] 5.3 Perform manual responsive QA across phone, tablet, and desktop widths for the public shell, auth, POS, and back-office workflows.
