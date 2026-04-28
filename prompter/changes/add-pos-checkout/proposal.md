# Change: Add MVP POS checkout flow

## Why
Kasira now has the application shell, authentication, and business roles, but it still lacks the core cashier workflow that turns the project into a usable POS. The next slice needs to deliver a working checkout flow that can build a cart, calculate totals, capture a payment method, and save a completed sale.

## What Changes
- Add the cashier checkout page and supporting server endpoints for the POS workflow.
- Introduce the minimal product and transaction schema required to sell products and persist completed sales.
- Support cart totals with discount, tax, and service fee adjustments.
- Record a completed sale with one manual payment method selection: Cash, QRIS, or Bank Transfer.
- Keep automatic stock deduction, split payments, receipt printing, and customer records out of scope for this change.

## Impact
- Affected specs: `pos-checkout`
- Affected code: checkout pages and routes, transaction controllers/actions, product and transaction models, migrations, seeders, validation, and feature tests
