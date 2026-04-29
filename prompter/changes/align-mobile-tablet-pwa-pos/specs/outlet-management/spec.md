## MODIFIED Requirements
### Requirement: Outlet-Scoped Operations
Kasira SHALL resolve the active outlet from the authenticated user context or the `outlet` query parameter before loading outlet-aware products, stock balances, transactions, POS data, or dashboard metrics.

#### Scenario: User reviews outlet-specific activity
- **WHEN** an authorized user filters operational data to a specific outlet
- **THEN** the application returns only the products, stock, transactions, POS data, and reporting data for that outlet

#### Scenario: User opens an outlet-aware workflow without an explicit filter
- **WHEN** an authenticated user visits an outlet-aware page without providing the `outlet` query parameter
- **THEN** the application resolves the current outlet from the signed-in user context before loading the page data
