# storybook Specification

## Purpose

Визуальный каталог web- и mobile-компонентов `@ui`: изолированные dev-серверы и статические сборки (web и mobile через RN-web) для просмотра состояний компонентов, visual regression и ориентации при разработке.

## Requirements

### Requirement: Storybook-приложение ui-storybook

Монорепозиторий MUST предоставлять runnable-приложение `apps/ui-storybook` с **двумя** конфигами Storybook: web (`.storybook-web/`) и mobile (`.storybook-mobile/`). Runner-зависимости (`storybook`, `@storybook/react-vite`, addons, builder, `react-native-web` bridge) MUST быть объявлены только в `apps/ui-storybook`. Root, `@core`, `web` и `mobile` MUST NOT содержать `storybook` или `@storybook/*` как dependencies или devDependencies. `@ui` MAY содержать `@storybook/react` в devDependencies **только** для типов story-файлов; другие `@storybook/*` в `@ui` MUST NOT.

#### Scenario: Запуск web dev-сервера из корня

- **WHEN** разработчик выполняет `pnpm storybook` из корня монорепы
- **THEN** MUST запуститься web Storybook dev-сервер для `apps/ui-storybook`
- **AND** в sidebar MUST отображаться web stories (`Components/*`)

#### Scenario: Запуск mobile dev-сервера

- **WHEN** разработчик выполняет `pnpm --filter ui-storybook dev:mobile`
- **THEN** MUST запуститься mobile Storybook dev-сервер
- **AND** в sidebar MUST отображаться mobile stories (`Mobile/*`)

#### Scenario: Статическая сборка каталогов

- **WHEN** разработчик выполняет `pnpm build-storybook` из корня
- **THEN** MUST быть созданы static build в `apps/ui-storybook/dist-web` и `apps/ui-storybook/dist-mobile`
- **AND** команда MUST завершиться успешно

#### Scenario: Root без Storybook-зависимостей

- **WHEN** проверяется root `package.json`
- **THEN** в dependencies и devDependencies MUST NOT быть `storybook` и `@storybook/*`

### Requirement: Colocated stories в web-реализации компонента

Story-файлы MUST располагаться в `packages/ui` рядом с web-реализацией: `{Component}/web/{Component}.stories.tsx`. Stories MUST NOT дублироваться в `apps/ui-storybook`. Web runner MUST подключать stories через glob `packages/ui/src/**/web/*.stories.tsx`.

#### Scenario: Story рядом с web-кomponentом

- **WHEN** web-компонент `packages/ui/src/components/Typography/web/Typography.tsx` получает story
- **THEN** story MUST находиться по пути `packages/ui/src/components/Typography/web/Typography.stories.tsx`

#### Scenario: Glob без дублирования

- **WHEN** проверяется конфигурация `apps/ui-storybook`
- **THEN** MUST NOT существовать копий story-файлов в `apps/ui-storybook/src/`
- **AND** stories MUST загружаться из `packages/ui`

### Requirement: Colocated stories в mobile-реализации компонента

Story-файлы mobile MUST располагаться в `packages/ui` рядом с mobile-реализацией: `{Component}/mobile/{Component}.stories.tsx`. Stories MUST NOT дублироваться в `apps/ui-storybook`. Mobile runner MUST загружать stories через glob `packages/ui/src/**/mobile/*.stories.tsx`; web runner — `packages/ui/src/**/web/*.stories.tsx`.

#### Scenario: Story рядом с mobile-компонентом

- **WHEN** mobile-компонент `packages/ui/src/components/Flex/mobile/Flex.tsx` получает story
- **THEN** story MUST находиться по пути `packages/ui/src/components/Flex/mobile/Flex.stories.tsx`

#### Scenario: Mobile stories в отдельном dev-сервере

- **WHEN** разработчик выполняет `pnpm --filter ui-storybook dev:mobile`
- **THEN** MUST запуститься Storybook dev-сервер с конфигом `.storybook-mobile`
- **AND** в sidebar MUST отображаться только mobile stories (`Mobile/*`)
- **AND** MUST NOT требоваться отдельный workspace-пакет Storybook

### Requirement: Рендер mobile stories через react-native-web в ui-storybook

Runner `apps/ui-storybook` MUST предоставлять mobile конфиг (`.storybook-mobile/`) с рендером mobile stories в браузере через `react-native-web` (alias `react-native` → `react-native-web` в Vite) и Vite resolve condition `react-native` для entry `@ui`. Зависимости bridge MUST быть объявлены только в `apps/ui-storybook`. Пакет `@ui` MUST NOT импортировать `react-native-web` в production-коде компонентов.

