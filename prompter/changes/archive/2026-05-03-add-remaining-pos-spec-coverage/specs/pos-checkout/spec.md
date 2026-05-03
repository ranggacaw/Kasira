## ADDED Requirements
### Requirement: POS Product Search And Category Browsing
Kasira SHALL let cashier users narrow sellable products during checkout by search text and category without leaving the dedicated POS workspace.

#### Scenario: Cashier searches for a product
- **WHEN** a cashier enters product name, SKU, or barcode text in the POS search field
- **THEN** the product grid updates to show only matching sellable products for the active outlet

#### Scenario: Cashier combines search and category filters
- **WHEN** a cashier chooses a category while a search query is active
- **THEN** the POS product grid keeps both filters applied until the cashier changes or clears them
