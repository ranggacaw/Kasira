## ADDED Requirements
### Requirement: Customer Purchase History
Kasira SHALL let authorized users review a customer's prior transactions from the customer workflow so staff can confirm visit history and spending context.

#### Scenario: Staff opens a customer record
- **WHEN** an authorized user reviews a saved customer from the operations workflow
- **THEN** the application shows that customer's recent transactions with invoice reference, visit date, outlet, total, and status information

#### Scenario: Staff opens a purchase from customer history
- **WHEN** an authorized user selects a transaction from the customer's purchase history
- **THEN** the application opens the corresponding transaction detail workflow instead of duplicating full receipt details inside the customer form
