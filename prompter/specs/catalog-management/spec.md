# catalog-management Specification

## Purpose
TBD - created by archiving change add-business-modules. Update Purpose after archive.
## Requirements
### Requirement: Product Catalog Administration
Kasira SHALL provide authenticated product catalog management so authorized staff can create, update, deactivate, and browse products used by checkout and inventory workflows.

#### Scenario: Admin creates a sellable product
- **WHEN** an authorized user submits a valid product with name, SKU or barcode, selling price, cost price, stock quantity, category, image, and active status
- **THEN** the application stores the product and makes it available to the relevant business workflows

#### Scenario: Inactive product is excluded from selling
- **WHEN** a product is marked inactive
- **THEN** it is hidden from product selection during checkout while remaining available for administrative review

### Requirement: Category Management
Kasira SHALL provide product category management so businesses can group products for catalog organization, reporting, and promotion setup.

#### Scenario: Admin assigns a category to a product
- **WHEN** an authorized user creates or updates a product category assignment
- **THEN** the product is grouped under that category for management and downstream reporting use

