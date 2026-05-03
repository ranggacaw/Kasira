## Context
`docs/kasira-pos-spec.md` is now mostly reflected by existing Prompter specs and code, especially for the PWA shell, checkout layout, catalog, inventory, reporting, outlets, and settings foundation. The remaining uncovered behaviors are cross-cutting, though: they touch shell navigation, POS filtering, customer operations, transaction state handling, and cashier shifts.

An active `update-pwa-responsive-ux` change already covers installability and responsive polish. This proposal stays out of that lane and only closes the remaining product-behavior gaps that are still missing from the current spec set.

## Goals / Non-Goals
- Goals:
  - Capture the remaining documented behaviors without re-proposing capabilities that already exist in current specs.
  - Keep the implementation path aligned with the current route and page structure wherever possible.
  - Make shift management and transaction void behavior explicit enough to drive tests.
- Non-Goals:
  - Rework the responsive shell or POS layout already covered by `update-pwa-responsive-ux`.
  - Introduce separate routes or standalone pages for every submenu leaf if the current consolidated workspace can satisfy the requirement.
  - Expand into unrelated roadmap items such as advanced offline sync, native packaging, or broader CRM features.

## Decisions
- Decision: Reuse the existing consolidated back-office pages for grouped navigation.
  - Why: Current routes expose `inventory.index`, `operations.index`, and `reports.*` rather than a deep nested route tree. The menu structure from the source docs can be represented through grouped sidebar navigation and page-local sections without multiplying route surfaces.
  - Alternatives considered: Create dedicated routes for every documented submenu item. Rejected because it would broaden scope well beyond the requested gap-closure proposal.

- Decision: Treat void as a distinct cancelled transaction state rather than reusing the refund flow.
  - Why: The source document calls for `refund / void`, and the user confirmed void should remain separate from refunds. The current code only supports `completed` and `refunded`, so the proposal must introduce a separate status path that stays visible in history and can be excluded from refund semantics.
  - Alternatives considered: Map void to refund. Rejected because it would collapse two explicitly different workflows.

- Decision: Promote cashier shifts into a dedicated capability while keeping entitlement gating in `premium-extensions`.
  - Why: `premium-extensions` already states that shift workflows are plan-gated, but it does not define the actual operational behavior. A separate `shift-management` capability keeps plan access rules and workflow behavior decoupled.
  - Alternatives considered: Add more detail directly to `premium-extensions`. Rejected because that capability is already serving as entitlement coverage for multiple premium features.

- Decision: Model tax settings as a saved default that prefills new sales instead of hard-locking every checkout.
  - Why: The current POS workflow already allows per-sale tax edits. A default rate closes the documented settings gap with the smallest behavioral change while preserving cashier flexibility.
  - Alternatives considered: Force a global tax rate on every sale with no override. Rejected because it would materially change existing checkout behavior without evidence that the business requires it.

## Risks / Trade-offs
- Transaction voids and shift reconciliation both affect persisted financial records.
  - Mitigation: Require feature coverage for status filters, stock restoration, and shift summary math before implementation is considered complete.

- Grouped sidebar navigation can imply more destinations than the current route set exposes.
  - Mitigation: Allow grouped entries to land on consolidated workspaces as long as the documented tasks remain discoverable from those pages.

- Customer purchase history can add heavier queries to the operations workflow.
  - Mitigation: Start with recent or paginated transaction history and reuse transaction detail pages instead of duplicating full receipt content inside customer management.

## Migration Plan
1. Extend transaction status handling to support a cancelled or voided state in both model logic and history filters.
2. Extend shift storage and calculation logic to persist or derive expected cash, cash difference, and shift sales summaries.
3. Add UI updates for grouped navigation, customer history linking, and tax defaults after the supporting data paths exist.
4. Verify the new behaviors with feature tests and the existing frontend build.

## Open Questions
- None. The proposal scope is limited to the remaining uncovered behaviors from the source document, and void semantics have been confirmed as separate from refunds.
