## MODIFIED Requirements
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

## ADDED Requirements
### Requirement: Mobile and Tablet POS Layout
Kasira SHALL render POS using a full-screen touch layout with product browsing and cart access optimized for mobile phones and tablets.

#### Scenario: Cashier uses POS on mobile
- **WHEN** a cashier opens the POS workspace on a phone-sized viewport
- **THEN** the application shows a touch-friendly product grid with a category scroller, floating cart access, and a cart drawer optimized for bottom reach

#### Scenario: Cashier uses POS on tablet
- **WHEN** a cashier opens the POS workspace on a tablet-sized viewport
- **THEN** the application shows a split layout with product browsing on one side and the cart summary on the other side

### Requirement: Draft Order Handling
Kasira SHALL allow staff to hold an in-progress cart as a draft order and resume it later before payment.

#### Scenario: Cashier holds an order
- **WHEN** a cashier saves an in-progress cart instead of completing payment
- **THEN** the application stores the order as a draft that can be resumed later

#### Scenario: Cashier resumes a draft order
- **WHEN** a cashier selects a saved draft order
- **THEN** the application restores the draft items and adjustments into the POS workspace for continued checkout
