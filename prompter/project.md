# Project Context

## Purpose
Kasira is a modern web-based POS application for small to medium businesses such as cafes, retail stores, food stalls, and similar shops. The current codebase is establishing the MVP foundation before checkout, inventory, and reporting modules are layered in.

## Tech Stack
- Laravel 12
- Inertia.js with React
- Tailwind CSS
- PostgreSQL for the main application database
- Laravel Breeze for authentication scaffolding

## Project Conventions

### Code Style
- Prefer small, direct Laravel and React implementations over early abstraction.
- Keep feature slices scoped to one concern at a time.
- Reuse the existing Breeze and Inertia structure unless a change proposal calls for a broader pattern shift.

### Architecture Patterns
- Server-rendered routes return Inertia pages from `resources/js/Pages`.
- Shared authenticated user context is provided through `app/Http/Middleware/HandleInertiaRequests.php`.
- Initial access control uses a simple `roles` table plus a `role_id` relation on users.

### Testing Strategy
- Use Laravel feature tests for route, auth, seeding, and role-aware application behavior.
- Keep tests compatible with the default SQLite in-memory test configuration unless a change explicitly requires otherwise.

### Git Workflow
- Use Prompter changes for new capabilities and broader architecture work.
- Keep implementations aligned with the approved `prompter/changes/<id>/tasks.md` checklist.

## Domain Context
- MVP roles are Owner, Admin, and Cashier.
- The next major product slices are checkout, inventory management, and reporting.

## Important Constraints
- PostgreSQL is the primary runtime target for application environments.
- Avoid introducing heavy permission packages until the simple role model is no longer sufficient.
- The current foundation does not yet include checkout, inventory CRUD, or reporting logic.

## External Dependencies
- No third-party payment gateways or SaaS integrations are part of the current baseline.
