## 1. Syncpack и root

- [x] 1.1 Добавить `chromatic` в группу `Storybook` в `syncpack.config.ts` — verify: `pnpm syncpack:list` без mismatch после установки
- [x] 1.2 Добавить root script `"chromatic": "pnpm --filter ui-storybook chromatic"` в `package.json` — verify: `pnpm chromatic --help` резолвится через filter ui-storybook

## 2. apps/ui-storybook (Chromatic CLI)

- [x] 2.1 Добавить `chromatic` в devDependencies `apps/ui-storybook/package.json` (exact version, syncpack-aligned) — verify: `pnpm install` успешен
- [x] 2.2 Добавить script `"chromatic": "chromatic --build-script-name=build --exit-zero-on-changes"` в `apps/ui-storybook/package.json` — verify: script вызывает `storybook build -o dist` перед upload (dry-run с token или `--dry-run` если доступен)
- [x] 2.3 Убедиться, что root и `@ui` не содержат `chromatic` в deps — verify: grep по `package.json` монорепы

## 3. GitHub Actions CI

- [x] 3.1 Создать `.github/workflows/chromatic.yml`: trigger PR + push main, paths filter на `packages/ui/**/*.stories.tsx`, `packages/ui/src/**/web/**`, `apps/ui-storybook/**` — verify: workflow YAML валиден
- [x] 3.2 Workflow: checkout с `fetch-depth: 0`, pnpm + Node 22, `pnpm install`, `pnpm build-storybook`, chromatic с `CHROMATIC_PROJECT_TOKEN` (без `--exit-zero-on-changes` в CI) — verify: job падает без секрета, успешен с token на green PR
- [x] 3.3 Задокументировать настройку GitHub Secret `CHROMATIC_PROJECT_TOKEN` в `README.md` — verify: инструкция onboarding присутствует

## 4. Документация

- [x] 4.1 Обновить `README.md`: команда `pnpm chromatic`, Chromatic review flow, локальный env `CHROMATIC_PROJECT_TOKEN` — verify: таблица команд актуальна
- [x] 4.2 Обновить `.cursor/rules/testing.mdc`: секция Chromatic (visual regression) vs Storybook (каталог) vs Vitest (hooks/utils) — verify: нет противоречия с component tests scope
- [x] 4.3 Обновить `openspec/config.yaml`: verification command `pnpm chromatic`, упоминание CI visual regression — verify: config отражает новый слой

## 5. Финальная верификация

- [x] 5.1 `pnpm build-storybook` — verify: static build в `apps/ui-storybook/dist` успешен (prerequisite для Chromatic)
- [x] 5.2 `pnpm lint && pnpm typecheck && pnpm syncpack:list` — verify: без регрессий
- [x] 5.3 Первый Chromatic run на main с accept baseline — verify: все текущие stories (~5 компонентов) имеют snapshots в Chromatic dashboard
- [x] 5.4 PR без visual changes — verify: Chromatic CI green; PR с intentional visual change — verify: Chromatic комментирует diff и требует accept
