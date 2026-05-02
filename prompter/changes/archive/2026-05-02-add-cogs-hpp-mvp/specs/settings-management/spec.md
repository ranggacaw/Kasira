## ADDED Requirements
### Requirement: Product Margin Settings
Kasira SHALL allow authorized settings users to configure a default minimum product margin percentage used by catalog workflows when a product does not provide its own override.

#### Scenario: Owner updates the default margin threshold
- **WHEN** an authorized settings user saves a new default minimum product margin percentage
- **THEN** subsequent product editing and low-margin warning workflows use the saved value as the fallback threshold
