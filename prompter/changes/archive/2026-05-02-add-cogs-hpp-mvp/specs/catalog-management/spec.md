## ADDED Requirements
### Requirement: Product Cost And Margin Guidance
Kasira SHALL allow authorized catalog users to manage each product's manual cost price and optional minimum margin override while showing estimated profit and gross margin feedback during product editing.

#### Scenario: Staff saves product cost configuration
- **WHEN** an owner, admin, or manager creates or updates a product with selling price, cost price, and an optional minimum margin override
- **THEN** the application stores the values and makes them available to checkout and reporting workflows

#### Scenario: Staff reviews profitability guidance before saving
- **WHEN** an authorized catalog user changes the selling price or cost price in the product workflow
- **THEN** the page updates the estimated profit and gross margin feedback before the record is saved

### Requirement: Low Margin Product Warning
Kasira SHALL warn authorized catalog users when a product's gross margin falls below its effective minimum margin threshold.

#### Scenario: Product uses its own margin threshold
- **WHEN** a product defines a minimum margin override and the edited selling and cost prices calculate below that threshold
- **THEN** the product workflow shows a low-margin warning before the user saves the change

#### Scenario: Product falls back to the default threshold
- **WHEN** a product does not define its own minimum margin override and the calculated margin is below the default configured threshold
- **THEN** the product workflow shows the same low-margin warning using the default setting

### Requirement: Product Cost Change History
Kasira SHALL record a product cost history entry whenever an existing product's cost price changes.

#### Scenario: Authorized staff changes a product cost
- **WHEN** an owner, admin, or manager saves an existing product with a different cost price than the persisted value
- **THEN** the application stores the old cost, new cost, actor, timestamp, and change reason metadata needed for audit review
