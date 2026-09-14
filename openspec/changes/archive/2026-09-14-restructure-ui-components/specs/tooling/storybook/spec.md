## MODIFIED Requirements

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

### Requirement: Typecheck и IDE для stories в @ui

Story-файлы MUST typecheck'аться в `@ui` через отдельный `tsconfig.stories.json`. Основной `packages/ui/tsconfig.json` MUST exclude `**/*.stories.tsx` от emit `dist-types`. `@ui` MUST declare `@storybook/react` в devDependencies той же версии, что Storybook app (10.6.0).

#### Scenario: Typecheck stories в @ui

- **WHEN** разработчик выполняет `pnpm --filter @ui typecheck`
- **THEN** MUST успешно пройти `tsc -b` (library без stories)
- **AND** MUST успешно пройти `tsc -p tsconfig.stories.json --noEmit` (stories)

#### Scenario: IDE types в story-файле

- **WHEN** разработчик редактирует `packages/ui/src/components/Typography/web/Typography.stories.tsx`
- **THEN** TypeScript MUST резолвить `Meta` и `StoryObj` из `@storybook/react` без ошибок