#### Scenario: Mobile Typography с StyleSheet в Storybook

- **WHEN** открывается mobile story Typography в mobile runner
- **THEN** текст MUST отображаться со стилями из `Typography.styles.ts`, а не unstyled defaults
- **AND** story MUST NOT требовать запуска Expo или эмулятора

#### Scenario: @ui без react-native-web

- **WHEN** проверяется `packages/ui/package.json`
- **THEN** в dependencies и devDependencies MUST NOT быть `react-native-web`

### Requirement: Именование mobile stories

Title mobile story MUST использовать префикс `Mobile/` и имя компонента: `Mobile/{Component}`. Web stories MUST сохранять префикс `Components/{Component}` без изменений.

#### Scenario: Title для mobile Flex

- **WHEN** открывается mobile story Flex
- **THEN** title MUST быть `Mobile/Flex`

#### Scenario: Web title не меняется

- **WHEN** открывается web story Flex
- **THEN** title MUST оставаться `Components/Flex`

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

### Requirement: Stories для визуальных mobile-кomponentов каталога

MUST существовать mobile story для каждого визуального mobile-кomponenta каталога: `ThemeSwitcher`, `Typography`, `DrawerLayout`, `Flex`, `Page`. Compound-кomponentы MUST демонстрировать subcomponents и осмысленные состояния (open/closed для DrawerLayout). Stories, зависящие от native-only анимаций, MAY использовать `parameters.chromatic.disableSnapshot` для нестабильных кадров; статические состояния MUST оставаться в Chromatic.

#### Scenario: Mobile DrawerLayout open и closed

- **WHEN** просматривается mobile story DrawerLayout
- **THEN** MUST быть доступны варианты с `isOpened={true}` и `isOpened={false}`

#### Scenario: Chromatic baseline для mobile story

- **WHEN** добавляется новая mobile story со стабильным статическим состоянием
- **THEN** mobile Chromatic project MUST включать её в visual regression наравне с web project для web stories

### Requirement: Preview и ThemeProvider без story-level platform marker

Web runner MUST оборачивать stories в web `ThemeProvider` из `@ui` (default export) с `@storybook/addon-themes` и VE global styles. Mobile runner MUST оборачивать stories в mobile `ThemeProvider` из `@ui` (entry при Vite condition `react-native`) с синхронизацией light/dark через themes addon (`globals.theme`). Story meta MUST NOT использовать `parameters.platform` или эквивалентные маркеры для выбора provider. Runner MUST NOT импортировать модули напрямую из `packages/ui/src/**`.

#### Scenario: Mobile ThemeSwitcher в story

- **WHEN** просматривается mobile story ThemeSwitcher при light-теме в mobile runner
- **THEN** компонент MUST отображать состояние, соответствующее light-теме mobile `ThemeProvider`

#### Scenario: Web decorator не зависит от mobile runner

- **WHEN** просматривается web story Typography в web runner
- **THEN** MUST применяться web `ThemeProvider` и VE-стили
- **AND** MUST NOT подключаться mobile `ThemeProvider`

### Requirement: Accessibility addon в Storybook

Storybook app MUST регистрировать `@storybook/addon-a11y` в конфигурации runner. A11y-проверки MUST выполняться на stories web-компонентов `@ui` через axe-core (панель Accessibility и автоматический audit при просмотре story). Addon MUST быть объявлен только в `apps/ui-storybook`; `@ui` MUST NOT добавлять `@storybook/addon-a11y` как dependency.

#### Scenario: A11y panel доступна в dev

- **WHEN** разработчик открывает любую story web-комponenta в Storybook dev
- **THEN** MUST быть доступна панель Accessibility с результатами axe-проверки
- **AND** нарушения MUST отображаться с указанием rule id и affected element

#### Scenario: Addon только в ui-storybook

- **WHEN** проверяются `package.json` root, `@ui`, `@core`, `web`, `mobile`
- **THEN** в dependencies и devDependencies MUST NOT быть `@storybook/addon-a11y`

### Requirement: Themes addon и переключение light/dark

Storybook app MUST регистрировать `@storybook/addon-themes`. Toolbar MUST предоставлять переключение тем `light` и `dark`, синхронизированное с `ThemeProvider` (`data-theme` на `document.documentElement` и React context). Default theme для Chromatic baseline MUST оставаться `light`.

