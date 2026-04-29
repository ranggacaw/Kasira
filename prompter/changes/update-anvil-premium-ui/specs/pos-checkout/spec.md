## ADDED Requirements
### Requirement: Premium POS Workspace Ergonomics
Kasira SHALL present the POS checkout workspace using the Anvil Premium POS ergonomic model with tactile product cards, category chips, strong total hierarchy, and a clearly anchored payment action zone.

#### Scenario: Cashier opens checkout on a tablet or terminal
- **WHEN** an authenticated cashier opens the POS workspace
- **THEN** the page presents product browsing, cart review, and charge actions using the premium tactile layout described by the design model

#### Scenario: Cashier updates the active sale
- **WHEN** a cashier adjusts quantities, pricing inputs, or payment details
- **THEN** the current sale remains visually prioritized through the workspace's totals hierarchy and action placement

### Requirement: Premium Receipt Handoff Presentation
Kasira SHALL surface post-payment receipt actions through a premium success and receipt-handoff experience that clearly emphasizes print, share, download, and next-sale actions.

#### Scenario: Cashier completes checkout
- **WHEN** a sale is successfully charged
- **THEN** the resulting success experience presents the receipt handoff options using the shared premium component language
