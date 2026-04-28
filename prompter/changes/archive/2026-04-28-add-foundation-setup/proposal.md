# Change: Add Kasira foundation setup

## Why
The repository is still the default Laravel starter, while the MVP plan assumes a React and Inertia POS application on PostgreSQL with authenticated business roles. A focused foundation change is needed so later checkout, inventory, and reporting work can build on the intended stack instead of starter defaults.

## What Changes
- Replace the default Blade welcome flow with an Inertia.js and React application shell.
- Establish PostgreSQL as the primary application database target for local and deployment-oriented environments.
- Introduce the initial authentication and role foundation for Owner, Admin, and Cashier users.
- Document the baseline setup and conventions needed for follow-on feature work.

## Impact
- Affected specs: `bootstrap-application`
- Affected code: `composer.json`, `package.json`, `routes/web.php`, `resources/js/*`, `config/database.php`, auth and role models, initial migrations and seeders, project setup docs