#### Scenario: Toolbar переключает тему

- **WHEN** разработчик выбирает `dark` в toolbar themes
- **THEN** `document.documentElement` MUST иметь `data-theme="dark"`
- **AND** stories MUST рендериться с токенами dark-темы из `@ui`

#### Scenario: ThemeSwitcher отражает текущую тему

- **WHEN** просматривается story ThemeSwitcher при активной dark-теме в toolbar
- **THEN** компонент MUST отображать иконку/состояние, соответствующее dark-теме

#### Scenario: Chromatic baseline light по умолчанию

- **WHEN** Chromatic создаёт snapshot story без явного dark-variant
- **THEN** snapshot MUST быть снят при light-теме (default globals/parameters)
- **AND** MUST NOT зависеть от ручного переключения toolbar в CI

### Requirement: Глобальный preview для тем и стилей

Storybook MUST оборачивать все stories в `ThemeProvider` с глобальными web-стилями (`ThemeProvider/web/styles`). Vanilla Extract-стили web-кomponentов MUST корректно применяться в Storybook без ручного импорта в каждой story. Переключение light/dark MUST управляться через `@storybook/addon-themes` и синхронизироваться с `ThemeProvider`; hardcoded `defaultTheme="light"` в decorator MUST NOT блокировать toolbar themes.

#### Scenario: Typography с VE-стилями

- **WHEN** открывается story Typography
- **THEN** текст MUST отображаться с типографическими стилями из `Typography.css.ts`, а не unstyled browser defaults

#### Scenario: ThemeProvider decorator

- **WHEN** рендерится любая story web-кomponenta `@ui`
- **THEN** story MUST быть обёрнута в `ThemeProvider` через global decorator в `preview.tsx`
- **AND** тема MUST следовать выбранному значению themes addon

#### Scenario: Dark theme в preview

- **WHEN** в toolbar выбрана dark-тема
- **THEN** Typography и layout-кomponentы MUST использовать dark VE-токены без перезагрузки страницы

### Requirement: Выравнивание версий Storybook

Все Storybook-пакеты MUST использовать одну версию `10.6.0` (или актуальную latest stable на момент установки, одинаковую для всех `@storybook/*` и `storybook`). Syncpack MUST контролировать расхождения через группу Storybook, включая `@storybook/addon-a11y` и `@storybook/addon-themes`.

#### Scenario: Syncpack обнаруживает mismatch Storybook

- **WHEN** версии `storybook` и `@storybook/react-vite` различаются в `apps/ui-storybook`
- **THEN** `pnpm syncpack:list` MUST сообщать о несоответствии

#### Scenario: Единая версия в ui-storybook

- **WHEN** проверяется `apps/ui-storybook/package.json`
- **THEN** все `@storybook/*` и `storybook` MUST иметь идентичную версию

#### Scenario: Addons в syncpack-группе

- **WHEN** проверяется `syncpack.config.ts`
- **THEN** группа Storybook MUST включать `@storybook/addon-a11y` и `@storybook/addon-themes`

### Requirement: Typecheck и IDE для stories в @ui

Story-файлы (web **и** mobile) MUST typecheck'аться в `@ui` через отдельный `tsconfig.stories.json`. Основной `packages/ui/tsconfig.json` MUST exclude `**/*.stories.tsx` от emit `dist-types`. `@ui` MUST declare `@storybook/react` в devDependencies той же версии, что Storybook app (10.6.0).

#### Scenario: Typecheck stories в @ui

- **WHEN** разработчик выполняет `pnpm --filter @ui typecheck`
- **THEN** MUST успешно пройти `tsc -b` (library без stories)
- **AND** MUST успешно пройти `tsc -p tsconfig.stories.json --noEmit` (stories)

#### Scenario: IDE types в story-файле

- **WHEN** разработчик редактирует `packages/ui/src/components/Typography/web/Typography.stories.tsx`
- **THEN** TypeScript MUST резолвить `Meta` и `StoryObj` из `@storybook/react` без ошибок

#### Scenario: IDE types в mobile story-файле

- **WHEN** разработчик редактирует `packages/ui/src/components/Flex/mobile/Flex.stories.tsx`
- **THEN** TypeScript MUST резолвить `Meta` и `StoryObj` из `@storybook/react` без ошибок

