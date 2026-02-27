---
name: create-core-module
description: Step-by-step guide for scaffolding a new business logic module in packages/core. Use when creating a new core module with store, API, hooks, and lib.
---

# Create Core Module

Scaffold a complete business logic module in `packages/core/src/modules/`.

## Subagents

Delegate when appropriate:

- **[researcher](../../agents/researcher.md)** — Explore existing modules before scaffolding. Use to find patterns, API structure, and shared utilities.
- **[reviewer](../../agents/reviewer.md)** — Review code quality after implementation. Use for independent verification before marking complete.

## Steps

### 1. Gather Requirements

Ask the user:

- Module name (e.g., `auth`, `chat`, `user`)
- What entities/types does the module manage?
- Does it need API integration (TanStack Query)?
- Does it need client state (Zustand store)?

### 2. Create Directory Structure

```
packages/core/src/modules/{moduleName}/
├── model/
│   ├── store.ts
│   └── types.ts
├── api/
│   ├── {moduleName}Api.ts
│   └── {moduleName}Queries.ts
├── hooks/
│   └── use{Feature}.ts
├── lib/
│   ├── {moduleName}Mapper.ts
│   └── {moduleName}Validators.ts
└── index.ts
```

### 3. Create Types (`model/types.ts`)

Define the core domain types for the module.

```typescript
export interface {Entity} {
  id: string;
  // ... entity fields
}

export interface {ModuleName}State {
  // ... store state shape
}
```

### 4. Create Store (`model/store.ts`)

```typescript
import { create } from "zustand";
import type { {ModuleName}State } from "./types";

export const use{ModuleName}Store = create<{ModuleName}State>()((set, get) => ({
  // initial state + actions
}));
```

### 5. Create API Client (`api/{moduleName}Api.ts`)

```typescript
import { httpClient } from "@/shared/api/httpClient";
import type { {Entity} } from "../model/types";

export const {moduleName}Api = {
  getAll: () => httpClient.get<{Entity}[]>("/{moduleName}"),
  getById: (id: string) => httpClient.get<{Entity}>(`/{moduleName}/${id}`),
  create: (data: Create{Entity}Dto) => httpClient.post<{Entity}>("/{moduleName}", data),
};
```

### 6. Create Query Hooks (`api/{moduleName}Queries.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { {moduleName}Api } from "./{moduleName}Api";

const keys = {
  all: ["{moduleName}"] as const,
  byId: (id: string) => [...keys.all, id] as const,
};

export function use{Entity}s() {
  return useQuery({ queryKey: keys.all, queryFn: {moduleName}Api.getAll });
}

export function use{Entity}(id: string) {
  return useQuery({ queryKey: keys.byId(id), queryFn: () => {moduleName}Api.getById(id) });
}
```

### 7. Create Public API (`index.ts`)

```typescript
export { use{ModuleName}Store } from "./model/store";
export type { {Entity}, {ModuleName}State } from "./model/types";
export { {moduleName}Api } from "./api/{moduleName}Api";
export { use{Entity}s, use{Entity} } from "./api/{moduleName}Queries";
```

### 8. Register in Root Export

Add the module export to `packages/core/src/index.ts`:

```typescript
export * from "./modules/{moduleName}";
```
