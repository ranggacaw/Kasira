## ADDED Requirements
### Requirement: User Administration
Kasira SHALL allow authorized business users to create, update, and deactivate staff accounts for operational access.

#### Scenario: Owner adds a staff account
- **WHEN** an authorized user submits valid staff account details
- **THEN** the application creates the user and makes the account available for role assignment

### Requirement: Role-Based Workflow Access
Kasira SHALL enforce role-based access for Owner, Admin, Cashier, and Manager workflows.

#### Scenario: Cashier attempts to access an administrative module
- **WHEN** a cashier requests a module reserved for higher-privilege roles
- **THEN** the application denies access to that module

#### Scenario: Manager accesses reporting workflows
- **WHEN** a manager requests reporting features granted to that role
- **THEN** the application allows access without granting full owner administration rights
