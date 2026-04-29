## Context
Kasira is currently a Laravel 12, Inertia, React, and PostgreSQL application with two built capabilities: application bootstrap and POS checkout. The current codebase already contains a minimal `products` table plus checkout transaction persistence, but it does not yet define the broader business modules listed in `docs/add-module.md`.

Current implementation constraints:
- Protected pages live in `resources/js/Pages` and use the shared auth context from `HandleInertiaRequests.php`.
- Checkout totals remain server-authoritative before transactions are saved.
- Access control currently relies on a simple `roles` table and `role_id` on users.
- PostgreSQL is the runtime target, while tests should remain compatible with SQLite.

## Goals / Non-Goals
- Goals:
- Define the remaining module families as Prompter capabilities with clear acceptance criteria.
- Separate MVP operational modules from premium SaaS extensions.
- Preserve the current simple role model unless a capability explicitly requires broader access rules.
- Keep outlet-aware and plan-aware features explicit so later implementation work can stage schema changes cleanly.
- Non-Goals:
- Implement the modules in this change.
- Introduce external SaaS dependencies or vendor packages during proposal stage.
- Specify future enhancements such as AI insights, forecasting, multi-language, or mobile apps as immediate delivery commitments.

## Decisions
- Decision: Group the roadmap into focused capability specs rather than one monolithic spec.
- Alternatives considered: A single broad spec would be faster to author but would make validation, archiving, and later implementation sequencing harder.

- Decision: Keep MVP business operations and premium extensions in the same change proposal but separate them into distinct capability deltas.
- Alternatives considered: Separate change proposals per module would be smaller, but the user explicitly requested an umbrella proposal covering all listed modules.

- Decision: Treat categories as part of catalog management and treat customer membership as its own capability.
- Alternatives considered: Splitting categories into a separate capability would add another spec without a clear implementation benefit at this stage.

- Decision: Treat future enhancements from the document as deferred follow-up planning rather than normative requirements.
- Alternatives considered: Including them now would overcommit the roadmap beyond the currently requested module stack.

## Risks / Trade-offs
- Large approval surface -> Mitigated by phased tasks and separate capability deltas.
- Premium requirements can become too vague -> Mitigated by constraining them to plan gating, reporting, promotions, shifts, connected receipts, and offline-ready workflows already named in the source document.
- Multi-outlet touches many modules -> Mitigated by keeping outlet scoping explicit in its own capability so downstream changes can reference it consistently.

## Migration Plan
1. Approve this umbrella proposal.
2. Implement capabilities in phases, starting with catalog, inventory, transactions, and dashboard.
3. Layer organization and customer modules after MVP sales workflows are stable.
4. Add premium and monetization work after the operational baseline is live.

## Open Questions
- None for proposal scaffolding. The user requested the full module set and full scope, so sequencing is handled through phased tasks rather than by reducing scope.
