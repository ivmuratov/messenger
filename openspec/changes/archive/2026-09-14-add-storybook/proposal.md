## Why

В `@ui` уже есть web-кomponentы, но нет визуального каталога: сложно просматривать состояния, готовить регрессию и ориентироваться при сборке страниц в `apps/web` и `apps/mobile`. Unit-тесты покрывают hooks и utils, component tests в Vitest вне scope — Storybook закрывает визуальный слой для web-кomponentов.

## What Changes

- Новое приложение `apps/ui-storybook`: Storybook 10.6.0 на `@storybook/react-vite`, минимальный конфиг (glob на stories в `@ui`, Vanilla Extract, alias `@/`)
- Stories для визуальных web-кomponentов в `packages/ui` — colocated в `{Component}/web/*.stories.tsx` (`ThemeProvider` — только global decorator, без story)
- Root-скрипты `pnpm storybook` и `pnpm build-storybook`; Turbo task `dev` для ui-storybook
- Syncpack-группа Storybook для выравнивания версий `@storybook/*` и `storybook`
- `@ui`: `tsconfig.stories.json` + devDep `@storybook/react@10.6.0` (типы stories, IDE + typecheck)
- Обновление документации: `README.md`, `.cursor/README.md`, `.cursor/rules/architecture.mdc`, `.cursor/rules/testing.mdc`, `.cursor/agents/*`, `openspec/config.yaml`

## Capabilities

### New Capabilities

- `tooling/storybook`: инфраструктура Storybook, размещение stories, naming, запуск dev/build

### Modified Capabilities

- `tooling/testing`: уточнение границы — Storybook для визуального каталога web-кomponentов; Vitest component tests по-прежнему вне scope

## Impact

- **apps/ui-storybook/** (новый): `.storybook/main.ts`, `.storybook/preview.tsx`, `package.json`, `tsconfig.json`
- **packages/ui/**: `tsconfig.stories.json`, devDep `@storybook/react`; stories в `src/**/web/*.stories.tsx` (ThemeSwitcher, Typography, DrawerLayout, Flex, Page)
- **root**: `package.json` (scripts), `syncpack.config.ts` (группа Storybook)
- **turbo.json**: без изменений или persistent `dev` наследуется от global
- **docs**: `README.md`, `.cursor/README.md`, `.cursor/rules/architecture.mdc`, `.cursor/rules/testing.mdc`, `.cursor/agents/researcher.md`, `.cursor/agents/reviewer.md`, `openspec/config.yaml`

## Non-goals

- Chromatic, Lost Pixel и visual regression CI — следующая итерация
- Deploy статического каталога (GitHub Pages / Vercel)
- Mobile stories (`@storybook/react-native`)
- Interaction tests, a11y addon, `@storybook/addon-themes` (toolbar light/dark — опционально позже)
- Runner/addons Storybook в root или `@ui` (только в `apps/ui-storybook`; в `@ui` допустим `@storybook/react` devDep для типов stories)
- Изменение публичного API `@ui` (`exports` в package.json)
