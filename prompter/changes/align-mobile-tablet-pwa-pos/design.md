## Context
Kasira currently exposes its MVP through a shared authenticated shell with top navigation, route groups such as `/catalog` and `/operations`, and a POS flow mounted at `/pos/checkout`. The provided product specification calls for a different contract: `/pos` as a dedicated cashier workspace, sidebar-based back-office navigation for every non-POS page, a stronger mobile/tablet bias, and a formal distinction between baseline PWA behavior and premium offline or connected-commerce behavior.

The repository already contains partial PWA support through `resources/views/app.blade.php`, `resources/js/app.jsx`, `public/manifest.webmanifest`, and `public/sw.js`, so this proposal treats PWA support as an existing but underspecified baseline rather than a brand new subsystem.

## Goals / Non-Goals
- Goals:
  - Realign the product surface and route taxonomy with the mobile/tablet POS specification.
  - Separate the dedicated POS shell from the back-office shell.
  - Capture baseline PWA behavior and advanced premium PWA behavior in distinct requirements.
  - Preserve the current phased delivery model so implementation can ship incrementally.
- Non-Goals:
  - Rebuild every module in a single implementation pass.
  - Commit to desktop-first layouts or legacy route names as the long-term contract.
  - Move all premium behavior into the MVP baseline.

## Decisions
- Decision: Model the change as a cross-cutting realignment of existing capabilities plus a small number of new specs.
  - Why: The requested document changes multiple current contracts at once, but much of the behavior already maps to existing capabilities such as checkout, dashboard, inventory, outlets, and role access. Reusing those specs keeps the change understandable and archive-friendly.
  - Alternatives considered: Creating one entirely new umbrella spec for the whole product would duplicate the existing spec tree and make archival harder.

- Decision: Split layout requirements between `pwa-shell` and `pos-checkout`.
  - Why: The back-office drawer/collapsible sidebar behavior applies to every non-POS module, while the full-screen no-sidebar cashier workspace is specific to POS.
  - Alternatives considered: Encoding all layout rules into `bootstrap-application` would make the shell requirements too broad and less actionable.

- Decision: Keep baseline installability and offline shell access separate from premium offline draft sync and connected commerce.
  - Why: The codebase already has a manifest and service worker, which fits a baseline PWA shell. The requested advanced flows such as offline draft sync, thermal printing, QRIS integration, and split payment add materially different complexity and should stay staged behind plan-aware capabilities.
  - Alternatives considered: Treating all PWA behavior as premium would underspecify the existing baseline; treating all advanced offline behavior as MVP would create an unnecessarily large first implementation.

- Decision: Use outlet resolution from authenticated user context or the `outlet` query parameter as the standard scoping rule.
  - Why: This matches the existing project notes and keeps dashboard, catalog, POS, inventory, and transaction filters aligned around one predictable source of truth.
  - Alternatives considered: Introducing separate outlet-resolution rules per module would create inconsistent behavior across the app.

## Risks / Trade-offs
- Route churn may break existing bookmarks or tests.
  - Mitigation: Stage the route renames with redirects or compatibility handling during rollout, then remove temporary aliases after the UI fully migrates.

- A shared implementation pass across many modules could become too large.
  - Mitigation: Keep the implementation sequenced around shell, POS, catalog, transactions, and PWA milestones instead of attempting a single branch-wide rewrite.

- The requested specification includes both baseline and premium behavior.
  - Mitigation: Make the separation explicit in spec deltas and tasks so implementation can defer advanced behavior without losing the product intent.

## Migration Plan
1. Establish the new role, route, and shell contracts.
2. Migrate POS onto its dedicated `/pos` workspace and back-office pages onto the sidebar shell.
3. Update dashboard, catalog, inventory, transactions, outlets, receipts, and settings to the new information architecture.
4. Expand PWA support for the installable shell and offline notice.
5. Layer premium reporting and advanced commerce behaviors after the baseline shell and MVP workflows stabilize.

## Open Questions
- Should legacy routes such as `/catalog`, `/operations`, and `/pos/checkout` remain as temporary redirects during rollout, or can they be removed immediately once the new UI ships?
