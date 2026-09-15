## MODIFIED Requirements

### Requirement: Unit-тесты через Vitest в целевых пакетах

Монорепозиторий MUST предоставлять возможность запуска unit-тестов в `@core`, `@ui` и `apps/web`. Test-зависимости MUST быть объявлены только в этих пакетах; root MUST NOT содержать vitest или связанные test-библиотеки как devDependencies.

#### Scenario: Запуск unit-тестов из корня

- **WHEN** разработчик выполняет `pnpm test` из корня монорепы
- **THEN** Turbo MUST запускать task `test` в `@core`, `@ui` и `web`
- **AND** команда MUST завершаться успешно, даже если тестовых файлов ещё нет (0 tests passed)

#### Scenario: Запуск unit-тестов одного пакета

- **WHEN** разработчик выполняет `pnpm --filter @core test`
- **THEN** Vitest MUST запускать тесты только для `packages/core`
- **AND** MUST использоваться per-package конфигурация с alias `@/` пакета

#### Scenario: Root без test-зависимостей

- **WHEN** проверяется root `package.json`
- **THEN** в devDependencies MUST NOT быть `vitest`, `@testing-library/react`, `jsdom`, `msw`, `@playwright/test`

### Requirement: Размещение и именование тестовых файлов

Unit-тесты MUST располагаться в пакете-владельце исходного кода. На одном уровне с тестируемым модулем (функцией, хуком, store) MUST быть директория `__tests__/`, внутри которой лежат файлы с суффиксом `.test.ts` или `.test.tsx`. Unit-тесты MUST NOT располагаться рядом с исходником без обёртки `__tests__/`.

#### Scenario: Test file в __tests__ рядом с lib-функцией

- **WHEN** модуль `packages/core/src/modules/auth/utils/validateSession.ts` получает тест
- **THEN** тестовый файл MUST находиться по пути `packages/core/src/modules/auth/utils/__tests__/validateSession.test.ts`

#### Scenario: Test file в __tests__ рядом с hook

- **WHEN** хук `packages/ui/src/components/ThemeSwitcher/hooks/useThemeSwitcher.ts` получает тест
- **THEN** тестовый файл MUST находиться по пути `packages/ui/src/components/ThemeSwitcher/hooks/__tests__/useThemeSwitcher.test.ts`

#### Scenario: Test file в app shared

- **WHEN** утилита `apps/web/src/shared/utils/formatRoute.ts` получает тест
- **THEN** тестовый файл MUST находиться по пути `apps/web/src/shared/utils/__tests__/formatRoute.test.ts`

### Requirement: Scope unit-тестов — логика и хуки, не компоненты

Unit-тесты MUST покрывать чистую логику (`utils/`), stores (в `store/`), selectors, API hooks и React hooks через `renderHook`. Component tests (рендер UI-кomponentов через `render(<Component />)`) MUST NOT быть частью текущей инфраструктуры. Platform-specific hooks и utils в `apps/web` MAY получать unit-тесты по мере появления.

#### Scenario: Hook test без component render

- **WHEN** тестируется React hook (например, `useThemeSwitcher`)
- **THEN** допускается `renderHook` с Provider-обёрткой контекста
- **AND** MUST NOT использоваться рендер UI-кomponentов как subject теста

#### Scenario: Core lib test

- **WHEN** тестируется чистая функция в `@core`
- **THEN** тест MAY выполняться в окружении `node` без DOM

