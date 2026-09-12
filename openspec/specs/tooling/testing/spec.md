# testing Specification

## Purpose

Инфраструктура тестирования монорепозитория: unit-тесты бизнес-логики и хуков в пакетах, e2e-сценарии для web-приложения. Обеспечивает единообразный запуск тестов и подготовку к написанию тестов на следующих итерациях.

## Requirements

### Requirement: Unit-тесты через Vitest в целевых пакетах

Монорепозиторий MUST предоставлять возможность запуска unit-тестов в `@core`, `@ui` и `apps/web`. Test-зависимости MUST быть объявлены только в этих пакетах; root MUST NOT содержать vitest или связанные test-библиотеки как devDependencies.

#### Scenario: Запуск unit-тестов из корня

- **WHEN** разработчик выполняет `pnpm test` из корня монорепы
- **THEN** Turbo запускает task `test` в `@core`, `@ui` и `web`
- **AND** команда завершается успешно, даже если тестовых файлов ещё нет (0 tests passed)

#### Scenario: Запуск unit-тестов одного пакета

- **WHEN** разработчик выполняет `pnpm --filter @core test`
- **THEN** Vitest запускает тесты только для `packages/core`
- **AND** используется per-package конфигурация с alias `@/` пакета

#### Scenario: Root без test-зависимостей

- **WHEN** проверяется root `package.json`
- **THEN** в devDependencies MUST NOT быть `vitest`, `@testing-library/react`, `jsdom`, `msw`, `@playwright/test`

### Requirement: Размещение и именование тестовых файлов

Unit-тесты MUST располагаться в пакете-владельце исходного кода. На одном уровне с тестируемым модулем (функцией, хуком, store) MUST быть директория `__tests__/`, внутри которой лежат файлы с суффиксом `.test.ts` или `.test.tsx`. Unit-тесты MUST NOT располагаться рядом с исходником без обёртки `__tests__/`.

#### Scenario: Test file в __tests__ рядом с lib-функцией

- **WHEN** модуль `packages/core/src/modules/auth/lib/validateSession.ts` получает тест
- **THEN** тестовый файл MUST находиться по пути `packages/core/src/modules/auth/lib/__tests__/validateSession.test.ts`

#### Scenario: Test file в __tests__ рядом с hook

- **WHEN** хук `packages/ui/src/atoms/ThemeSwitcher/hooks/useThemeSwitcher.ts` получает тест
- **THEN** тестовый файл MUST находиться по пути `packages/ui/src/atoms/ThemeSwitcher/hooks/__tests__/useThemeSwitcher.test.ts`

### Requirement: Scope unit-тестов — логика и хуки, не компоненты

Unit-тесты MUST покрывать чистую логику (`lib/`, `utils/`), stores, API hooks и React hooks через `renderHook`. Component tests (рендер UI-компонентов через `render(<Component />)`) MUST NOT быть частью текущей инфраструктуры.

#### Scenario: Hook test без component render

- **WHEN** тестируется React hook (например, `useThemeSwitcher`)
- **THEN** допускается `renderHook` с Provider-обёрткой контекста
- **AND** MUST NOT использоваться рендер UI-компонентов как subject теста

#### Scenario: Core lib test

- **WHEN** тестируется чистая функция в `@core`
- **THEN** тест MAY выполняться в окружении `node` без DOM

### Requirement: Web e2e через Playwright

Web-приложение MUST иметь инфраструктуру e2e-тестов на базе Playwright. E2e MUST быть ограничен `apps/web`; `apps/mobile` MUST NOT получать e2e-зависимости в рамках этого change.

#### Scenario: Запуск e2e из корня

- **WHEN** разработчик выполняет `pnpm test:e2e` из корня
- **THEN** запускается Playwright для `apps/web`
- **AND** команда завершается успешно при отсутствии spec-файлов (пустой набор)

#### Scenario: E2e директория

- **WHEN** проверяется структура `apps/web`
- **THEN** MUST существовать `playwright.config.ts` и директория `e2e/`

### Requirement: Выравнивание версий test-зависимостей

Версии test-зависимостей MUST быть одинаковыми во всех пакетах, где они объявлены. Syncpack MUST контролировать расхождения.

#### Scenario: Syncpack обнаруживает mismatch

- **WHEN** версии `vitest` различаются между `@core` и `@ui`
- **THEN** `pnpm syncpack:list` MUST сообщать о несоответствии

### Requirement: Shared Vitest config без npm-зависимости в root

Общие настройки Vitest MUST быть вынесены в `vitest.shared.config.ts` в корне репозитория. Файл MUST NOT требовать установки vitest в root — пакеты импортируют shared config из своих `vitest.config.ts`.

#### Scenario: Per-package config extends shared

- **WHEN** `@core` запускает `vitest run`
- **THEN** `packages/core/vitest.config.ts` MUST импортировать общие настройки из root `vitest.shared.config.ts`
- **AND** MUST переопределять alias `@/` и environment для своего пакета
