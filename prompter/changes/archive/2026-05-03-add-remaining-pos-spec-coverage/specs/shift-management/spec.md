## ADDED Requirements
### Requirement: Cashier Shift Lifecycle
Kasira SHALL allow cashier-capable users on plans entitled for shift management to open one active shift per outlet with opening cash and close that shift with counted closing cash.

#### Scenario: Cashier opens a shift
- **WHEN** a cashier starts a shift for an outlet and enters opening cash
- **THEN** the application creates an open shift record with the cashier, outlet, opening cash, and opened timestamp

#### Scenario: Cashier closes a shift
- **WHEN** a cashier closes an active shift and enters counted closing cash
- **THEN** the application stores the closing cash, closed timestamp, and final shift status on that shift record

### Requirement: Shift Cash Reconciliation
Kasira SHALL calculate expected cash, cash difference, and shift sales summary for a closed shift from the transactions linked to that shift.

#### Scenario: Cashier closes a shift after taking sales
- **WHEN** a cashier closes a shift that has linked transactions
- **THEN** the application stores the shift's expected cash and cash difference values and makes the shift sales summary available for later review
