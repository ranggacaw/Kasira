## MODIFIED Requirements
### Requirement: Role-Based Workflow Access
Kasira SHALL enforce role-based access for Owner, Admin, Manager, and Cashier workflows across POS, back-office, reporting, and settings modules.

#### Scenario: Cashier attempts to access an administrative module
- **WHEN** a cashier requests products, categories, inventory configuration, employees, reports, or settings
- **THEN** the application denies access while preserving access to POS, transactions, shift, and receipt workflows

#### Scenario: Manager accesses reporting workflows
- **WHEN** a manager requests reporting, inventory, or operational monitoring features
- **THEN** the application allows those workflows without granting full owner or admin administration rights

#### Scenario: Owner or admin enters the back office
- **WHEN** an owner or admin requests a protected back-office module granted to that role
- **THEN** the application allows access to that workflow

## ADDED Requirements
### Requirement: Role-Based Landing Pages
Kasira SHALL route users to a role-appropriate landing page after authentication.

#### Scenario: Cashier signs in
- **WHEN** an authenticated cashier completes login
- **THEN** the application redirects the cashier to `/pos`

#### Scenario: Owner, admin, or manager signs in
- **WHEN** an authenticated owner, admin, or manager completes login
- **THEN** the application redirects the user to `/dashboard`
