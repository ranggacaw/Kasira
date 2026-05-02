## Context
Kasira already exposes `/operations` for outlet and staff management. In the current implementation, owner and admin users can create and update outlets and staff accounts, while the existing specs describe those capabilities only at a broad level. The requested feature is best expressed as a spec refinement that formalizes admin-managed cashiers and branches instead of introducing a brand-new module.

## Goals / Non-Goals
- Goals:
- Define full admin lifecycle management for cashier accounts.
- Define full admin lifecycle management for branches, mapped to the existing `outlets` domain model.
- Preserve plan-aware limits for active users and active outlets.
- Keep the authorization model role-based without introducing a separate permissions package.
- Non-Goals:
- Introduce branch hierarchies, branch transfers, or branch-specific inventory rules beyond existing outlet scoping.
- Add delete requirements for staff or branches; deactivation remains the safer operational state change.
- Expand manager or cashier access beyond the current role model.

## Decisions
- Decision: Treat user-facing "branches" as the same capability as `outlet-management` because the codebase already models physical selling locations as outlets.
- Alternatives considered: Creating a separate `branch-management` capability would duplicate the same business object and create conflicting terminology.

- Decision: Capture cashier management as a refinement of `user-access-management` rather than a new spec.
- Alternatives considered: A separate cashier-management capability would split staff lifecycle rules away from the broader user administration contract with little practical benefit.

- Decision: Specify create, update, activation, deactivation, and outlet assignment, but not hard deletion.
- Alternatives considered: Hard delete increases data integrity and audit risks because historical transactions and outlet-scoped reporting refer back to user and outlet records.

## Risks / Trade-offs
- Broader admin control can create accidental changes to active operational records -> mitigate with role checks, validation, and deactivation-first workflows.
- Terminology mismatch between "branch" and "outlet" can confuse future work -> mitigate by explicitly documenting that branch requirements are fulfilled by outlet records.

## Migration Plan
1. Approve the proposal and align wording on branch versus outlet terminology.
2. Implement any missing UI, validation, and authorization behavior in the operations workspace.
3. Add or update feature tests for admin access, cashier denial, lifecycle updates, and plan-limit constraints.

## Open Questions
- None.
