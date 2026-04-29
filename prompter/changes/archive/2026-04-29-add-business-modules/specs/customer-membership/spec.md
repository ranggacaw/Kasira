## ADDED Requirements
### Requirement: Customer Directory
Kasira SHALL allow staff to maintain customer records so sales can be associated with known customers when that workflow is used.

#### Scenario: Staff registers a customer
- **WHEN** an authorized user submits valid customer details
- **THEN** the application stores the customer record for later selection during sales and follow-up interactions

### Requirement: Membership Benefits
Kasira SHALL support membership-oriented customer workflows for premium plans.

#### Scenario: Premium account uses membership features
- **WHEN** an entitled account applies a membership-capable customer during a qualifying workflow
- **THEN** the application makes the configured membership benefits available in that workflow
