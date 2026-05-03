## ADDED Requirements
### Requirement: Responsive Touch Layout Rules
Kasira SHALL define and apply shared responsive layout rules for phone and tablet experiences, including safe-area padding, minimum touch target sizing, breakpoint-aware spacing, and overflow behavior that keeps primary actions reachable.

#### Scenario: Shared UI is rendered on a phone
- **WHEN** a shared button, input, card, drawer, table wrapper, or header action is rendered on a phone-sized viewport
- **THEN** the surface uses touch-friendly sizing and spacing rules from the shared design system instead of page-local mobile overrides

#### Scenario: Shared UI is rendered on a tablet or installed shell
- **WHEN** those same shared surfaces are rendered on a tablet-sized viewport or inside standalone display mode
- **THEN** the layout uses the shared responsive rules to preserve readable density, safe-area padding, and stable navigation hierarchy
