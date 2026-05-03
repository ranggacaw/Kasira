## 1. Implementation
- [x] 1.1 Update PWA shell assets and metadata so supported browsers expose a complete installable experience, including manifest completeness, theme metadata, and standalone shell handling.
- [x] 1.2 Add install entry points and fallback messaging that make PWA installation understandable on supported phone and tablet browsers.
- [x] 1.3 Refine `GuestLayout` and public/auth pages so landing and authentication screens are responsive, touch-friendly, and free from horizontal overflow on mobile and tablet.
- [x] 1.4 Refine `AuthenticatedLayout` and `AppSidebar` so protected non-POS pages consistently use drawer navigation on mobile and collapsible touch-friendly sidebar behavior on tablet.
- [x] 1.5 Refactor `PosLayout` and POS pages so checkout is sidebar-free, touch-first, and maintains reachable cart and payment actions on mobile and tablet, including standalone mode.
- [x] 1.6 Sweep major protected pages for responsive regressions under the updated shared shells, including dashboard, products, categories, inventory, transactions, settings, profile, premium, and operations views.

## 2. Validation
- [x] 2.1 Verify installability and standalone launch behavior in supported browsers at phone and tablet sizes.
- [x] 2.2 Verify offline re-entry and offline fallback messaging after at least one protected route has been loaded.
- [x] 2.3 Validate responsive behavior in browser device emulation for a phone-sized viewport and an iPad-class tablet viewport.
- [x] 2.4 Run `npm run build`.
- [x] 2.5 Run `php artisan test`.
