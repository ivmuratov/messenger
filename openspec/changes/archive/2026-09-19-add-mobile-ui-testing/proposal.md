## Why

Mobile-реализации компонентов `@ui` сейчас нельзя изолированно просматривать и сравнивать при изменениях: Storybook и Chromatic покрывают только web. Пока продуктовая разработка сосредоточена на web, достаточно расширить каталог на mobile-комponentы и отложить дорогостоящую native e2e-инфраструктуру.

## What Changes

- Расширение **существующего** `apps/ui-storybook`: **два конфига** Storybook в одном пакете — `.storybook-web/` (web stories) и `.storybook-mobile/` (RN-web bridge для `*/mobile/*.stories.tsx`). Отдельное npm-приложение не создаётся.
- Mobile stories colocated в `packages/ui/**/mobile/*.stories.tsx`, title `Mobile/*`; web — `Components/*`. Без `parameters.platform` в story meta.
- **Chromatic:** два static build (`dist-web`, `dist-mobile`) и **два** Chromatic project (секреты `CHROMATIC_PROJECT_TOKEN` и `CHROMATIC_PROJECT_TOKEN_MOBILE`); path filter CI расширяется на `packages/ui/src/**/mobile/**`.
- Typecheck mobile stories через `packages/ui/tsconfig.stories.json`.
- Документация фиксирует границу: RN-web/Chromatic проверяют layout/tokens, но не native runtime.

## Capabilities

### New Capabilities

_(нет — расширяем существующие tooling-спеки)_

### Modified Capabilities

- `tooling/storybook`: два runner-конфига в `apps/ui-storybook`, colocated mobile stories, preview с platform-native `ThemeProvider` через public `@ui` (без импортов из `packages/ui/src`).
- `tooling/testing`: Storybook как визуальный слой для web и mobile при сохранении Vitest; mobile e2e не вводится.
- `tooling/ci`: Chromatic workflow — web + mobile build и upload в соответствующие project token.

## Impact

- `apps/ui-storybook/`: `.storybook-web/`, `.storybook-mobile/` (+ stubs), `package.json` scripts/outputs, README.
- `packages/ui/src/components/*/mobile/*.stories.tsx`; `tsconfig.stories.json`.
- Root: `package.json` scripts, `.github/workflows/chromatic.yml`, `.env.example`, `syncpack.config.ts`.
- Документация: `apps/ui-storybook/README.md`, `.cursor/skills/testing/SKILL.md`.

## Non-goals

- Второй workspace-пакет Storybook (`ui-storybook-native`) и entry-point swapping в prod `apps/mobile`.
- Импорт `react-native-web` внутри `packages/ui`.
- Vitest component tests с `render(<Component />)` для mobile.
- Unit-тесты Reanimated/worklet-хуков (`useDrawerLayoutRootMotion`).
- Mobile e2e, Maestro, EAS Build/Workflows и device farm.
- Pixel-perfect native snapshots вне браузера (Chromatic Native / device farm).
- Проверка жестов, worklets, native-анимаций и различий iOS/Android.
- Один dev-сервер / один Chromatic project для web и mobile (отклонено: конфликт ThemeProvider и архитектуры `@ui`).
