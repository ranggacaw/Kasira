## MODIFIED Requirements
### Requirement: Stock Movement Tracking
Kasira SHALL record stock-in, stock-out, adjustment, sale, and refund inventory movements so authorized staff can manage stock and review outlet history for each product.

#### Scenario: Admin records stock in
- **WHEN** an authorized user submits a stock-in movement for a product
- **THEN** the product's available stock increases and the movement is stored with its quantity, actor, and timestamp

#### Scenario: Admin records stock out
- **WHEN** an authorized user submits a stock-out movement for a product
- **THEN** the product's available stock decreases and the movement is stored in the inventory history

#### Scenario: Successful sale consumes tracked stock
- **WHEN** a sale is completed for a stock-tracked product
- **THEN** the application decreases available stock and records a sale movement linked to the transaction

### Requirement: Low Stock Monitoring
Kasira SHALL identify products that fall below configured minimum stock thresholds so the business can act before items become unavailable in inventory and dashboard views.

#### Scenario: Product crosses below minimum stock
- **WHEN** a product's available stock becomes lower than its minimum threshold
- **THEN** the application surfaces the product as a low-stock alert in inventory and dashboard views

## ADDED Requirements
### Requirement: Inventory History Filtering
Kasira SHALL allow inventory movement history to be filtered by outlet, product, and movement type.

#### Scenario: User narrows movement history
- **WHEN** an authorized user applies one or more inventory history filters
- **THEN** the application returns only the matching stock movement records