### Requirement: Visual regression через Chromatic

Монорепозиторий MUST обеспечивать автоматическое сравнение visual snapshots web- и mobile-stories `@ui` через Chromatic в **двух** project (web build → `CHROMATIC_PROJECT_TOKEN`, mobile build → `CHROMATIC_PROJECT_TOKEN_MOBILE`). Тестируемый набор web MUST совпадать с glob web runner; mobile — с glob mobile runner. Baselines MUST храниться в Chromatic; локальный репозиторий MUST NOT содержать committed pixel-baseline артефакты.

#### Scenario: Локальный запуск visual regression из корня

- **WHEN** разработчик с настроенными `CHROMATIC_PROJECT_TOKEN` и `CHROMATIC_PROJECT_TOKEN_MOBILE` выполняет `pnpm chromatic` из корня
- **THEN** MUST быть выполнены сборки web и mobile Storybook
- **AND** MUST быть отправлены build `dist-web` и `dist-mobile` в соответствующие Chromatic project
- **AND** команда MUST завершиться с ненулевым кодом при непринятых visual changes в любом из project

#### Scenario: Локальный запуск visual regression (web)

- **WHEN** разработчик с настроенным `CHROMATIC_PROJECT_TOKEN` выполняет `pnpm --filter ui-storybook chromatic:web`
- **THEN** MUST быть выполнена сборка web Storybook (`build:web`)
- **AND** MUST быть отправлен build `dist-web` в соответствующий Chromatic project
- **AND** команда MUST завершиться с ненулевым кодом при непринятых visual changes

#### Scenario: Локальный запуск visual regression (mobile)

- **WHEN** разработчик с настроенным `CHROMATIC_PROJECT_TOKEN_MOBILE` выполняет `pnpm --filter ui-storybook chromatic:mobile`
- **THEN** MUST быть выполнена сборка mobile Storybook (`build:mobile`)
- **AND** MUST быть отправлен build `dist-mobile` в mobile Chromatic project

#### Scenario: CI запуск на pull request

- **WHEN** открывается или обновляется pull request с изменениями в `@ui` stories (web или mobile) или `apps/ui-storybook`
- **THEN** GitHub Actions MUST выполнить оба build и оба Chromatic upload
- **AND** job MUST завершиться ошибкой при непринятых visual changes в любом из project

#### Scenario: Первый baseline для новой story

- **WHEN** добавляется новая story web- или mobile-кomponenta в `@ui`
- **THEN** следующий успешный Chromatic run в соответствующем project MUST создать baseline snapshot
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

CI MUST использовать project token Chromatic через GitHub Secrets `CHROMATIC_PROJECT_TOKEN` (web) и `CHROMATIC_PROJECT_TOKEN_MOBILE` (mobile). Token MUST NOT коммититься в репозиторий. Документация MUST описывать настройку секретов и локального env для ручного запуска.

#### Scenario: CI без web token

- **WHEN** GitHub Actions workflow Chromatic запускается без `CHROMATIC_PROJECT_TOKEN`
- **THEN** job MUST завершиться ошибкой аутентификации
- **AND** MUST NOT создаваться успешный результат

#### Scenario: CI без mobile token

- **WHEN** GitHub Actions workflow Chromatic выполняет mobile upload без `CHROMATIC_PROJECT_TOKEN_MOBILE`
- **THEN** соответствующий шаг MUST завершиться ошибкой аутентификации

#### Scenario: Локальный запуск без token

- **WHEN** разработчик выполняет `pnpm chromatic` без `CHROMATIC_PROJECT_TOKEN`
- **THEN** CLI MUST сообщить об отсутствии token
- **AND** MUST NOT отправлять build в Chromatic

### Requirement: Граница Chromatic и Vitest

Visual regression через Chromatic MUST покрывать визуальные состояния web- **и mobile-** компонентов в stories (mobile через RN-web в браузере). Unit-тесты hooks и utils MUST оставаться в Vitest. Component tests через `render(<Component />)` в Vitest MUST NOT добавляться. Chromatic MUST NOT заменять unit-тесты hooks и utils. Native-only поведение (жесты, worklets и анимации на устройстве) MUST считаться непокрытым в рамках этого change и MUST NOT имитироваться visual snapshots через координатные или browser-only проверки.

#### Scenario: Hook остаётся в Vitest при Chromatic

- **WHEN** добавляется visual regression для mobile-кomponenta
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
