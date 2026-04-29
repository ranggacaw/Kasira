## Context
`docs/design-model.md` defines an "Anvil Premium POS" visual system with warm neutral surfaces, Anvil Red primary actions, Manrope typography, tactile shadows, rounded shapes, and a layout model optimized for premium POS hardware and tablets. The current app already includes the route-level structure for a public landing page, auth pages, a protected back-office shell, and a dedicated POS shell, but those surfaces do not yet share a stable tokenized design language.

There is also an active change, `align-mobile-tablet-pwa-pos`, that broadens Kasira's route map and protected page coverage. This proposal intentionally stays separate so the product-surface and workflow contract can evolve independently from the visual system, while still designing against that target information architecture.

## Goals / Non-Goals
- Goals:
  - Turn `docs/design-model.md` into the authoritative design source for the whole app.
  - Establish reusable tokens and component styling rules rather than continuing page-local class decisions.
  - Redesign public, auth, back-office, POS, receipt, report, and settings surfaces to feel like one premium product.
  - Allow UX-level layout and hierarchy improvements where the current page structure fights the target design model.
- Non-Goals:
  - Change business rules, permissions, checkout calculations, or reporting logic.
  - Introduce a third-party component library or full design-token build pipeline unless the existing Tailwind/CSS stack proves insufficient.
  - Block the active mobile/tablet POS change from landing first if implementation sequencing requires it.

## Decisions
- Decision: Keep this proposal separate from `align-mobile-tablet-pwa-pos`.
  - Why: That active change defines workflow, route, and capability alignment, while this change defines the cross-app visual and UX layer. Splitting the proposals keeps review scope understandable and reduces spec churn.
  - Alternatives considered: Extending the active change would mix business workflow alignment with a broad design-system pass and make both harder to reason about.

- Decision: Express the design model through Tailwind theme extensions, shared CSS variables, and a small set of reusable layout/presentation primitives.
  - Why: Kasira already uses Tailwind with a very light global CSS layer. Extending the existing stack is lower risk than introducing a new theming framework.
  - Alternatives considered: A parallel design-token compiler or CSS-in-JS layer would add complexity without solving a concrete problem the current stack cannot handle.

- Decision: Add a dedicated `visual-design-system` capability and layer page-specific presentation requirements onto major existing capabilities.
  - Why: Shared visual rules such as tokens, tactile states, type hierarchy, and spacing should be specified once, while page-level UX expectations still need to live with the capabilities they shape.
  - Alternatives considered: Putting all visual expectations into one umbrella requirement would underspecify page behavior and make acceptance too vague.

- Decision: Permit layout and hierarchy changes, but keep route names and page ownership aligned with the mobile/tablet POS direction.
  - Why: The request explicitly asks for UX redesign too, but design work should not re-open the route taxonomy or business-logic changes already being stabilized elsewhere.
  - Alternatives considered: Restricting the work to a pure reskin would fail to use the design model's layout guidance such as the POS power zone, tactile cards, and report hierarchy.

## Risks / Trade-offs
- Broad visual scope can create a very large frontend branch.
  - Mitigation: Implement in layers: tokens first, shells second, then page groups by workflow.

- The active `align-mobile-tablet-pwa-pos` change and this change may touch the same pages.
  - Mitigation: Treat that change's routes and page set as the target surface, and rebase design work after its structure is settled where needed.

- Strong visual changes can invalidate brittle frontend assertions or snapshots.
  - Mitigation: Prefer behavior-oriented tests plus focused visual verification for shared shells and key POS layouts.

## Migration Plan
1. Introduce global Anvil tokens, typography, and base surface styles.
2. Redesign shared shells and public/auth surfaces.
3. Redesign the POS workspace around the tactile premium model.
4. Redesign back-office modules in workflow groups: dashboard, catalog/inventory, transactions, reports, settings.
5. Finish receipt and edge surfaces, then run responsive visual QA and build/test validation.

## Open Questions
- None for the proposal scope. The user confirmed this should be a separate change, cover the entire app, and allow UX redesign in addition to visual restyling.
