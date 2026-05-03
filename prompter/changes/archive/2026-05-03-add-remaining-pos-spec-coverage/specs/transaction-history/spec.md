## ADDED Requirements
### Requirement: Transaction Void Workflow
Kasira SHALL allow authorized users to void eligible sales separately from refunds so cancelled transactions remain distinguishable in audit, stock, and cashier workflows.

#### Scenario: Authorized user voids an eligible sale
- **WHEN** an authorized user voids a transaction that is still eligible for cancellation
- **THEN** the application records the sale as `cancelled`, restores any stock-tracked items tied to that sale, and keeps the transaction visible in history without marking it as refunded

#### Scenario: User filters transaction history after void activity
- **WHEN** an authorized user reviews transaction history after one or more voided sales
- **THEN** the history and supported status filters treat cancelled transactions as a distinct state from completed and refunded sales
