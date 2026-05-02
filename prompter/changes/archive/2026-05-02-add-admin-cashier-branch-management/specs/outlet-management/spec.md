## MODIFIED Requirements
### Requirement: Outlet Administration
Kasira SHALL support outlet records so businesses can manage one or more physical selling locations within the same account. For operational workflows, branch management SHALL be fulfilled through these outlet records, and owner and admin users SHALL be able to create, update, activate, deactivate, and mark a branch or outlet as primary from the operations management workflow.

#### Scenario: Owner adds a new outlet
- **WHEN** an authorized user creates a valid outlet record
- **THEN** the outlet becomes available for assignment in operational workflows

#### Scenario: Admin creates a branch record
- **WHEN** an active admin submits valid branch details
- **THEN** the application creates an outlet record and makes it available for assignment in operational workflows

#### Scenario: Admin updates a branch record
- **WHEN** an active admin submits valid changes to a branch record's name, code, address, activation state, or primary state
- **THEN** the application saves the branch updates to the outlet record

#### Scenario: Admin activates a branch within plan limits
- **WHEN** an active admin creates or reactivates a branch and the business has available active-outlet capacity
- **THEN** the application allows the branch to become active

#### Scenario: Admin exceeds active outlet capacity
- **WHEN** an active admin attempts to create or reactivate a branch after the business has reached its active-outlet limit
- **THEN** the application rejects the request and explains that the current plan limit has been reached
