# Change: Strengthen installable PWA behavior and responsive UI/UX

## Why
Kasira already has baseline manifest, service worker, and mobile-oriented shell work, but the current experience is still uneven across public, back-office, and POS screens. The product direction is now explicit: the app should be installable as a PWA and feel intentionally designed for phone and tablet use across the entire application.

## What Changes
- Refine the existing PWA shell contract so installability includes clear install entry points, standalone-safe spacing, and touch-friendly shell behavior on supported mobile and tablet browsers.
- Extend the design system and bootstrap specs with shared responsive rules for public and authentication screens, including touch targets, safe-area spacing, and no-overflow layout expectations.
- Tighten the POS checkout layout contract so the cashier workspace remains sidebar-free, touch-first, and optimized for mobile and tablet checkout ergonomics.
- Keep the implementation scoped to installable PWA behavior and responsive UI/UX adjustments, without expanding into native app packaging or advanced offline commerce sync.

## Impact
- Affected specs: `bootstrap-application`, `pwa-shell`, `visual-design-system`, `pos-checkout`
- Affected code: `resources/views/app.blade.php`, `resources/js/app.jsx`, `public/manifest.webmanifest`, `public/sw.js`, `resources/js/Layouts/GuestLayout.jsx`, `resources/js/Layouts/AuthenticatedLayout.jsx`, `resources/js/Layouts/PosLayout.jsx`, `resources/js/Components/AppSidebar.jsx`, `resources/js/Pages/Welcome.jsx`, `resources/js/Pages/Auth/**`, `resources/js/Pages/Pos/**`, and major protected pages under `resources/js/Pages/**`
