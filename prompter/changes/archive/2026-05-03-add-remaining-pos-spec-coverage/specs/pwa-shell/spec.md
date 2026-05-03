## ADDED Requirements
### Requirement: Grouped Back-Office Module Navigation
Kasira SHALL present non-POS navigation through grouped sidebar destinations that reflect the documented mobile and tablet information architecture while respecting the signed-in user's workflow permissions.

#### Scenario: Owner, admin, or manager opens the sidebar
- **WHEN** a back-office user opens the navigation drawer or collapsible sidebar
- **THEN** the menu exposes grouped destinations for Dashboard, POS, Catalog, Inventory, Sales, Operations, Customers, and Settings, including their relevant tasks such as products and categories, stock and stock movements, transactions and reports, and shifts and outlets, while keeping Profile and Logout anchored separately from the primary workflow links

#### Scenario: Cashier opens a permitted non-POS workflow
- **WHEN** a cashier opens a role-allowed page such as transaction history
- **THEN** the sidebar only renders the subset of destinations granted to that role and hides administrative catalog, inventory, outlet, reporting, and settings links
