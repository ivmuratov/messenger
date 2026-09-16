## Why

Storybook-каталог `@ui` уже даёт ручной просмотр состояний, но visual regression при изменениях компонентов не фиксируется автоматически — регрессии VE-стилей и layout легко пропустить в PR. Change `add-storybook` отложил Chromatic на следующую итерацию; сейчас каталог стабилен (~5 компонентов, colocated stories), free tier Chromatic (5000 billed snapshots/мес) покрывает объём с запасом.

## What Changes

- Интеграция **Chromatic** для visual regression по stories `apps/ui-storybook` + colocated `*.stories.tsx` в `@ui`
- DevDependency `chromatic` только в `apps/ui-storybook`; root script `pnpm chromatic` (обёртка над filter ui-storybook)
- GitHub Actions workflow: `build-storybook` → `chromatic` на pull request и push в main
- Секрет `CHROMATIC_PROJECT_TOKEN` в GitHub; документация onboarding для разработчиков
- Обновление `.cursor/rules/testing.mdc`, `README.md`, `openspec/config.yaml` — граница Storybook/Chromatic vs Vitest
- Зафиксированный путь миграции на self-hosted инструмент (Lost Pixel) при исчерпании free tier — в OpenSpec (`design.md`/spec), без реализации и без дублирования в `README.md`

## Capabilities

### New Capabilities

_(нет)_

### Modified Capabilities

- `tooling/storybook`: visual regression через Chromatic — CI, команды, требования к stories и review flow

## Impact

- **apps/ui-storybook/**: devDep `chromatic`, script `chromatic`, опционально `chromatic.config.json` или flags в script
- **root**: `package.json` (script `chromatic`); **`.github/workflows/chromatic.yml`** (новый)
- **docs**: `README.md`, `.cursor/rules/testing.mdc`, `openspec/config.yaml`
- **syncpack.config.ts**: группа Storybook MAY расшириться `chromatic` (если версия фиксируется exact)
- **@ui**, **@core**, **web**, **mobile** — без изменений кода и deps

## Non-goals

- Deploy статического каталога (GitHub Pages / Vercel)
- Mobile stories (`@storybook/react-native`)
- Interaction tests, a11y addon, `@storybook/addon-themes` — отдельные changes
- Миграция на Lost Pixel — только fallback в OpenSpec (design/spec); не в `README.md`
- Добавление `pnpm chromatic` в pre-commit (как и `pnpm test` — только CI)
- Component tests в Vitest — по-прежнему вне scope
