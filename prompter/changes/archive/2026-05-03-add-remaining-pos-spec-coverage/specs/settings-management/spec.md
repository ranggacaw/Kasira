## ADDED Requirements
### Requirement: Checkout Tax Defaults
Kasira SHALL allow authorized settings users to configure a default checkout tax rate used when new POS sales begin.

#### Scenario: Authorized user updates the default tax rate
- **WHEN** an authorized settings user saves a valid default tax percentage
- **THEN** the application stores the value for subsequent checkout and receipt calculations

#### Scenario: Cashier starts a new sale
- **WHEN** a cashier opens a fresh POS sale after a default tax rate has been saved
- **THEN** the sale starts with the saved tax rate prefilled while still allowing per-sale changes before checkout is completed
