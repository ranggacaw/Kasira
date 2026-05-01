## MODIFIED Requirements
### Requirement: Mobile and Tablet POS Layout
Kasira SHALL render POS as a full-screen touch-first workspace for mobile phones and tablets without using the back-office sidebar, using a floating or drawer cart on phone-sized viewports and a persistent split cart panel on tablet-sized viewports.

#### Scenario: Cashier uses POS on mobile
- **WHEN** a cashier opens the POS workspace on a phone-sized viewport
- **THEN** the application shows a touch-friendly product grid with a category scroller, floating cart access, and a cart drawer optimized for bottom reach

#### Scenario: Cashier uses POS on tablet
- **WHEN** a cashier opens the POS workspace on a tablet-sized viewport
- **THEN** the application shows a split layout with product browsing on one side and the cart summary on the other side

#### Scenario: Cashier uses POS in standalone mode
- **WHEN** a cashier launches the installed PWA into the POS workspace on a phone or tablet
- **THEN** the header, cart controls, and checkout actions respect standalone safe areas and remain reachable without relying on the back-office shell
