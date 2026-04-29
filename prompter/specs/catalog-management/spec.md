# catalog-management Specification

## Purpose
TBD - created by archiving change add-business-modules. Update Purpose after archive.
## Requirements
### Requirement: Product Catalog Administration
Kasira SHALL provide authenticated product administration so authorized staff can create, update, activate or deactivate, and browse outlet-scoped products with category, unit, pricing, barcode or SKU, image, and stock-tracking data.

#### Scenario: Admin creates a sellable product
- **WHEN** an authorized user submits a valid product with name, SKU or barcode, selling price, cost price, stock quantity, category, unit, image, stock-tracking settings, and active status
- **THEN** the application stores the product and makes it available to the relevant business workflows

#### Scenario: Inactive product is excluded from selling
- **WHEN** a product is marked inactive
- **THEN** it is hidden from product selection during checkout while remaining available for administrative review

### Requirement: Category Management
Kasira SHALL provide product category management so businesses can group products for catalog organization, POS display, reporting, and promotion setup.

#### Scenario: Admin assigns a category to a product
- **WHEN** an authorized user creates or updates a product category assignment
- **THEN** the product is grouped under that category for management, POS browsing, and downstream reporting use

#### Scenario: Admin updates category display settings
- **WHEN** an authorized user changes a category's color, sort order, or active state
- **THEN** the category reflects those settings anywhere category-driven product browsing is used

### Requirement: Unit Management
Kasira SHALL provide unit definitions so products can reference consistent sellable units.

#### Scenario: Admin creates a product unit
- **WHEN** an authorized user submits a valid unit name, short name, and optional description
- **THEN** the application stores the unit and makes it available for product administration

### Requirement: Premium Catalog and Inventory Editing Surfaces
Kasira SHALL present product, category, unit, and inventory editing surfaces with tactile cards, persistent field labels, list-detail browsing patterns, and sticky save actions consistent with the Anvil Premium POS design model.

#### Scenario: Staff edits catalog data
- **WHEN** an authorized user creates or updates a product, category, unit, or inventory movement
- **THEN** the workflow uses the premium editing presentation with persistent labels, clear field grouping, and an always-accessible save action

#### Scenario: Staff browses product records
- **WHEN** an authorized user reviews product and category listings
- **THEN** the listings use the shared card, badge, and status treatments defined by the premium design system

