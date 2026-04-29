---
name: Anvil Premium POS
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1b1c'
  on-surface-variant: '#564241'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#897170'
  outline-variant: '#ddc0be'
  surface-tint: '#a23c3e'
  primary: '#9e3a3c'
  on-primary: '#ffffff'
  primary-container: '#be5252'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb3b0'
  secondary: '#715859'
  on-secondary: '#ffffff'
  secondary-container: '#fcdbdb'
  on-secondary-container: '#775e5f'
  tertiary: '#006a45'
  on-tertiary: '#ffffff'
  tertiary-container: '#008558'
  on-tertiary-container: '#f6fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b0'
  on-primary-fixed: '#410006'
  on-primary-fixed-variant: '#822529'
  secondary-fixed: '#fcdbdb'
  secondary-fixed-dim: '#debfbf'
  on-secondary-fixed: '#281717'
  on-secondary-fixed-variant: '#574142'
  tertiary-fixed: '#88f8bf'
  tertiary-fixed-dim: '#6bdba5'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005234'
  background: '#fcf9f8'
  on-background: '#1b1b1c'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  label-bold:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.02em
  price-display:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 64px
  gutter: 16px
  margin: 24px
---

## Brand & Style
The design system is engineered for high-end retail environments where speed meets sophistication. The brand personality is grounded, reliable, and warm—moving away from the cold, clinical feel of traditional hardware interfaces. 

The aesthetic follows a **Modern Corporate** style with **Tactile** undertones. It prioritizes clarity through generous white space and high-contrast hits of "Anvil Red." By balancing professional utility with a premium, soft-touch visual language, the interface reduces cognitive load for operators while reflecting the high-quality service of the brand.

## Colors
The palette is anchored by the Anvil Red spectrum, used strategically to guide the eye toward "Primary Actions" (Checkout, Confirm, Pay). 

- **Primary (#C95A5A):** Reserved for high-priority interactive elements.
- **Surface & Backgrounds:** The primary background uses a warm neutral (#FCFAFA) rather than pure white to reduce eye strain during long shifts. 
- **Feedback States:** Use Anvil Red 100 for subtle "Selected" row highlights and Anvil Red 700/800 for active touch states.
- **Typography:** Deep neutrals (#1F1F1F) provide crisp contrast against the warm backgrounds for maximum legibility under store lighting.

## Typography
**Manrope** is the exclusive typeface for this design system. It was selected for its modern, geometric structure and exceptional legibility at both large display sizes (Pricing) and small functional labels (SKUs).

- **Numerical Clarity:** Pricing should always use `price-display` or `headline-md` with semi-bold or bold weights to ensure totals are visible at a distance.
- **Hierarchy:** Use weight over size to differentiate between "Item Name" and "Item Description" within receipt lists.
- **Touch Optimization:** Line heights are slightly exaggerated to ensure text blocks remain legible even when truncated on smaller tablets.

## Layout & Spacing
The layout follows a **Fluid Grid** model designed for landscape-oriented POS terminals and tablets. It utilizes an 8px base unit to ensure consistent scaling across components.

- **The Power Zone:** Critical actions (Total, Charge, Tender) are anchored to the bottom-right quadrant for ergonomic thumb-access on handhelds or easy right-handed reach on terminals.
- **List Rhythm:** Itemized lists use a 12px gutter to prevent visual crowding during heavy-volume scanning.
- **Margins:** A standard 24px outer margin ensures the UI never feels cramped against the physical bezel of the hardware.

## Elevation & Depth
The design system employs **Tonal Layers** combined with **Ambient Shadows** to create a sense of physical layering. 

- **Level 0 (Surface):** The canvas background. 
- **Level 1 (Cards):** Low-opacity, diffused shadows (Blur: 12px, Y: 4, Opacity: 4%) to lift product cards or category buttons.
- **Level 2 (Modals/Overlays):** Medium-diffused shadows with a slight tint of Anvil Red 800 at 5% opacity to create focus.
- **Interaction:** On press, elements should visually "sink" by removing the shadow and applying a 1px inner border of Anvil Red 200, simulating a tactile button press.

## Shapes
The shape language is defined as **Rounded**, avoiding sharp industrial corners in favor of a softer, premium feel.

- **Buttons & Inputs:** Use a 0.5rem (8px) radius as the standard.
- **Product Containers:** Use 1rem (16px) for larger card containers to distinguish them from functional UI controls.
- **Search Bars:** Utilize full-pill shapes (rounded-xl) to differentiate navigation/search from transactional inputs.

## Components
- **Primary Action Button:** Solid Anvil Red 500 fill, white text, 8px radius. High-height (min 56px) for "Fat Finger" accessibility.
- **Category Chips:** Anvil Red 100 background with Anvil Red 700 text. Used for filtering menus or product tags.
- **Transaction List:** Zebra-striping is avoided; instead, use a 1px Neutral-100 bottom border for separation, with a 4px Anvil Red 500 vertical indicator for the currently "active" item being modified.
- **Input Fields:** Soft grey border (Neutral-100) that transitions to an Anvil Red 500 border on focus. Labels are always persistent above the field.
- **Numpad / Keypad:** Large, tactile blocks with 24px spacing between keys. The "Enter" or "Pay" key should be double-height or double-width in Anvil Red 500.
- **Status Badges:** Circular indicators for "In Stock" (Green), "Low Stock" (Anvil Red 500), or "Out of Stock" (Neutral-900).