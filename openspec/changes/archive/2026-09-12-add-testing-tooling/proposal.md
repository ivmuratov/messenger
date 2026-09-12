## Why

В монорепе нет тестового стека: `pnpm test` отсутствует, pre-commit и CI опираются только на lint/typecheck/build. По мере появления модулей в `@core`, хуков в `@ui` и web-логики нужна инфраструктура для unit-тестов и e2e, чтобы фиксировать поведение до production-кода.

## What Changes

- Установка test-зависимостей **только в целевых пакетах** (не в root): `@core`, `@ui`, `apps/web`
- Per-package `vitest.config.ts` + shared `vitest.shared.config.ts` в root (без npm-dep в root)
- Скрипты `test` в пакетах, `pnpm test` и `pnpm test:e2e` в root через Turbo
- Playwright e2e только в `apps/web` (конфиг + `e2e/` директория, без тестовых файлов)
- Группа Testing в `syncpack.config.ts` для выравнивания версий
- Конвенция размещения unit-тестов: `__tests__/*.test.ts` на уровне с модулем (функция, хук, store)
- Обновление `turbo.json`, `docs/agents/tester.md`, `openspec/config.yaml`

## Capabilities

### New Capabilities

- `tooling/testing`: инфраструктура unit-тестов (Vitest) и web e2e (Playwright) для монорепы

### Modified Capabilities

_(нет)_

## Impact

- **root**: `package.json` (скрипты), `turbo.json`, `vitest.shared.config.ts` (новый), `syncpack.config.ts`
- **packages/core**: `package.json`, `vitest.config.ts` (новый)
- **packages/ui**: `package.json`, `vitest.config.ts` (новый)
- **apps/web**: `package.json`, `vitest.config.ts`, `playwright.config.ts`, `e2e/.gitkeep` (новые)
- **docs/agents/tester.md**: scope без component tests
- **openspec/config.yaml**: команды верификации с `pnpm test`

## Non-goals

- Написание тестовых файлов — следующая итерация
- Component tests (`render(<Component />)`, `@testing-library/jest-dom`, `user-event`)
- Mobile unit/e2e (`apps/mobile` без test deps)
- Unit-тесты Reanimated-хуков (`useDrawerLayoutRootMotion`) — отложено
- Добавление `pnpm test` в pre-commit и CI
- `@testing-library/react-native`
