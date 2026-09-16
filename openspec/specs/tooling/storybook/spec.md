# storybook Specification

## Purpose

Визуальный каталог web-компонентов `@ui`: изолированный dev-сервер и статическая сборка для просмотра состояний компонентов, подготовки visual regression и ориентации при разработке страниц.

## Requirements

### Requirement: Storybook-приложение ui-storybook

Монорепозиторий MUST предоставлять runnable-приложение `apps/ui-storybook` для просмотра web-компонентов `@ui`. Runner-зависимости (`storybook`, `@storybook/react-vite`, addons, builder) MUST быть объявлены только в `apps/ui-storybook`. Root, `@core`, `web` и `mobile` MUST NOT содержать `storybook` или `@storybook/*` как dependencies или devDependencies. `@ui` MAY содержать `@storybook/react` в devDependencies **только** для типов story-файлов; другие `@storybook/*` в `@ui` MUST NOT.

#### Scenario: Запуск dev-сервера из корня

- **WHEN** разработчик выполняет `pnpm storybook` из корня монорепы
- **THEN** MUST запуститься Storybook dev-сервер для `apps/ui-storybook`
- **AND** в sidebar MUST отображаться stories текущих web-компонентов `@ui`

#### Scenario: Статическая сборка каталога

- **WHEN** разработчик выполняет `pnpm build-storybook` из корня
- **THEN** MUST быть создан статический build Storybook в output-директории `apps/ui-storybook`
- **AND** команда MUST завершиться успешно

#### Scenario: Root без Storybook-зависимостей

- **WHEN** проверяется root `package.json`
- **THEN** в dependencies и devDependencies MUST NOT быть `storybook` и `@storybook/*`

### Requirement: Colocated stories в web-реализации компонента

Story-файлы MUST располагаться в `packages/ui` рядом с web-реализацией: `{Component}/web/{Component}.stories.tsx`. Stories MUST NOT дублироваться в `apps/ui-storybook`. Storybook app MUST подключать stories через glob-паттерн на `packages/ui/src/**/*.stories.tsx`.

#### Scenario: Story рядом с web-кomponentом

- **WHEN** web-компонент `packages/ui/src/components/Typography/web/Typography.tsx` получает story
- **THEN** story MUST находиться по пути `packages/ui/src/components/Typography/web/Typography.stories.tsx`

#### Scenario: Glob без дублирования

- **WHEN** проверяется конфигурация `apps/ui-storybook`
- **THEN** MUST NOT существовать копий story-файлов в `apps/ui-storybook/src/`
- **AND** stories MUST загружаться из `packages/ui`

### Requirement: Именование и структура stories

Title story MUST отражать каталог `components/` и совпадать с путём в sidebar: `Components/{Component}`. Каждый визуальный web-компонент каталога (компоненты из `packages/ui/src/index.ts`, кроме `ThemeProvider`) MUST иметь минимум одну story; для компонентов с autodocs — tag `autodocs`. `ThemeProvider` MUST NOT иметь отдельную story — только global decorator в `preview.tsx`.

#### Scenario: Title для atom

- **WHEN** открывается story Typography
- **THEN** title MUST быть `Components/Typography`

#### Scenario: Title для layout

- **WHEN** открывается story DrawerLayout
- **THEN** title MUST быть `Components/DrawerLayout`

#### Scenario: Autodocs для компонента

- **WHEN** открывается страница Docs для любого web-компонента в каталоге
- **THEN** MUST отображаться сгенерированная документация (autodocs) с описанием props

### Requirement: Stories для визуальных web-кomponentов каталога

На момент change MUST существовать story для каждого визуального web-компонента `ThemeSwitcher`, `Typography`, `DrawerLayout`, `Flex`, `Page`. `ThemeProvider` исключён — инфраструктурный провайдер, покрывается global decorator. Compound-кomponentы (`DrawerLayout`, `Page`) MUST демонстрировать составную структуру (subcomponents) и осмысленные состояния.

#### Scenario: DrawerLayout open и closed

- **WHEN** просматривается story DrawerLayout
- **THEN** MUST быть доступны варианты с `isOpened={true}` и `isOpened={false}`

#### Scenario: ThemeSwitcher в контексте темы

- **WHEN** просматривается story ThemeSwitcher
- **THEN** компонент MUST рендериться внутри `ThemeProvider`
- **AND** MUST отображать корректную иконку для текущей темы

### Requirement: Глобальный preview для тем и стилей

Storybook MUST оборачивать все stories в `ThemeProvider` с глобальными web-стилями (`ThemeProvider/web/styles`). Vanilla Extract-стили web-кomponentов MUST корректно применяться в Storybook без ручного импорта в каждой story.

#### Scenario: Typography с VE-стилями

- **WHEN** открывается story Typography
- **THEN** текст MUST отображаться с типографическими стилями из `Typography.css.ts`, а не unstyled browser defaults

#### Scenario: ThemeProvider decorator

- **WHEN** рендерится любая story web-кomponenta `@ui`
- **THEN** story MUST быть обёрнута в `ThemeProvider` через global decorator в `preview.tsx`

### Requirement: Выравнивание версий Storybook

Все Storybook-пакеты MUST использовать одну версию `10.6.0` (или актуальную latest stable на момент установки, одинаковую для всех `@storybook/*` и `storybook`). Syncpack MUST контролировать расхождения через группу Storybook.

#### Scenario: Syncpack обнаруживает mismatch Storybook

- **WHEN** версии `storybook` и `@storybook/react-vite` различаются в `apps/ui-storybook`
- **THEN** `pnpm syncpack:list` MUST сообщать о несоответствии

#### Scenario: Единая версия в ui-storybook

- **WHEN** проверяется `apps/ui-storybook/package.json`
- **THEN** все `@storybook/*` и `storybook` MUST иметь идентичную версию

### Requirement: Typecheck и IDE для stories в @ui

Story-файлы MUST typecheck'аться в `@ui` через отдельный `tsconfig.stories.json`. Основной `packages/ui/tsconfig.json` MUST exclude `**/*.stories.tsx` от emit `dist-types`. `@ui` MUST declare `@storybook/react` в devDependencies той же версии, что Storybook app (10.6.0).

#### Scenario: Typecheck stories в @ui

- **WHEN** разработчик выполняет `pnpm --filter @ui typecheck`
- **THEN** MUST успешно пройти `tsc -b` (library без stories)
- **AND** MUST успешно пройти `tsc -p tsconfig.stories.json --noEmit` (stories)

#### Scenario: IDE types в story-файле

- **WHEN** разработчик редактирует `packages/ui/src/components/Typography/web/Typography.stories.tsx`
- **THEN** TypeScript MUST резолвить `Meta` и `StoryObj` из `@storybook/react` без ошибок

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
