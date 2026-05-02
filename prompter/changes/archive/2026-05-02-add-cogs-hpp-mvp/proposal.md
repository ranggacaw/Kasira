# Change: Add COGS / HPP MVP workflows

## Why
Kasira already captures product cost and per-line unit cost, but it does not yet preserve immutable profitability snapshots or provide a dedicated COGS reporting workflow. That leaves profit analysis vulnerable to later product edits and prevents owners, admins, and managers from reviewing trustworthy HPP performance inside the current mobile-first app.

## What Changes
- Add an MVP COGS / HPP capability built on manual product cost prices only.
- Extend product administration with estimated profit and margin guidance, low-margin warnings, and cost change history.
- Persist immutable transaction item snapshots for selling price, cost price, subtotals, gross profit, and gross margin at checkout time.
- Add a dedicated `/reports/cogs` reporting workflow with summary metrics and product profitability analysis derived from transaction snapshots.
- Enforce cashier-safe visibility so POS and transaction review flows do not expose cost or profit data to cashier users.
- Leave average-cost, FIFO, supplier purchasing, category or outlet profitability breakdowns, and export formats out of this MVP.

## Impact
- Affected specs: `catalog-management`, `pos-checkout`, `transaction-history`, `settings-management`, `cogs-reporting`
- Affected code: product and transaction item schema, checkout persistence, product/settings forms, transaction detail views, reporting controllers/pages, and related feature tests
