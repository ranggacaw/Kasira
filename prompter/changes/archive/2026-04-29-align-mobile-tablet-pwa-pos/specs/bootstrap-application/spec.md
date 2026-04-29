## MODIFIED Requirements
### Requirement: Initial Business Roles
Kasira SHALL define Owner, Admin, Manager, and Cashier as the initial operational role model for POS and back-office users.

#### Scenario: Fresh environment is initialized
- **WHEN** the application is seeded in a new environment
- **THEN** Owner, Admin, Manager, and Cashier roles are available for user assignment

#### Scenario: Signed-in user enters the application
- **WHEN** an authenticated user accesses a protected workflow
- **THEN** the application can determine the user's assigned role for access control and landing page routing decisions
