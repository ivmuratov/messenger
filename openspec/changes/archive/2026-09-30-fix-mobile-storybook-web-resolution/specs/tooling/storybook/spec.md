# Spec Delta

## MODIFIED Requirements

### Requirement: Рендер mobile stories через react-native-web в ui-storybook

Runner `apps/ui-storybook` MUST предоставлять mobile конфиг (`.storybook-mobile/`) с рендером mobile stories в браузере через `react-native-web` (alias `react-native` → `react-native-web` в Vite) и Vite resolve condition `react-native` для entry `@ui`. Зависимости bridge MUST быть объявлены только в `apps/ui-storybook`. Пакет `@ui` MUST NOT импортировать `react-native-web` в production-коде компонентов.

Mobile runner MUST резолвить platform-файлы `*.web.js` зависимостей приоритетнее одноимённых `*.js` одинаково в dev-сервере (prebundle зависимостей) и в статической сборке. RN-библиотеки с собственной web-реализацией MUST загружаться через свой web-вход, а не через native-код. Mobile runner MUST NOT подменять внутренние модули `react-native/Libraries/*` stubs или алиасами; stubs допустимы только для целых native-only библиотек без web-реализации.

#### Scenario: Mobile Typography с StyleSheet в Storybook

- **WHEN** открывается mobile story Typography в mobile runner
- **THEN** текст MUST отображаться со стилями из `Typography.styles.ts`, а не unstyled defaults
- **AND** story MUST NOT требовать запуска Expo или эмулятора

#### Scenario: @ui без react-native-web

- **WHEN** проверяется `packages/ui/package.json`
- **THEN** в dependencies и devDependencies MUST NOT быть `react-native-web`

#### Scenario: Иконки lucide-react-native в mobile dev-сервере

- **WHEN** разработчик выполняет `pnpm --filter ui-storybook dev:mobile` и открывает mobile story ThemeSwitcher
- **THEN** dev-сервер MUST запуститься без ошибок резолва `react-native/Libraries/*`
- **AND** иконка темы MUST отображаться через web-реализацию `react-native-svg`

#### Scenario: Иконки lucide-react-native в статической mobile-сборке

- **WHEN** разработчик выполняет `pnpm --filter ui-storybook build:mobile`
- **THEN** сборка MUST завершиться успешно
- **AND** mobile story ThemeSwitcher в `dist-mobile` MUST отображать иконку темы

#### Scenario: Нет stubs для внутренних модулей react-native

- **WHEN** проверяется конфигурация `apps/ui-storybook/.storybook-mobile/`
- **THEN** MUST NOT существовать алиасов, плагинов или stub-файлов для путей `react-native/Libraries/*` и `react-native-web/Libraries/*`
