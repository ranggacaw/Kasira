# transaction-history Specification

## Purpose
TBD - created by archiving change add-business-modules. Update Purpose after archive.
## Requirements
### Requirement: Transaction History Workspace
Kasira SHALL provide authenticated transaction history and detail views so staff can review completed sales, draft orders, refunds, and receipt actions after checkout persists them.

#### Scenario: Staff opens transaction history
- **WHEN** an authenticated user with transaction access visits the transaction history route
- **THEN** the application shows a list of transactions with summary details and status information

#### Scenario: Staff opens a transaction detail view
- **WHEN** an authorized user selects a transaction from the history list
- **THEN** the application shows the transaction detail, sold items, totals, payments, and receipt actions

### Requirement: Transaction Filtering
Kasira SHALL allow transaction records to be filtered by date range, cashier, outlet, payment method, and transaction status.

#### Scenario: User narrows the transaction list
- **WHEN** an authorized user applies one or more supported transaction filters
- **THEN** the application returns only the matching sales records

### Requirement: Receipt and Refund Actions
Kasira SHALL allow authorized users to open receipts, print or share them, and start refund workflows from eligible transactions.

#### Scenario: User opens a transaction receipt action
- **WHEN** an authorized user requests the receipt for a completed transaction
- **THEN** the application provides the corresponding receipt view or delivery flow

#### Scenario: User starts a refund from transaction detail
- **WHEN** an authorized user selects an eligible transaction refund action
- **THEN** the application begins the refund workflow without altering unrelated transactions

### Requirement: Premium Transaction Review Presentation
Kasira SHALL present transaction history and receipt review surfaces with a premium list-and-detail language that emphasizes active transaction context, receipt readability, and clearly grouped receipt actions.

#### Scenario: User reviews a transaction list
- **WHEN** an authorized user opens transaction history
- **THEN** the list uses the premium hierarchy, status indicators, and active-row emphasis defined by the design system

#### Scenario: User opens a transaction receipt
- **WHEN** an authorized user opens a transaction detail or receipt view
- **THEN** the page presents the sale context, receipt details, and print, share, download, or refund actions through the shared premium workflow styling

### Requirement: Role-Safe Transaction Profitability Review
Kasira SHALL present transaction detail using stored item snapshots and only reveal cost or gross profit information to users who can view reporting workflows.

#### Scenario: Report user reviews transaction profitability
- **WHEN** an owner, admin, or manager opens a completed transaction detail view
- **THEN** the page shows item names, selling snapshots, cost snapshots, gross profit, and gross margin using the stored transaction item snapshot values

#### Scenario: Cashier reviews a completed transaction
- **WHEN** a cashier opens a completed transaction detail or receipt review view
- **THEN** the page continues to show sales and receipt information without exposing cost price, gross profit, or gross margin fields

### Requirement: Transaction Void Workflow
Kasira SHALL allow authorized users to void eligible sales separately from refunds so cancelled transactions remain distinguishable in audit, stock, and cashier workflows.

#### Scenario: Authorized user voids an eligible sale
- **WHEN** an authorized user voids a transaction that is still eligible for cancellation
- **THEN** the application records the sale as `cancelled`, restores any stock-tracked items tied to that sale, and keeps the transaction visible in history without marking it as refunded

#### Scenario: User filters transaction history after void activity
- **WHEN** an authorized user reviews transaction history after one or more voided sales
- **THEN** the history and supported status filters treat cancelled transactions as a distinct state from completed and refunded sales

