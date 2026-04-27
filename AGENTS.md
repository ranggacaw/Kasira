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
- The initial authorization model is role-based with `Owner`, `Admin`, and `Cashier` stored in the `roles` table.
