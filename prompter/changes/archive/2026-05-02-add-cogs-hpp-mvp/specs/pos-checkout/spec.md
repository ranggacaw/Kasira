## ADDED Requirements
### Requirement: Cashier-Safe POS Product Data
Kasira SHALL keep the POS workspace limited to sellable product data and MUST NOT expose cost price or profitability fields in the cashier-facing payload or interface.

#### Scenario: Staff opens the POS workspace
- **WHEN** an authenticated user loads the `/pos` checkout workflow
- **THEN** the returned product data and rendered POS interface include selling information needed for checkout but exclude cost price and gross margin values

### Requirement: Immutable COGS Transaction Snapshots
Kasira SHALL persist each completed sale item with immutable product name, selling price, cost price, subtotal revenue, subtotal cost, gross profit, and gross margin snapshots derived during checkout.

#### Scenario: Checkout stores profitability snapshots
- **WHEN** a valid checkout is completed
- **THEN** every persisted transaction item stores the item-level profitability snapshot values calculated from the product data used at the time of sale

#### Scenario: Later product edits do not change historical COGS
- **WHEN** a product's current selling price or cost price changes after a sale has been completed
- **THEN** existing transaction items retain their original snapshot values and downstream reports continue using those stored values
