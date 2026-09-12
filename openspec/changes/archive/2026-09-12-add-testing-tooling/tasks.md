## 1. Syncpack (root)

- [x] 1.1 Добавить versionGroup «Testing» в `syncpack.config.ts`: `vitest`, `@testing-library/react`, `jsdom`, `msw`, `@playwright/test` с policy `sameRange` — verify: `pnpm syncpack:list` проходит без новых mismatch

## 2. Зависимости (@core)

- [x] 2.1 Добавить в `packages/core/package.json` devDependencies: `vitest@5.0.0`, `@testing-library/react@16.3.3`, `jsdom@30.0.1`, `msw@2.15.0` — verify: `grep vitest packages/core/package.json` находит 5.0.0
- [x] 2.2 Добавить script `"test": "vitest run"` в `packages/core/package.json` — verify: `pnpm --filter @core test` завершается с кодом 0 (0 tests)

## 3. Зависимости (@ui)

- [x] 3.1 Добавить в `packages/ui/package.json` devDependencies: `vitest@5.0.0`, `@testing-library/react@16.3.3`, `jsdom@30.0.1` — verify: версии совпадают с @core через `pnpm syncpack:list`
- [x] 3.2 Добавить script `"test": "vitest run"` в `packages/ui/package.json` — verify: `pnpm --filter @ui test` завершается с кодом 0

## 4. Зависимости и Playwright (web)

- [x] 4.1 Добавить в `apps/web/package.json` devDependencies: `vitest@5.0.0`, `@testing-library/react@16.3.3`, `jsdom@30.0.1`, `@playwright/test@1.63.0` — verify: `pnpm syncpack:list` без mismatch
- [x] 4.2 Добавить scripts: `"test": "vitest run"`, `"test:e2e": "playwright test --pass-with-no-tests"` — verify: оба скрипта завершаются с кодом 0
- [x] 4.3 Выполнить `pnpm install` и `pnpm --filter web exec playwright install chromium` — verify: chromium установлен

## 5. Vitest конфигурация (root + пакеты)

- [x] 5.1 Создать `vitest.shared.config.ts` в root: общие настройки (globals, include `src/**/__tests__/**/*.test.{ts,tsx}`, passWithNoTests) — verify: файл экспортирует shared config
- [x] 5.2 Создать `packages/core/vitest.config.ts`: extends shared, `environment: "node"`, alias `@/` → `./src` — verify: `pnpm --filter @core test` находит конфиг
- [x] 5.3 Создать `packages/ui/vitest.config.ts`: extends shared, `environment: "jsdom"`, alias `@/` → `./src` — verify: `pnpm --filter @ui test` находит конфиг
- [x] 5.4 Создать `apps/web/vitest.config.ts`: extends shared, `environment: "jsdom"`, alias `@/` → `./src` — verify: `pnpm --filter web test` находит конфиг

## 6. Playwright конфигурация (web)

- [x] 6.1 Создать `apps/web/playwright.config.ts`: `testDir: "./e2e"`, baseURL из `WEB_PORT` (default 3000), `webServer` для dev — verify: `pnpm --filter web test:e2e` запускается без ошибок конфигурации
- [x] 6.2 Создать `apps/web/e2e/.gitkeep` — verify: директория существует

## 7. Turbo и root scripts (root)

- [x] 7.1 Добавить task `test` в `turbo.json` с `dependsOn: ["^test"]` — verify: turbo распознаёт task
- [x] 7.2 Добавить в root `package.json` scripts: `"test": "turbo run test"`, `"test:e2e": "pnpm --filter web test:e2e"` — verify: root `package.json` MUST NOT содержать vitest/playwright в devDependencies
- [x] 7.3 Выполнить `pnpm install` для обновления lockfile — verify: `pnpm test` проходит через turbo для @core, @ui, web

## 8. Документация (root)

- [x] 8.1 Обновить `docs/agents/tester.md`: unit (lib, stores), hooks через `renderHook`, e2e web; размещение тестов в `__tests__/*.test.ts` на уровне с модулем; убрать component tests и react-native testing — verify: grep «компонент» / «react-native» в секции «Что тестировать» пуст; в секции размещения упоминается `__tests__/`
- [x] 8.2 Обновить `openspec/config.yaml`: verification commands с `pnpm test`, убрать «planned» для vitest — verify: config упоминает `pnpm test`

## 9. Финальная верификация (root)

- [x] 9.1 Quality gates — verify: `pnpm test && pnpm test:e2e && pnpm lint && pnpm typecheck && pnpm syncpack:list`
- [x] 9.2 OpenSpec validation — verify: `openspec validate add-testing-tooling --strict` проходит
