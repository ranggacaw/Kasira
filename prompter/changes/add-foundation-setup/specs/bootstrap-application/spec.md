## ADDED Requirements
### Requirement: Inertia React Application Shell
Kasira SHALL use an Inertia.js and React application shell as the default browser experience instead of the Laravel starter welcome page.

#### Scenario: Root route opens the application shell
- **WHEN** a user visits the root URL of the application
- **THEN** the response renders the Kasira application shell rather than the default Laravel welcome screen

### Requirement: Authenticated Application Access
Kasira SHALL require authentication before users can access protected application areas that host MVP cashier, inventory, and reporting workflows.

#### Scenario: Guest requests a protected area
- **WHEN** an unauthenticated visitor requests a protected application route
- **THEN** the visitor is redirected to sign in before the protected content is shown

### Requirement: Initial Business Roles
Kasira SHALL define Owner, Admin, and Cashier as the initial role model for MVP users.

#### Scenario: Fresh environment is initialized
- **WHEN** the application is seeded in a new environment
- **THEN** Owner, Admin, and Cashier roles are available for user assignment

#### Scenario: Signed-in user enters the application
- **WHEN** an authenticated user accesses a protected workflow
- **THEN** the application can determine the user's assigned role for access control decisions

### Requirement: PostgreSQL Runtime Baseline
Kasira SHALL target PostgreSQL as the primary relational database for MVP development and deployment-oriented environments.

#### Scenario: Application connects to the database
- **WHEN** valid PostgreSQL connection settings are provided
- **THEN** the application uses PostgreSQL for migrations and runtime database access
