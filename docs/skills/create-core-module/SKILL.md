---
name: create-core-module
description: Пошаговое руководство по созданию нового модуля бизнес-логики в packages/core. Используйте при создании нового core-модуля со store, API, hooks и lib.
---

# Создание Core-модуля

Создание полноценного модуля бизнес-логики в `packages/core/src/modules/`.

## Субагенты

Делегируй при необходимости:

- **[researcher](../../agents/researcher.md)** — Исследуй существующие модули перед созданием. Используй для поиска паттернов, структуры API и общих утилит.
- **[reviewer](../../agents/reviewer.md)** — Проверь качество кода после реализации. Используй для независимой проверки перед завершением.

## Шаги

### 1. Собери требования

Спроси у пользователя:

- Имя модуля (например, `auth`, `chat`, `user`)
- Какие сущности/типы модуль управляет?
- Нужна ли интеграция с API (TanStack Query)?
- Нужно ли клиентское состояние (Zustand store)?

### 2. Создай структуру директорий

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

### 3. Создай типы (`model/types.ts`)

Определи основные доменные типы модуля.

```typescript
export interface {Entity} {
  id: string;
  // ... поля сущности
}

export interface {ModuleName}State {
  // ... форма состояния store
}
```

### 4. Создай Store (`model/store.ts`)

```typescript
import { create } from "zustand";
import type { {ModuleName}State } from "./types";

export const use{ModuleName}Store = create<{ModuleName}State>()((set, get) => ({
  // начальное состояние + actions
}));
```

### 5. Создай API-клиент (`api/{moduleName}Api.ts`)

```typescript
import { httpClient } from "@/shared/api/httpClient";
import type { {Entity} } from "../model/types";

export const {moduleName}Api = {
  getAll: () => httpClient.get<{Entity}[]>("/{moduleName}"),
  getById: (id: string) => httpClient.get<{Entity}>(`/{moduleName}/${id}`),
  create: (data: Create{Entity}Dto) => httpClient.post<{Entity}>("/{moduleName}", data),
};
```

### 6. Создай Query-хуки (`api/{moduleName}Queries.ts`)

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

### 7. Создай публичный API (`index.ts`)

```typescript
export { use{ModuleName}Store } from "./model/store";
export type { {Entity}, {ModuleName}State } from "./model/types";
export { {moduleName}Api } from "./api/{moduleName}Api";
export { use{Entity}s, use{Entity} } from "./api/{moduleName}Queries";
```

### 8. Зарегистрируй в корневом экспорте

Добавь экспорт модуля в `packages/core/src/index.ts`:

```typescript
export * from "./modules/{moduleName}";
```
