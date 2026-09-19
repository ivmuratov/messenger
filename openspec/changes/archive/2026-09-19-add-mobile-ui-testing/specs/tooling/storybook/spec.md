## ADDED Requirements

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

### Requirement: Preview и ThemeProvider без story-level platform marker

Web runner MUST оборачивать stories в web `ThemeProvider` из `@ui` (default export) с `@storybook/addon-themes` и VE global styles. Mobile runner MUST оборачивать stories в mobile `ThemeProvider` из `@ui` (entry при Vite condition `react-native`) с синхронизацией light/dark через themes addon (`globals.theme`). Story meta MUST NOT использовать `parameters.platform` или эквивалентные маркеры для выбора provider. Runner MUST NOT импортировать модули напрямую из `packages/ui/src/**`.

#### Scenario: Mobile ThemeSwitcher в story

- **WHEN** просматривается mobile story ThemeSwitcher при light-теме в mobile runner
- **THEN** компонент MUST отображать состояние, соответствующее light-теме mobile `ThemeProvider`

#### Scenario: Web decorator не зависит от mobile runner

- **WHEN** просматривается web story Typography в web runner
- **THEN** MUST применяться web `ThemeProvider` и VE-стили
- **AND** MUST NOT подключаться mobile `ThemeProvider`

### Requirement: Stories для визуальных mobile-комponentов каталога

MUST существовать mobile story для каждого визуального mobile-компонента каталога: `ThemeSwitcher`, `Typography`, `DrawerLayout`, `Flex`, `Page`. Compound-компоненты MUST демонстрировать subcomponents и осмысленные состояния (open/closed для DrawerLayout). Stories, зависящие от native-only анимаций, MAY использовать `parameters.chromatic.disableSnapshot` для нестабильных кадров; статические состояния MUST оставаться в Chromatic.

#### Scenario: Mobile DrawerLayout open и closed

- **WHEN** просматривается mobile story DrawerLayout
- **THEN** MUST быть доступны варианты с `isOpened={true}` и `isOpened={false}`

#### Scenario: Chromatic baseline для mobile story

- **WHEN** добавляется новая mobile story со стабильным статическим состоянием
- **THEN** mobile Chromatic project MUST включать её в visual regression наравне с web project для web stories

## MODIFIED Requirements

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

### Requirement: Граница Chromatic и Vitest

Visual regression через Chromatic MUST покрывать визуальные состояния web- **и mobile-** компонентов в stories (mobile через RN-web в браузере). Unit-тесты hooks и utils MUST оставаться в Vitest. Component tests через `render(<Component />)` в Vitest MUST NOT добавляться. Chromatic MUST NOT заменять unit-тесты hooks и utils. Native-only поведение (жесты, worklets и анимации на устройстве) MUST считаться непокрытым в рамках этого change и MUST NOT имитироваться visual snapshots через координатные или browser-only проверки.

#### Scenario: Hook остаётся в Vitest при Chromatic

- **WHEN** добавляется visual regression для mobile-кomponenta
- **THEN** существующие Vitest-тесты hooks MUST NOT удаляться или переноситься в Chromatic как замена

#### Scenario: Visual diff только для stories

- **WHEN** Chromatic выполняет visual regression
- **THEN** snapshots MUST создаваться только для Storybook stories
- **AND** MUST NOT требоваться Vitest component test для pixel comparison

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
