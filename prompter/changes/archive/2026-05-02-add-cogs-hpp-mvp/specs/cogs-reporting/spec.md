## ADDED Requirements
### Requirement: COGS Summary Reporting Workspace
Kasira SHALL provide an authenticated COGS / HPP reporting workspace at `/reports/cogs` for users who can view reports, using immutable transaction item snapshots as the reporting source of truth.

#### Scenario: Report user opens the COGS workspace
- **WHEN** an owner, admin, or manager visits `/reports/cogs`
- **THEN** the application returns summary metrics for revenue, COGS, gross profit, gross margin, transaction count, and average transaction value for the active filter context

### Requirement: COGS Report Filtering
Kasira SHALL allow the COGS workspace to be filtered by date range, outlet, cashier, category, product, and payment method before loading summary and detail results.

#### Scenario: Report user narrows the COGS dataset
- **WHEN** an authorized report user applies one or more supported COGS filters
- **THEN** the workspace refreshes its summary metrics and profitability tables using only the matching transaction snapshot records

### Requirement: Product Profitability Reporting
Kasira SHALL provide a product profitability view derived from transaction item snapshots so report users can compare product performance without relying on current catalog prices.

#### Scenario: Report user reviews product profitability
- **WHEN** an authorized report user opens the product profitability section of the COGS workspace
- **THEN** the application returns product-level quantity sold, revenue, COGS, gross profit, gross margin, average selling price, and average cost price calculated from the matching transaction item snapshots

#### Scenario: Report user changes the product sort order
- **WHEN** an authorized report user requests a supported profitability sort such as highest revenue, highest profit, lowest profit, highest margin, lowest margin, most sold, or least sold
- **THEN** the product profitability results are reordered according to that selection
