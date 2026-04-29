## Context
Kasira now provides a protected application shell with role-aware authentication, but there is no product catalog, no transaction schema, and no checkout UI. The project plan identifies POS checkout as the highest-priority MVP feature and expects discounts, tax/service fees, payment method capture, and transaction saving.

## Goals / Non-Goals
- Goals:
  - Deliver a working protected checkout flow for authenticated staff.
  - Support adding sellable products to a cart and calculating final totals.
  - Persist completed transactions and their line items.
  - Keep the implementation small enough to build before inventory CRUD and reporting.
- Non-Goals:
  - Product management screens.
  - Automatic stock deduction or stock movement creation.
  - Split payments, refunds, receipt printing, or customer/member records.

## Decisions
- Decision: Introduce only the minimum product fields required for checkout selection and price capture.
- Alternatives considered: Building the full catalog and inventory schema first. Rejected because it expands the checkout slice into a separate product-management project.
- Decision: Support one recorded payment method per sale in the first version.
- Alternatives considered: Split payment support. Rejected because it adds UI and accounting complexity not required by the MVP statement.
- Decision: Defer stock deduction even though checkout persists a sale.
- Alternatives considered: Coupling checkout to inventory updates immediately. Rejected to keep the first sales flow independent from the upcoming inventory change.

## Risks / Trade-offs
- Deferring stock updates means sales and stock will be temporarily disconnected. Mitigation: make the deferral explicit in the proposal and implement inventory linkage in the next change.
- Minimal product modeling may need extension later for categories, images, and cost fields. Mitigation: keep the initial schema additive and focused on current checkout needs.
- Totals logic can drift if duplicated between frontend and backend. Mitigation: compute authoritative totals server-side before persistence.

## Migration Plan
1. Add the minimal product, transaction, transaction item, and payment storage needed for checkout.
2. Seed a small sample product set for local verification.
3. Build the protected checkout page and transaction creation endpoint.
4. Validate totals and persist completed sales.
5. Cover the flow with feature tests.

## Open Questions
- Should Owner and Admin have the same checkout access as Cashier in the first version, or should checkout be role-restricted immediately?
- Should discount, tax, and service fee be percentage-based, fixed amounts, or a mix in the first release?
