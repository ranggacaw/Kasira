## ADDED Requirements
### Requirement: Role-Safe Transaction Profitability Review
Kasira SHALL present transaction detail using stored item snapshots and only reveal cost or gross profit information to users who can view reporting workflows.

#### Scenario: Report user reviews transaction profitability
- **WHEN** an owner, admin, or manager opens a completed transaction detail view
- **THEN** the page shows item names, selling snapshots, cost snapshots, gross profit, and gross margin using the stored transaction item snapshot values

#### Scenario: Cashier reviews a completed transaction
- **WHEN** a cashier opens a completed transaction detail or receipt review view
- **THEN** the page continues to show sales and receipt information without exposing cost price, gross profit, or gross margin fields
