# Change: Add admin cashier and branch management

## Why
Kasira needs an explicit product contract for admin-managed operational setup so businesses can delegate day-to-day staff and branch administration without depending on the owner for every change. The current codebase already contains an operations workspace, but the requirements do not clearly define cashier-focused account management or full branch lifecycle expectations for admins.

## What Changes
- Modify `user-access-management` to define admin management of cashier accounts, including create, edit, activate, deactivate, and outlet assignment flows.
- Modify `outlet-management` to define admin management of branch records, using Kasira's existing outlet model as the branch record of truth.
- Clarify role and guardrail expectations for operations management, including plan-limit enforcement and protection against cashier access to these workflows.

## Impact
- Affected specs: `user-access-management`, `outlet-management`
- Affected code: `app/Http/Controllers/OperationsController.php`, `app/Models/User.php`, `resources/js/Pages/Operations/Index.jsx`, `routes/web.php`, related validation and feature tests
