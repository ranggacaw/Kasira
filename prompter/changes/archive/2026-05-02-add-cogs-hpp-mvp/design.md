## Context
Kasira already has product-level `cost_price`, checkout persistence with `transaction_items.unit_cost`, report access for owner/admin/manager roles, and a shared `app_settings` record for business configuration. The requested COGS / HPP module adds cross-cutting behavior across catalog management, checkout persistence, transaction review, settings, and reporting.

## Goals / Non-Goals
- Goals:
- Add trustworthy MVP profitability reporting using immutable transaction item snapshots.
- Keep the costing source simple by using manual product cost only.
- Prevent cashier-facing POS and receipt review flows from exposing cost or gross profit data.
- Add low-margin guidance during product editing without introducing a complex permission system.
- Non-Goals:
- Average-cost or FIFO inventory costing.
- Purchase-order or supplier workflows.
- Category, outlet, or payment profitability reports beyond the existing generic reporting surfaces.
- CSV, Excel, or PDF exports for the new COGS report in this change.
- Manager-specific override permissions beyond the existing role model.

## Decisions
- Decision: Use manual product `cost_price` as the only MVP COGS source.
  - Why: The existing catalog already stores manual cost price and the source document explicitly keeps average and FIFO costing for a later phase.
  - Alternatives considered: Implementing average cost now would require stock cost capture, recalculation rules, and historical reconciliation that are larger than the MVP scope.

- Decision: Add explicit snapshot columns to `transaction_items` instead of renaming the existing `unit_price`, `unit_cost`, and `subtotal` fields.
  - Why: The current checkout, receipt, and tests already rely on the existing columns. Additive snapshot fields reduce migration risk while allowing dedicated report calculations and immutable product-name preservation.
  - Alternatives considered: Renaming current columns to snapshot-oriented names would create broader breaking changes across controllers, pages, and tests with little MVP value.

- Decision: Store cost change audits in a dedicated `product_cost_histories` table whenever an existing product's cost changes.
  - Why: Product edits need a minimal audit trail so future profitability questions can distinguish catalog maintenance from historical sales snapshots.
  - Alternatives considered: Relying only on transaction item snapshots would preserve sold-item history but would not explain why a product's current cost changed over time.

- Decision: Use a global default minimum margin in `app_settings` with an optional per-product override.
  - Why: The module spec calls for a default minimum margin while also recommending a product-level `minimum_margin` field. Combining both supports a simple default and a narrow override without adding a separate permission system.
  - Alternatives considered: A global-only threshold would be simpler but would not support products that intentionally operate at different target margins.

- Decision: Build the first dedicated profitability workflow at `/reports/cogs` and derive all metrics from transaction item snapshots.
  - Why: The current `/reports` page is a general premium-style overview, while this change needs a focused operational report with filters, summary cards, and product profitability detail that remain correct after product edits.
  - Alternatives considered: Extending only the existing `/reports` overview would bury the workflow and make its acceptance criteria harder to test independently.

## Risks / Trade-offs
- Denormalized snapshot columns duplicate price data, but they make historical profitability stable and queryable.
- Backfilling old `transaction_items` from existing `unit_price`, `unit_cost`, `subtotal`, and related product names will preserve most historical accuracy, but rows tied to later-renamed products will only reflect the name available during migration.
- Adding per-product threshold overrides introduces one more field in the product form, but it avoids forcing every category to share the same margin rule.

## Migration Plan
1. Add new nullable snapshot and margin-threshold columns plus the `product_cost_histories` table.
2. Backfill existing transaction items from current pricing columns so the new reports can operate on legacy sales.
3. Backfill the default margin setting to `20` and leave product-level overrides nullable.
4. Update application flows to write new snapshot and audit data for all future edits and checkouts.

## Open Questions
- None. This proposal intentionally follows the source document's MVP scope and defers average/FIFO costing, exports, and advanced profitability slices to later proposals.
