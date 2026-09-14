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

- **WHEN** web-компонент `packages/ui/src/atoms/Typography/web/Typography.tsx` получает story
- **THEN** story MUST находиться по пути `packages/ui/src/atoms/Typography/web/Typography.stories.tsx`

#### Scenario: Glob без дублирования

- **WHEN** проверяется конфигурация `apps/ui-storybook`
- **THEN** MUST NOT существовать копий story-файлов в `apps/ui-storybook/src/`
- **AND** stories MUST загружаться из `packages/ui`

### Requirement: Именование и структура stories

Title story MUST отражать иерархию Atomic Design и совпадать с путём в sidebar: `Atoms/{Component}`, `Layouts/{Component}`. Каждый визуальный web-компонент каталога (atoms и layouts из `packages/ui/src/index.ts`) MUST иметь минимум одну story; для компонентов с autodocs — tag `autodocs`. `ThemeProvider` MUST NOT иметь отдельную story — только global decorator в `preview.tsx`.

#### Scenario: Title для atom

- **WHEN** открывается story Typography
- **THEN** title MUST быть `Atoms/Typography`

#### Scenario: Title для layout

- **WHEN** открывается story DrawerLayout
- **THEN** title MUST быть `Layouts/DrawerLayout`

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

- **WHEN** разработчик редактирует `packages/ui/src/atoms/Typography/web/Typography.stories.tsx`
- **THEN** TypeScript MUST резолвить `Meta` и `StoryObj` из `@storybook/react` без ошибок
