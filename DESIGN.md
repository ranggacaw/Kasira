# Design System: Kasira

## 1. Visual Theme & Atmosphere

Kasira should feel like a warm, practical operations product: clean, calm, and trustworthy.
The UI should read as retail software, not a marketing site.

Core character:
- Soft neutral surfaces with low visual noise
- Muted rose as the main brand accent
- Rounded shapes, but not oversized or playful
- Thin borders and light elevation instead of heavy shadows
- Dense enough for business data, but still touch-friendly

## 2. Source Of Truth Tokens

Use the semantic Tailwind tokens already defined in `tailwind.config.js`.
Do not introduce ad-hoc names unless you add them to the config first.

### Surface Palette
- `bg-background` / `bg-surface`: page background
- `bg-surface-container-lowest`: primary cards, tables, forms
- `bg-surface-container-low`: nested cards, table headers, muted sections
- `bg-surface-container`: soft badges and secondary chips
- `text-on-surface`: main text
- `text-on-surface-variant`: supporting text
- `text-outline`: tertiary text, labels, subtle metadata

### Border Palette
- `border-outline-variant`: default card borders and dividers
- `border-outline`: interactive controls such as inputs and selects

### Brand And State Palette
- `bg-primary text-on-primary`: primary actions and hero emphasis
- `bg-secondary-container text-on-secondary-container`: neutral highlight blocks
- `bg-tertiary-fixed-dim text-on-tertiary-fixed`: positive status
- `bg-error-container text-on-error-container`: destructive or failed state

## 3. Typography Rules

Use the text utilities from `resources/css/app.css` as the default scale.

### Page Hierarchy
- Page title: `text-headline-md text-on-surface`
- Page description: `text-body-md text-on-surface-variant`
- Section title: `text-label-bold uppercase tracking-wide text-on-surface-variant`
- Body copy: `text-body-md`
- Large numeric values: `text-price-display` or `text-lg font-semibold`

Avoid mixing raw sizes like `text-2xl`, `text-sm`, `text-lg` for major hierarchy when a project utility already exists.
Raw sizes are acceptable for tiny table metadata and badges.

## 4. Layout Principles

### Page Shell
- Use a header with title on the left and controls on the right
- Major page sections use `space-y-6`
- Two-column workspaces should use one clear content split, for example `xl:grid-cols-[420px_1fr]`
- Mobile first: columns collapse to one stack without horizontal overflow

### Spacing Scale
- Page section gap: `gap-6` / `space-y-6`
- Card padding: `p-6`
- Dense card padding: `p-4`
- Toolbar control padding: `px-4 py-2` or `px-4 py-3`
- Inner card gaps: `gap-3` or `space-y-3`

Do not mix too many spacing rhythms on one page.
Default to `6 / 4 / 3` for outer / inner / dense spacing.

## 5. Shape Language

Use a restrained radius system.

- Large panels, forms, tables: `rounded-xl`
- Inner stat tiles and nested blocks: `rounded-lg` or `rounded-xl`
- Pills, filters, status chips: `rounded-full`

Avoid `rounded-2xl` for standard app surfaces unless there is a deliberate hero or modal treatment.

## 6. Elevation And Borders

Kasira should rely on soft containment, not dramatic depth.

### Standard Panel Recipe
Use this for most cards, sections, forms, and table shells:

```jsx
className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant"
```

### Nested Surface Recipe

```jsx
className="rounded-xl border border-outline-variant bg-surface-container-low p-4"
```

### Toolbar Control Recipe

```jsx
className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant"
```

Rules:
- Use `ring-1 ring-outline-variant` for primary containers
- Use `border border-outline-variant` for nested containers
- Avoid combining thick borders, strong shadows, and rings on the same element
- Prefer `bg-surface-container-lowest` over raw `bg-white`

## 7. Component Guidelines

### Headers
- Keep one clear page title and one supporting sentence
- Control groups on the right should align in one row on desktop and wrap on mobile

### Forms
- Form shell should match other page panels
- Inputs and selects use `border-outline` and a light surface fill
- Checkbox rows should be full-width structured rows, not floating isolated controls
- Sticky action bars should use the same panel surface and border treatment as the parent form

Recommended form field recipe:

```jsx
className="rounded-xl border border-outline bg-surface-container-low px-4 py-3 text-body-md text-on-surface"
```

### Tables
- Table container uses the standard panel recipe
- Table header row uses `bg-surface-container-low border-b border-outline-variant`
- Row separators use `border-b border-outline-variant`
- Hover state should be subtle: `hover:bg-surface-container-low`

### KPI And Stat Cards
- Use the nested surface recipe
- Labels stay muted and uppercase only when they are short
- Numeric emphasis should come from type weight, not bright colors alone

### Status Badges
- Default badge shape: `rounded-full px-3 py-1 text-xs font-semibold`
- Active / success: `bg-tertiary-fixed-dim text-on-tertiary-fixed`
- Neutral / inactive: `bg-surface-container text-on-surface-variant`
- Warning / stock attention: `bg-secondary-container text-on-secondary-container`
- Error / destructive: `bg-error-container text-on-error-container`

## 8. Consistency Rules For New Pages

When designing a new authenticated app page:

1. Start from one header pattern.
2. Use the standard panel recipe for every major section.
3. Use `surface-container-lowest` for outer cards and `surface-container-low` for inner blocks.
4. Use `outline-variant` for structure and `outline` for controls.
5. Use the typography utilities before inventing new headline sizes.
6. Keep border radius to `rounded-xl` for panels and `rounded-full` for pills.
7. Use brand color mainly for actions and emphasis, not as full-page decoration.

## 9. Current Inconsistencies To Avoid

These are the kinds of mismatches causing drift today:

- `Dashboard.jsx` uses `bg-white` while other areas use semantic surfaces
- `Products/Index.jsx` uses `rounded-2xl` while dashboard panels use `rounded-xl`
- `Products/Index.jsx` uses token names like `bg-surface-elevated` and `border-outline-var`, which are not defined in `tailwind.config.js`
- Some sections use `border`, some use `ring`, and some use both without a clear rule
- Headings mix custom text utilities and raw size classes without a shared hierarchy

## 10. Recommended Page Recipes

### Standard Authenticated Content Panel

```jsx
<div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant">
  <div className="flex items-center justify-between gap-4">
    <div>
      <h3 className="text-label-bold text-on-surface-variant">Section title</h3>
      <p className="mt-1 text-body-md text-on-surface-variant">Supporting copy.</p>
    </div>
  </div>
</div>
```

### Standard Filter Toolbar

```jsx
<div className="flex flex-wrap items-center gap-3">
  <input className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant" />
  <SelectInput className="rounded-full border border-outline bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface-variant" />
</div>
```

### Standard Data Table Shell

```jsx
<div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant">
  <div className="hidden lg:grid border-b border-outline-variant bg-surface-container-low" />
  <div className="border-b border-outline-variant hover:bg-surface-container-low" />
</div>
```

## 11. Implementation Rule

Before shipping a new page or redesign, check these five points:

1. Are all surfaces using semantic color tokens from `tailwind.config.js`?
2. Are all major cards using the same panel recipe?
3. Are borders using `outline-variant` for structure and `outline` for controls?
4. Is the radius mostly `rounded-xl` and `rounded-full` only where appropriate?
5. Does the page match the same type hierarchy as `Dashboard.jsx` after normalization?
