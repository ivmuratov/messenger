## 1. Установка и конфигурация Biome (root)

- [x] 1.1 Добавить `@biomejs/biome@2.5.12` в root `package.json` devDependencies и выполнить `pnpm install` — verify: `pnpm exec biome --version` выводит 2.5.12
- [x] 1.2 Запустить `pnpm exec biome migrate eslint --write` и `pnpm exec biome migrate prettier --write` для генерации базового `biome.json` — verify: файл `biome.json` создан в корне
- [x] 1.3 Донастроить `biome.json`: VCS integration, `files.ignore` (dist, .expo, _.gen.ts, _.config.\*), formatter options (lineWidth 100, double quotes, semi, es5 trailing commas), nursery rules (`noFloatingPromises`, `noMisusedPromises` → error), `useExhaustiveDependencies` → warn, organizeImports — verify: `pnpm exec biome check .` запускается без ошибок конфигурации

## 2. Обновление скриптов (root + пакеты)

- [x] 2.1 Обновить root `package.json`: scripts `lint`/`format`/`format:check` через Turbo (без изменения имён команд) — verify: `pnpm lint` вызывает biome через turbo
- [x] 2.2 Обновить `packages/ui/package.json`: заменить eslint/prettier scripts на `biome check src` / `biome check --write src` — verify: `pnpm --filter @ui lint` использует biome
- [x] 2.3 Обновить `packages/core/package.json`: аналогично 2.2 — verify: `pnpm --filter @core lint` использует biome
- [x] 2.4 Обновить `apps/web/package.json`: аналогично 2.2 — verify: `pnpm --filter web lint` использует biome
- [x] 2.5 Обновить `apps/mobile/package.json`: аналогично 2.2 — verify: `pnpm --filter mobile lint` использует biome

## 3. Infraструктура (root)

- [x] 3.1 Обновить `turbo.json`: заменить `eslint.config.ts` на `biome.json` в `globalDependencies` — verify: turbo invalidates cache при изменении biome.json
- [x] 3.2 Обновить `.husky/pre-commit`: убрать `format:check`, оставить `lint` (biome check покрывает format) — verify: pre-commit hook не содержит prettier/eslint/format:check
- [x] 3.3 Обновить `.gitignore`: удалить `.eslintcache`, добавить `.biome-cache` (если применимо) — verify: grep `.eslintcache` в `.gitignore` не находит строку

## 4. Удаление ESLint и Prettier (root)

- [x] 4.1 Удалить devDependencies: `eslint`, `@typescript-eslint/*`, `eslint-plugin-*`, `eslint-import-resolver-typescript`, `prettier` из root `package.json` — verify: `grep -i eslint package.json` и `grep -i prettier package.json` пусты
- [x] 4.2 Удалить файлы `eslint.config.ts`, `prettier.config.mts`, `.prettierignore` — verify: файлы не существуют
- [x] 4.3 Выполнить `pnpm install` для обновления lockfile — verify: `grep eslint pnpm-lock.yaml` не находит прямых devDependencies проекта
- [x] 4.4 Удалить `jiti` из devDependencies, если больше не используется — verify: `grep jiti package.json` пуст или jiti нужен другому инструменту

## 5. Код (packages/ui)

- [x] 5.1 Заменить `eslint-disable-next-line react-hooks/exhaustive-deps` на `biome-ignore lint/correctness/useExhaustiveDependencies` в `useDrawerLayoutRootMotion.ts` — verify: `grep -r eslint-disable packages/` пуст

## 6. Массовое форматирование (все пакеты)

- [x] 6.1 Выполнить `pnpm exec biome check --write .` для автоисправления форматирования и импортов — verify: `pnpm lint` проходит без ошибок
- [x] 6.2 Проверить, что build и typecheck не сломаны после форматирования — verify: `pnpm typecheck && pnpm build`

## 7. Документация (root)

- [x] 7.1 Обновить `openspec/config.yaml`: заменить упоминания ESLint/Prettier на Biome в verification commands и pre-commit — verify: `grep -iE 'eslint|prettier' openspec/config.yaml` пуст
- [x] 7.2 Проверить весь репозиторий на оставшиеся упоминания eslint/prettier (кроме lockfile history и этого change) — verify: `grep -riE 'eslint|prettier' --include='*.{md,json,ts,tsx,yaml,mjs,mts}' --exclude-dir=node_modules --exclude-dir=openspec/changes .` пуст или содержит только biome migration artifacts

## 8. Финальная верификация (root)

- [x] 8.1 Полный прогон quality gates — verify: `pnpm lint && pnpm typecheck && pnpm build && pnpm syncpack:list`
- [x] 8.2 Валидация OpenSpec change — verify: `openspec validate migrate-to-biome --strict` проходит
