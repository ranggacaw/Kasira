## ADDED Requirements
### Requirement: Premium Public and Authentication Presentation
Kasira SHALL present its landing, sign-in, registration, verification, password recovery, and other authentication-facing surfaces using the Anvil Premium POS brand language with Manrope typography, warm neutral surfaces, rounded containers, and prominent primary actions.

#### Scenario: A visitor opens the landing page
- **WHEN** a user visits the public root experience
- **THEN** the page reflects the Anvil Premium POS visual hierarchy instead of a starter-style utility presentation

#### Scenario: A user opens an authentication form
- **WHEN** a user visits sign-in, registration, or password recovery
- **THEN** the form uses the shared premium layout, persistent labels, tactile focus states, and tokenized spacing defined by the design system

### Requirement: Premium Protected Shell Presentation
Kasira SHALL present protected non-POS and POS shells with a consistent Anvil Premium identity so users recognize one application brand across public, back-office, and cashier workflows.

#### Scenario: A signed-in user enters a protected module
- **WHEN** an authenticated user opens a protected route
- **THEN** the shell uses the shared premium typography, surface, navigation, and spacing rules for that shell type
