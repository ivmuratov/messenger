---
name: add-feature
description: Plan and implement a new feature across the messenger monorepo layers.
disable-model-invocation: true
---

# Add Feature

Orchestrate the creation of a complete feature that may span core, ui, web, and mobile packages.

## Instructions

1. Ask me to describe the feature and its requirements
2. Analyze which layers are affected:
   - `packages/core/` — business logic, state, API calls
   - `packages/ui/` — reusable UI components
   - `apps/web/` — web-specific routes and pages
   - `apps/mobile/` — mobile-specific screens
3. Create a plan listing all files to create or modify per layer
4. Implement in dependency order:
   - **Step 1**: Core module (types, store, API, hooks)
   - **Step 2**: UI components (if new shared components needed)
   - **Step 3**: Web integration (routes, pages)
   - **Step 4**: Mobile integration (screens)
5. Verify cross-layer integration:
   - Imports resolve correctly
   - Types are compatible across layers
   - Run `pnpm typecheck`

## Subagents

Delegate to these agents when appropriate:

- **[researcher](../../agents/researcher.md)** — Explore the codebase before planning. Use when you need to understand existing patterns, module connections, or gather context across layers.
- **[reviewer](../../agents/reviewer.md)** — Review code quality after implementation. Use when you want independent verification of changes before marking the feature complete.
