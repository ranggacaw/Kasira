## MODIFIED Requirements
### Requirement: User Administration
Kasira SHALL allow authorized business users to create, update, and deactivate staff accounts for operational access. Owner and admin users SHALL be able to create, edit, activate, deactivate, and assign outlet-scoped staff accounts, including cashier accounts, from the operations management workflow.

#### Scenario: Owner adds a staff account
- **WHEN** an authorized user submits valid staff account details
- **THEN** the application creates the user and makes the account available for role assignment

#### Scenario: Admin creates a cashier account
- **WHEN** an active admin submits valid cashier account details with a role and optional outlet assignment
- **THEN** the application creates the cashier account and makes it available for operational login within the assigned access scope

#### Scenario: Admin updates a cashier account
- **WHEN** an active admin submits valid changes to a cashier account's profile, role, outlet assignment, or activation status
- **THEN** the application saves the updated cashier account details

#### Scenario: Admin reactivates a cashier within plan limits
- **WHEN** an active admin reactivates an inactive cashier account and the business has available active-user capacity
- **THEN** the application reactivates the cashier account

#### Scenario: Admin exceeds active user capacity
- **WHEN** an active admin attempts to create or reactivate a staff account after the business has reached its active-user limit
- **THEN** the application rejects the request and explains that the current plan limit has been reached

### Requirement: Role-Based Workflow Access
Kasira SHALL enforce role-based access for Owner, Admin, Manager, and Cashier workflows across POS, back-office, reporting, and settings modules. Owner and admin users SHALL be allowed to access cashier and branch administration workflows, while cashier users MUST be denied access to those workflows.

#### Scenario: Cashier attempts to access an administrative module
- **WHEN** a cashier requests products, categories, inventory configuration, employees, reports, or settings
- **THEN** the application denies access while preserving access to POS, transactions, shift, and receipt workflows

#### Scenario: Manager accesses reporting workflows
- **WHEN** a manager requests reporting, inventory, or operational monitoring features
- **THEN** the application allows those workflows without granting full owner or admin administration rights

#### Scenario: Owner or admin enters the back office
- **WHEN** an owner or admin requests a protected back-office module granted to that role
- **THEN** the application allows access to that workflow

#### Scenario: Cashier requests staff administration
- **WHEN** a cashier requests the operations workflow for staff administration
- **THEN** the application denies access
