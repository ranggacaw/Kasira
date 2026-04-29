## ADDED Requirements
### Requirement: Outlet Administration
Kasira SHALL support outlet records so businesses can manage one or more physical selling locations within the same account.

#### Scenario: Owner adds a new outlet
- **WHEN** an authorized user creates a valid outlet record
- **THEN** the outlet becomes available for assignment in operational workflows

### Requirement: Outlet-Scoped Operations
Kasira SHALL scope product availability, stock balances, transactions, and reports by outlet when multi-outlet features are enabled.

#### Scenario: User reviews outlet-specific activity
- **WHEN** an authorized user filters operational data to a specific outlet
- **THEN** the application returns only the products, stock, transactions, and reporting data for that outlet
