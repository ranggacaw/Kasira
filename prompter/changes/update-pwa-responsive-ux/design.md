## Context
Kasira already ships with a manifest, service worker registration, and an offline fallback page, so installable PWA support exists in partial form. The current UI also includes a drawer-style back-office shell and some POS mobile behavior, but the experience is inconsistent across shells: public/auth pages still behave like generic centered forms, the POS layout still includes sidebar-oriented structure, and the install flow is largely technical rather than productized.

The requested outcome is narrower than a platform rewrite. The app should remain a web application, become clearly installable as a PWA, and present responsive phone and tablet UX across public, back-office, and cashier surfaces.

## Goals / Non-Goals
- Goals:
- Make installable PWA behavior visible and reliable on supported mobile and tablet browsers.
- Align public, authentication, back-office, and POS shells around one responsive interaction model.
- Preserve the shared `AppSidebar` for authenticated non-POS pages while removing sidebar dependence from the POS workspace.
- Improve touch ergonomics, spacing, and viewport handling without introducing a parallel native-app architecture.
- Non-Goals:
- Ship Android or iOS store wrappers such as Capacitor, TWA, or React Native containers.
- Add advanced offline transaction sync, background sync queues, or device-native hardware integrations.
- Redesign every module with unique page-specific patterns when the change can be solved through shared shells and responsive component rules.

## Decisions
- Decision: Build on the current manifest and service worker foundation instead of introducing a new PWA plugin by default.
- Why: The repository already exposes `manifest.webmanifest`, `sw.js`, and explicit registration in `resources/js/app.jsx`. Extending those assets is the smallest path to a reliable installable shell.
- Alternatives considered: Adopting `vite-plugin-pwa` immediately would add toolchain complexity before there is a proven need for automated precache management.

- Decision: Treat the responsive work as three coordinated shell updates: public/auth guest surfaces, authenticated back-office surfaces, and the dedicated POS workspace.
- Why: These shells have different navigation and density needs, but they should still share breakpoints, spacing rules, and touch behavior.
- Alternatives considered: Driving the entire change from page-level tweaks would create inconsistent behavior and duplicate layout logic.

- Decision: Keep `AppSidebar` as the required navigation primitive for protected non-POS pages and explicitly exclude it from the cashier workspace.
- Why: Project notes already require `resources/js/Components/AppSidebar.jsx` for authenticated sidebar UI, while the POS spec already defines a dedicated cashier layout.
- Alternatives considered: Creating a second back-office navigation variant would increase maintenance cost, and keeping a sidebar in POS would conflict with the touch-first checkout goal.

- Decision: Encode responsive UX expectations in shared design-system requirements rather than only in page-specific specs.
- Why: Touch target sizing, safe-area padding, overflow rules, and tablet density are cross-cutting concerns that should stay reusable.
- Alternatives considered: Repeating the same responsive rules in every module spec would make future UI changes harder to maintain.

## Risks / Trade-offs
- A broad responsive pass can sprawl across too many pages.
- Mitigation: Sequence implementation through shared shells first, then verify each major page group against the updated shell contract.

- Manual service worker behavior may still be more limited than a full PWA plugin setup.
- Mitigation: Keep the proposal focused on installability and offline shell re-entry; revisit automation only if validation shows caching gaps.

- Tightening the POS mobile/tablet contract may require restructuring current layout composition.
- Mitigation: Capture the no-sidebar rule explicitly in the POS spec so implementation can simplify rather than patch around the current shell.

## Migration Plan
1. Update shared PWA metadata, install flow expectations, and standalone shell handling.
2. Rework public and auth shells to satisfy phone and tablet responsive rules.
3. Refine the authenticated back-office shell around drawer mobile navigation and tablet-friendly sidebar behavior.
4. Remove sidebar-oriented structure from POS and align cart, browsing, and checkout zones with phone/tablet ergonomics.
5. Validate installability, offline fallback, and responsive behavior before broader visual polish follow-ups.

## Open Questions
- None. The install target is limited to an installable PWA, and the responsive pass covers all app screens.
