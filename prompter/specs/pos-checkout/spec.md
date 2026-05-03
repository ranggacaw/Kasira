# pos-checkout Specification

## Purpose
TBD - created by archiving change add-pos-checkout. Update Purpose after archive.
## Requirements
### Requirement: Protected POS Checkout Workspace
Kasira SHALL provide an authenticated POS workspace at `/pos` with dedicated checkout and success flows that allow staff to create sales from available products without using the back-office sidebar.

#### Scenario: Authenticated staff opens the POS workspace
- **WHEN** an authenticated user visits `/pos`
- **THEN** the application shows the POS workspace in its dedicated cashier layout

#### Scenario: Guest requests the POS workspace
- **WHEN** an unauthenticated visitor requests `/pos`
- **THEN** the visitor is redirected to sign in before the POS workspace is shown

#### Scenario: Staff completes a sale
- **WHEN** a cashier submits a valid checkout from the POS workspace
- **THEN** the application completes the sale and makes a transaction success view available at `/pos/success/{transaction}`

### Requirement: Cart Total Calculation
Kasira SHALL calculate subtotal, discount, tax, optional service charge, grand total, and cash change from cart line items before a sale is completed.

#### Scenario: Cashier updates cart adjustments
- **WHEN** a cashier adds or changes products, quantities, discount, tax, or service charge
- **THEN** the checkout summary reflects the updated subtotal and final total

#### Scenario: Cashier enters a cash payment amount
- **WHEN** a cashier records a paid amount greater than or equal to the grand total for a cash payment
- **THEN** the checkout summary reflects the change due to the customer

### Requirement: Manual Payment Method Capture
Kasira SHALL allow manual payment capture for completed checkout transactions using Cash, QRIS, Bank Transfer, Debit Card, Credit Card, or E-Wallet methods.

#### Scenario: Cashier completes a sale with a supported manual payment method
- **WHEN** a cashier submits a valid checkout using one of the supported manual payment methods
- **THEN** the transaction records the selected method and any required reference data

### Requirement: Transaction Persistence
Kasira SHALL persist completed sales as transactions with their sold items and finalized monetary values.

#### Scenario: Valid checkout is submitted
- **WHEN** a checkout request passes validation
- **THEN** the application saves the transaction header, its line items, and the selected payment record

#### Scenario: Invalid checkout is submitted
- **WHEN** a checkout request is missing required cart or payment data
- **THEN** the application rejects the sale and does not create partial transaction records

### Requirement: Mobile and Tablet POS Layout
Kasira SHALL render POS as a full-screen touch-first workspace for mobile phones and tablets without using the back-office sidebar, using a floating or drawer cart on phone-sized viewports and a persistent split cart panel on tablet-sized viewports.

#### Scenario: Cashier uses POS on mobile
- **WHEN** a cashier opens the POS workspace on a phone-sized viewport
- **THEN** the application shows a touch-friendly product grid with a category scroller, floating cart access, and a cart drawer optimized for bottom reach

#### Scenario: Cashier uses POS on tablet
- **WHEN** a cashier opens the POS workspace on a tablet-sized viewport
- **THEN** the application shows a split layout with product browsing on one side and the cart summary on the other side

#### Scenario: Cashier uses POS in standalone mode
- **WHEN** a cashier launches the installed PWA into the POS workspace on a phone or tablet
- **THEN** the header, cart controls, and checkout actions respect standalone safe areas and remain reachable without relying on the back-office shell

### Requirement: Draft Order Handling
Kasira SHALL allow staff to hold an in-progress cart as a draft order and resume it later before payment.

#### Scenario: Cashier holds an order
- **WHEN** a cashier saves an in-progress cart instead of completing payment
- **THEN** the application stores the order as a draft that can be resumed later

#### Scenario: Cashier resumes a draft order
- **WHEN** a cashier selects a saved draft order
- **THEN** the application restores the draft items and adjustments into the POS workspace for continued checkout

### Requirement: Premium POS Workspace Ergonomics
Kasira SHALL present the POS checkout workspace using the Anvil Premium POS ergonomic model with tactile product cards, category chips, strong total hierarchy, and a clearly anchored payment action zone.

#### Scenario: Cashier opens checkout on a tablet or terminal
- **WHEN** an authenticated cashier opens the POS workspace
- **THEN** the page presents product browsing, cart review, and charge actions using the premium tactile layout described by the design model

#### Scenario: Cashier updates the active sale
- **WHEN** a cashier adjusts quantities, pricing inputs, or payment details
- **THEN** the current sale remains visually prioritized through the workspace's totals hierarchy and action placement

### Requirement: Premium Receipt Handoff Presentation
Kasira SHALL surface post-payment receipt actions through a premium success and receipt-handoff experience that clearly emphasizes print, share, download, and next-sale actions.

#### Scenario: Cashier completes checkout
- **WHEN** a sale is successfully charged
- **THEN** the resulting success experience presents the receipt handoff options using the shared premium component language

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

### Requirement: POS Product Search And Category Browsing
Kasira SHALL let cashier users narrow sellable products during checkout by search text and category without leaving the dedicated POS workspace.

#### Scenario: Cashier searches for a product
- **WHEN** a cashier enters product name, SKU, or barcode text in the POS search field
- **THEN** the product grid updates to show only matching sellable products for the active outlet

#### Scenario: Cashier combines search and category filters
- **WHEN** a cashier chooses a category while a search query is active
- **THEN** the POS product grid keeps both filters applied until the cashier changes or clears them

