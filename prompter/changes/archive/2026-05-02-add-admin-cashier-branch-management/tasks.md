## 1. Implementation
- [x] 1.1 Review the approved deltas for `user-access-management` and `outlet-management` before editing application code.
- [x] 1.2 Update operations authorization and validation so admins can fully manage cashier accounts and branch/outlet records while unauthorized roles remain blocked.
- [x] 1.3 Update the operations workspace UI to support the approved create, edit, activate, and deactivate flows for cashier accounts and branch/outlet records.
- [x] 1.4 Preserve and verify plan-limit enforcement for active users and active outlets during create and reactivation flows.
- [x] 1.5 Add Laravel feature tests for admin success cases and cashier denial cases across staff and branch management routes.
- [x] 1.6 Run the relevant test suite and confirm the operations workflows pass.

## 2. Validation
- [x] 2.1 Run `prompter validate add-admin-cashier-branch-management --strict --no-interactive`.

## Post-Implementation
- [x] Update project guidance if the approved implementation changes operational terminology or workflow expectations.
