# receipt-delivery Specification

## Purpose
TBD - created by archiving change align-mobile-tablet-pwa-pos. Update Purpose after archive.
## Requirements
### Requirement: Transaction Receipt Presentation
Kasira SHALL generate a receipt view for completed transactions that shows outlet identity, transaction number, timestamp, cashier, items, subtotal, discount, tax, service charge, grand total, payment details, and a thank-you message.

#### Scenario: User opens a completed transaction receipt
- **WHEN** an authorized user requests the receipt for a completed transaction
- **THEN** the application renders the transaction receipt with the configured receipt data

### Requirement: Receipt Distribution
Kasira SHALL allow eligible users to print, share, or download a receipt after a transaction is completed.

#### Scenario: User selects a receipt delivery action
- **WHEN** an authorized user chooses to print, share, or download a completed transaction receipt
- **THEN** the application starts the requested receipt delivery flow for that transaction

