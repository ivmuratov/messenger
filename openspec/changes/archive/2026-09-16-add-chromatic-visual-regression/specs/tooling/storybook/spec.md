## ADDED Requirements

### Requirement: Visual regression через Chromatic

Монорепозиторий MUST обеспечивать автоматическое сравнение visual snapshots stories `@ui` через Chromatic. Тестируемый набор MUST совпадать с glob stories Storybook (`packages/ui/src/**/*.stories.tsx`). Baselines MUST храниться в Chromatic; локальный репозиторий MUST NOT содержать committed pixel-baseline артефакты.

#### Scenario: Локальный запуск visual regression

- **WHEN** разработчик с настроенным `CHROMATIC_PROJECT_TOKEN` выполняет `pnpm chromatic` из корня
- **THEN** MUST быть выполнена сборка Storybook (`build-storybook`)
- **AND** MUST быть отправлен build в Chromatic для сравнения snapshots
- **AND** команда MUST завершиться с ненулевым кодом при непринятых visual changes (exit code Chromatic)

#### Scenario: CI запуск на pull request

- **WHEN** открывается или обновляется pull request с изменениями в `@ui` stories или `apps/ui-storybook`
- **THEN** GitHub Actions MUST выполнить `build-storybook` и Chromatic
- **AND** MUST быть опубликован Chromatic build со ссылкой для review в PR
- **AND** job MUST завершиться ошибкой при непринятых visual changes

#### Scenario: Первый baseline для новой story

- **WHEN** добавляется новая story web-кomponenta в `@ui`
- **THEN** следующий успешный Chromatic run MUST создать baseline snapshot для этой story
- **AND** baseline MUST приниматься через Chromatic UI Review (accept changes)

### Requirement: Chromatic-зависимости только в ui-storybook

Пакет `chromatic` MUST быть объявлен только в `apps/ui-storybook` (devDependencies). Root, `@ui`, `@core`, `web` и `mobile` MUST NOT содержать `chromatic` как dependency или devDependency. Root MAY предоставлять script-обёртку `pnpm chromatic`, делегирующую в `ui-storybook`.

#### Scenario: Root без chromatic dependency

- **WHEN** проверяется root `package.json`
- **THEN** в dependencies и devDependencies MUST NOT быть `chromatic`

#### Scenario: Chromatic script из корня

- **WHEN** разработчик выполняет `pnpm chromatic` из корня
- **THEN** MUST быть вызван script пакета `ui-storybook` с Chromatic CLI

### Requirement: Секрет Chromatic в CI

CI MUST использовать project token Chromatic через GitHub Secret `CHROMATIC_PROJECT_TOKEN`. Token MUST NOT коммититься в репозиторий. Документация MUST описывать настройку секрета и локального env для ручного запуска.

#### Scenario: CI без token

- **WHEN** GitHub Actions workflow Chromatic запускается без `CHROMATIC_PROJECT_TOKEN`
- **THEN** job MUST завершиться ошибкой аутентификации
- **AND** MUST NOT создаваться успешный результат

#### Scenario: Локальный запуск без token

- **WHEN** разработчик выполняет `pnpm chromatic` без `CHROMATIC_PROJECT_TOKEN`
- **THEN** CLI MUST сообщить об отсутствии token
- **AND** MUST NOT отправлять build в Chromatic

### Requirement: Граница Chromatic и Vitest

Visual regression через Chromatic MUST покрывать визуальные состояния web-кomponentов в stories. Unit-тесты hooks и utils MUST оставаться в Vitest. Component tests через `render(<Component />)` в Vitest MUST NOT добавляться. Chromatic MUST NOT заменять unit-тесты hooks и utils.

#### Scenario: Hook остаётся в Vitest при Chromatic

- **WHEN** добавляется visual regression для web-кomponenta
- **THEN** существующие Vitest-тесты hooks MUST NOT удаляться или переноситься в Chromatic как замена

#### Scenario: Visual diff только для stories

- **WHEN** Chromatic выполняет visual regression
- **THEN** snapshots MUST создаваться только для Storybook stories
- **AND** MUST NOT требоваться Vitest component test для pixel comparison

### Requirement: Fallback миграции при лимитах Chromatic

При исчерпании free tier Chromatic или отказе от SaaS MUST существовать задокументированный путь миграции на self-hosted visual regression (Lost Pixel OSS). План MUST быть зафиксирован в OpenSpec артефактах change (`design.md`, delta spec). Пользовательская документация (`README.md`) MUST NOT дублировать migration path.

#### Scenario: Migration path только в OpenSpec

- **WHEN** команда оценивает смену visual regression runner
- **THEN** MUST существовать описание fallback в OpenSpec change (design + spec)
- **AND** `README.md` MUST NOT содержать инструкций миграции на Lost Pixel
