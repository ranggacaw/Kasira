## ADDED Requirements
### Requirement: Protected POS Checkout Workspace
Kasira SHALL provide an authenticated checkout workspace for staff to create sales from available products.

#### Scenario: Authenticated staff opens checkout
- **WHEN** an authenticated user visits the checkout route
- **THEN** the application shows the POS checkout workspace

#### Scenario: Guest requests checkout
- **WHEN** an unauthenticated visitor requests the checkout route
- **THEN** the visitor is redirected to sign in before the checkout workspace is shown

### Requirement: Cart Total Calculation
Kasira SHALL calculate a checkout total from cart line items, discount, tax, and service fee inputs before a sale is completed.

#### Scenario: Cashier updates cart adjustments
- **WHEN** a cashier adds or changes products, quantities, discount, tax, or service fee
- **THEN** the checkout summary reflects the updated subtotal and final total

### Requirement: Manual Payment Method Capture
Kasira SHALL allow one manual payment method to be selected for each completed checkout transaction.

#### Scenario: Cashier completes a sale
- **WHEN** a cashier submits a valid checkout
- **THEN** the transaction records one manual payment method from Cash, QRIS, or Bank Transfer

### Requirement: Transaction Persistence
Kasira SHALL persist completed sales as transactions with their sold items and finalized monetary values.

#### Scenario: Valid checkout is submitted
- **WHEN** a checkout request passes validation
- **THEN** the application saves the transaction header, its line items, and the selected payment record

#### Scenario: Invalid checkout is submitted
- **WHEN** a checkout request is missing required cart or payment data
- **THEN** the application rejects the sale and does not create partial transaction records
