## ADDED Requirements

### Requirement: Accessibility addon в Storybook

Storybook app MUST регистрировать `@storybook/addon-a11y` в конфигурации runner. A11y-проверки MUST выполняться на stories web-компонентов `@ui` через axe-core (панель Accessibility и автоматический audit при просмотре story). Addon MUST быть объявлен только в `apps/ui-storybook`; `@ui` MUST NOT добавлять `@storybook/addon-a11y` как dependency.

#### Scenario: A11y panel доступна в dev

- **WHEN** разработчик открывает любую story web-компонента в Storybook dev
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

## MODIFIED Requirements

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
