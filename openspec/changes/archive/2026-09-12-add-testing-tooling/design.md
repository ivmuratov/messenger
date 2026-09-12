## Context

См. `proposal.md` — Why.

Текущее состояние:

- Test-скрипты и конфиги отсутствуют; `pnpm test` не определён
- `docs/agents/tester.md` описывает component tests — устаревший scope
- `openspec/config.yaml` упоминает «vitest planned», pre-commit без тестов
- Playwright MCP настроен в `.cursor/mcp.json` для агента, но `@playwright/test` не установлен
- В `@ui` уже есть хуки (`useThemeSwitcher`, `useDrawerLayoutContext`); `@core` пуст

Ограничения: pnpm strict deps, Turbo per-package tasks, syncpack exact versions, Node >= 22.21.1, Vite 7 в web.

## Goals / Non-Goals

**Goals:**

- Test-зависимости только в `@core`, `@ui`, `web` — root без vitest/RTL/jsdom/msw/playwright
- Per-package `vitest.config.ts` + root `vitest.shared.config.ts` (TS-файл, не npm-пакет)
- `pnpm test` (Turbo) и `pnpm test:e2e` (web Playwright)
- Syncpack-группа Testing для выравнивания версий
- Playwright infra в `apps/web` (config + `e2e/`), без spec-файлов
- Обновление `docs/agents/tester.md` и `openspec/config.yaml`

**Non-Goals:**

- Написание `*.test.ts` / `*.spec.ts` — следующая итерация
- Component tests, jest-dom, user-event, react-native testing
- Mobile test deps и e2e
- Unit-тесты Reanimated-хуков
- Pre-commit / CI integration для тестов

## Decisions

### 1. Test-зависимости только в целевых пакетах

**Решение:** devDependencies в пакетах, не в root.

| Пакет | devDependencies |
|-------|-----------------|
| `@core` | `vitest@5.0.0`, `@testing-library/react@16.3.3`, `jsdom@30.0.1`, `msw@2.15.0` |
| `@ui` | `vitest@5.0.0`, `@testing-library/react@16.3.3`, `jsdom@30.0.1` |
| `web` | `vitest@5.0.0`, `@testing-library/react@16.3.3`, `jsdom@30.0.1`, `@playwright/test@1.63.0` |
| root | _(без test deps)_ |
| `mobile` | _(без test deps)_ |

**Почему:** pnpm-семантика — пакет объявляет то, что импортирует; Turbo кэширует `test` per-package.

**Альтернатива:** vitest в root — ломает per-package `vitest run` без `pnpm -w exec`.

**Owner:** `@core`, `@ui`, `web`

### 2. Vitest 5.0.0

**Решение:** последняя стабильная `vitest@5.0.0`.

**Совместимость:** Vitest 5 требует Node >= 22.12.0 и Vite >= 6.4.0 — проект на Node >= 22.21.1 и Vite 7.0.4, совместим.

**Owner:** `@core`, `@ui`, `web`

### 3. Per-package vitest.config.ts + root vitest.shared.config.ts

**Решение:**

```
root/vitest.shared.config.ts          — globals, include pattern, coverage defaults
packages/core/vitest.config.ts — environment: node, alias @/ → ./src
packages/ui/vitest.config.ts   — environment: jsdom, alias @/ → ./src
apps/web/vitest.config.ts      — environment: jsdom, alias @/ → ./src
```

Shared config экспортирует объект настроек; пакеты импортируют через relative path `../../vitest.shared.config.ts`.

`include`: `src/**/__tests__/**/*.test.{ts,tsx}` — тесты только в `__tests__/` на уровне с модулем; при отсутствии файлов vitest exit 0.

**Owner:** root (shared), `@core`, `@ui`, `web` (configs)

### 4. Environment по слою

**Решение:**

- `@core`: `environment: "node"` — lib, stores; hooks с MSW + jsdom при необходимости через `@vitest/environment-jsdom` или override в конкретном файле `@vitest-environment jsdom`
- `@ui`, `web`: `environment: "jsdom"` — hooks через `renderHook`

**Owner:** `@core`, `@ui`, `web`

### 5. Playwright только в web

**Решение:** `@playwright/test@1.63.0` в `apps/web`.

```
apps/web/
  playwright.config.ts
  e2e/.gitkeep
```

Конфиг:

- `testDir: "./e2e"`
- `webServer`: `pnpm dev` (port из `WEB_PORT` или 3000)
- CI-ready: `reporter: "list"`, `retries: 0` локально

Без spec-файлов Playwright завершится с «no tests found» — для infra-итерации допустимо использовать `passWithNoTests` или пустой placeholder. **Предпочтение:** конфиг с `testMatch` и пустая `e2e/` — Playwright 1.63 exit code 1 без тестов. Нужно проверить — возможно добавить минимальный smoke placeholder ИЛИ использовать `--pass-with-no-tests` в script.

Actually user said NO tests. Playwright without tests might fail. Let me check - in tasks we should use `"test:e2e": "playwright test --pass-with-no-tests"` or similar flag.

Playwright has `--pass-with-no-tests` flag since some version. I'll put this in design/tasks.

**Owner:** `web`

### 6. Turbo и root scripts

**Решение:**

```json
// root package.json
"test": "turbo run test",
"test:e2e": "pnpm --filter web test:e2e"

// turbo.json
"test": { "dependsOn": ["^test"] }

// each package
"test": "vitest run",
"test:watch": "vitest"  // optional, web only or all
```

**Owner:** root, `@core`, `@ui`, `web`

### 7. Syncpack группа Testing

**Решение:** добавить versionGroup в `syncpack.config.ts`:

```typescript
{
  label: "Testing",
  dependencies: [
    "vitest",
    "@testing-library/react",
    "jsdom",
    "msw",
    "@playwright/test",
  ],
  packages: ["**"],
  policy: "sameRange",
}
```

**Owner:** root

### 8. Обновление docs/agents/tester.md

**Решение:** убрать component tests и react-native testing; описать unit (lib, stores), hooks (`renderHook`), e2e web; указать размещение в `__tests__/*.test.ts` на уровне с модулем.

**Пример структуры:**

```
lib/
  validateSession.ts
  __tests__/
    validateSession.test.ts
hooks/
  useThemeSwitcher.ts
  __tests__/
    useThemeSwitcher.test.ts
```

**Owner:** root (docs)

## Risks / Trade-offs

| Риск | Митигация |
|------|-----------|
| Vitest 5 — breaking changes vs 4.x | Проект без существующих тестов; миграция не нужна |
| Playwright exit 1 без spec-файлов | `--pass-with-no-tests` в script `test:e2e` |
| Reanimated hooks в `@ui` не тестируются unit-тестами | Non-goal; extracted logic или mobile e2e позже |
| `@/` alias в vitest | `resolve.alias` в per-package config, зеркалит tsconfig paths |
| Дублирование deps в 3 пакетах | Syncpack + exact versions |

## Migration Plan

1. Syncpack — добавить группу Testing
2. Установить deps в `@core`, `@ui`, `web`
3. Создать `vitest.shared.config.ts` и per-package configs
4. Добавить scripts + turbo task
5. Playwright config + `e2e/` в web
6. `pnpm install`, `playwright install chromium`
7. Обновить docs и openspec config
8. Verify: `pnpm test`, `pnpm test:e2e`, `pnpm syncpack:list`

**Rollback:** revert commits; удалить configs и test deps из package.json.

## Open Questions

_(нет — scope зафиксирован в explore-сессии)_
