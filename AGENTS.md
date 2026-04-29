<!-- PROMPTER:START -->
# Prompter Instructions

These instructions are for AI assistants working in this project.

Always open `@/prompter/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/prompter/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines
- Show Remaining Tasks

<!-- PROMPTER:END -->

## Project Notes

- The application baseline uses Laravel 12, Inertia.js, React, Tailwind CSS, and PostgreSQL.
- Protected app pages should live in `resources/js/Pages` and receive auth context from `app/Http/Middleware/HandleInertiaRequests.php`.
- The POS checkout workspace lives under `resources/js/Pages/Pos`, while transaction totals remain authoritative on the server before sales are persisted.
- The operational authorization model is role-based with `Owner`, `Admin`, `Manager`, and `Cashier` stored in the `roles` table.
- Outlet-aware pages should resolve their current outlet from the authenticated user context or the `outlet` query parameter before loading products, stock, transactions, or dashboard metrics.
- Plan-aware features use the local `subscriptions` table as the source of Starter, Pro, and Business entitlements, including outlet and active-user limits.
