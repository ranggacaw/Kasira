## Context
Kasira currently matches the default Laravel 12 starter: a Blade welcome page, the starter SQLite database file, no React or Inertia integration, and no application-specific authorization model. The project plan targets Laravel 12 with Inertia.js, React, Tailwind, PostgreSQL, and three core MVP roles: Owner, Admin, and Cashier.

## Goals / Non-Goals
- Goals:
  - Establish the intended web application shell on Inertia.js and React.
  - Standardize the project on PostgreSQL for ongoing development.
  - Add the smallest useful authentication and role foundation for MVP access control.
  - Leave the repository in a state where checkout, inventory, and reporting changes can build on a stable base.
- Non-Goals:
  - Implementing POS checkout, inventory CRUD, or reporting features.
  - Designing the full product, stock, payment, or transaction schema.
  - Introducing advanced permission packages, SaaS billing, offline mode, or multi-outlet support.

## Decisions
- Decision: Capture the first approved change as one cross-cutting foundation proposal.
- Alternatives considered: Splitting immediately into separate frontend, auth, and environment proposals. Rejected because the repo has no prior specs and the first change should stay straightforward to review.
- Decision: Limit data model work to what is necessary for authentication and role assignment.
- Alternatives considered: Defining the full MVP schema now. Rejected to avoid coupling later feature proposals to premature domain details.
- Decision: Treat PostgreSQL as the primary runtime target instead of keeping SQLite as the default local path.
- Alternatives considered: Supporting both databases equally in the first change. Rejected because the project plan already prefers PostgreSQL and a single baseline reduces setup ambiguity.

## Risks / Trade-offs
- Inertia and auth bootstrap will touch several framework entry points, which raises the chance of setup drift. Mitigation: keep the user-facing scope to a thin app shell.
- Early role modeling can constrain later authorization work. Mitigation: keep the first version role-based and avoid a heavyweight permission design.
- Moving local development to PostgreSQL may require environment changes for existing contributors. Mitigation: include explicit setup and verification tasks.

## Migration Plan
1. Install and configure the Inertia.js and React frontend baseline.
2. Replace the starter welcome route with the Kasira application shell.
3. Configure the project to run against PostgreSQL and verify migrations.
4. Add the initial authentication and Owner/Admin/Cashier role model.
5. Document the resulting setup and conventions for future changes.

## Open Questions
- Should authentication use Laravel Breeze, a custom Laravel auth stack, or another Laravel-native starter?
- Should the initial role model use a dedicated `roles` table or a simpler role column on `users` for the first iteration?
