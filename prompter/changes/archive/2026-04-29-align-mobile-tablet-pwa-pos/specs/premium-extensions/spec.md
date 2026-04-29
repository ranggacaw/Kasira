## MODIFIED Requirements
### Requirement: Premium Reporting Extensions
Kasira SHALL provide premium reporting features including sales, product, inventory, payment, cashier, and profit-and-loss reporting with export support and COGS visibility for entitled accounts.

#### Scenario: Business account exports reporting data
- **WHEN** an entitled user requests a supported report export or profitability view
- **THEN** the application generates the requested premium output from the account's business data

#### Scenario: Entitled user opens a premium report workspace
- **WHEN** an entitled user requests a premium report such as payments, cashier performance, or profit and loss
- **THEN** the application returns the requested report data for the active outlet and selected period

### Requirement: Premium Commerce Extensions
Kasira SHALL provide premium commerce capabilities including split payment, promotions and vouchers, cashier shift management, connected receipt delivery, QRIS integration, thermal printer support, and offline draft order sync for entitled accounts.

#### Scenario: Entitled account uses a premium commerce workflow
- **WHEN** a user on an entitled account starts a supported premium workflow
- **THEN** the application enables the corresponding premium behavior for that workflow

#### Scenario: Offline draft sync is restored
- **WHEN** an entitled user reconnects after creating local draft POS work while offline
- **THEN** the application syncs eligible drafts without creating duplicate transactions
