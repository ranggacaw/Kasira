## MODIFIED Requirements
### Requirement: Operations Dashboard Metrics
Kasira SHALL provide an authenticated dashboard that summarizes today sales, today transactions, average order value, top-selling products, low-stock alerts, and payment method totals for the active outlet and selected date range.

#### Scenario: Owner opens the dashboard
- **WHEN** an authorized user visits the dashboard
- **THEN** the application shows current business metrics derived from recorded transactions and inventory data for the active outlet and date range

### Requirement: Sales Trend Visualization
Kasira SHALL visualize sales trends for the selected period so business users can quickly understand revenue movement over time.

#### Scenario: User reviews sales charts
- **WHEN** dashboard sales data is available for the selected period
- **THEN** the application renders chart-ready trend data for the authenticated user

## ADDED Requirements
### Requirement: Dashboard Filtering
Kasira SHALL allow authorized users to change outlet and date filters before loading dashboard metrics.

#### Scenario: User applies dashboard filters
- **WHEN** an authorized user changes the outlet or date filter on the dashboard
- **THEN** the application refreshes summary metrics, sales trends, and supporting lists using the selected filter context
