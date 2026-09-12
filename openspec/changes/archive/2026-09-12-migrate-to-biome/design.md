## Context

См. `proposal.md` — Why.

Текущий стек:

- `eslint.config.ts` — flat config с type-checked правилами (`no-floating-promises`, `no-misused-promises`), React hooks, import sort
- `prettier.config.mts` — printWidth 100, double quotes, semi, es5 trailing commas
- 4 пакета с одинаковыми скриптами `lint`/`format`/`format:check`
- Husky pre-commit: `build` + `lint` + `typecheck` + `format:check` + `syncpack:list`
- Один `eslint-disable` в `packages/ui/src/layouts/DrawerLayout/mobile/useDrawerLayoutRootMotion.ts`

Целевая версия: `@biomejs/biome@2.5.12` (последняя стабильная на npm).

## Goals / Non-Goals

**Goals:**

- Один `biome.json` в корне для всего монорепо
- Полное удаление ESLint/Prettier из deps, конфигов, скриптов, документации
- Сохранение эквивалентного покрытия правил (см. spec)
- Упрощение pre-commit (lint покрывает format:check)
- Массовое форматирование в отдельном коммите

**Non-Goals:**

- Per-package biome.json overrides
- CI pipeline (отдельный change)
- GritQL для запрета `React.FC`
- Замена `pnpm typecheck` — tsc остаётся для полной type-safety

## Decisions

### 1. Один root-конфиг вместо nested configs

**Решение:** единый `biome.json` в корне, без `extends: "//"` в пакетах.

**Почему:** монорепа маленькая (4 пакета), правила одинаковые. Turbo уже оркестрирует per-package `lint` через `biome check <path>`.

**Альтернатива:** nested configs в каждом пакете — избыточно на текущем этапе.

**Owner:** root

### 2. Миграция конфигов через CLI

**Решение:** использовать официальные команды:

```bash
pnpm exec biome migrate eslint --write
pnpm exec biome migrate prettier --write
```

Затем вручную донастроить: nursery rules, ignores, formatter options.

**Owner:** root

### 3. Маппинг ESLint → Biome rules

| ESLint                                        | Biome                                            |
| --------------------------------------------- | ------------------------------------------------ |
| `@typescript-eslint/no-unused-vars` (^\_)     | `correctness/noUnusedVariables` + options        |
| `@typescript-eslint/consistent-type-imports`  | `style/useImportType`                            |
| `@typescript-eslint/no-floating-promises`     | `nursery/noFloatingPromises` → error             |
| `@typescript-eslint/no-misused-promises`      | `nursery/noMisusedPromises` → error              |
| `@typescript-eslint/no-restricted-types` (FC) | ❌ не мигрируется — convention в `.cursor/rules` |
| `react-hooks/rules-of-hooks`                  | `correctness/useHookAtTopLevel`                  |
| `react-hooks/exhaustive-deps`                 | `correctness/useExhaustiveDependencies` → warn   |
| `simple-import-sort/*`                        | `assist/actions/source/organizeImports`          |
| `import/no-duplicates`                        | `correctness/noDuplicateImports`                 |

**Owner:** root (`biome.json`)

### 4. Скрипты пакетов

**Решение:**

```json
"lint": "biome check .",
"format": "biome check --write .",
"format:check": "biome check ."
```

В пакетах scope — `src` или `.` (корень пакета). Root вызывает через Turbo.

**Owner:** root, packages/ui, packages/core, apps/web, apps/mobile

### 5. Pre-commit упрощение

**Решение:** убрать `format:check` из pre-commit — `lint` (biome check) покрывает и lint, и format.

```bash
pnpm exec concurrently --kill-others-on-fail \
  "pnpm build" \
  "pnpm lint" \
  "pnpm typecheck" \
  "pnpm syncpack:list"
```

**Owner:** root (`.husky/pre-commit`)

### 6. VCS integration вместо .prettierignore

**Решение:** `vcs.enabled: true`, `vcs.useIgnoreFile: true` в biome.json. Удалить `.prettierignore`.

Дополнительные ignores в `files.ignore` для `*.gen.ts`, config files.

**Owner:** root

### 7. Удаляемые зависимости (root)

```
eslint, @typescript-eslint/eslint-plugin, @typescript-eslint/parser,
eslint-plugin-import, eslint-plugin-react, eslint-plugin-react-hooks,
eslint-plugin-simple-import-sort, eslint-import-resolver-typescript,
prettier
```

Добавить: `@biomejs/biome@2.5.12`

**Owner:** root (`package.json`, `pnpm-lock.yaml`)

### 8. turbo.json globalDependencies

Заменить `eslint.config.ts` → `biome.json`.

**Owner:** root

## Risks / Trade-offs

| Риск                                                                        | Митигация                                                                    |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Nursery rules (`noFloatingPromises`) менее стабильны, чем typescript-eslint | `pnpm typecheck` остаётся в pre-commit; nursery rules — осознанный trade-off |
| Массовый formatting diff                                                    | Отдельный commit `chore: apply biome formatting`                             |
| Нет автоматического запрета `React.FC`                                      | Convention в code review / `.cursor/rules/code-style.mdc`                    |
| Biome vs Prettier — не 100% parity                                          | Migrate prettier command подтянет настройки; проверить diff                  |
| `jiti` остаётся в deps (использовался ESLint)                               | Удалить, если больше не нужен ни одному инструменту                          |

## Migration Plan

1. **Setup** — установить Biome, создать `biome.json` через migrate commands
2. **Scripts** — обновить package.json во всех пакетах + root
3. **Infra** — turbo.json, husky, gitignore
4. **Cleanup** — удалить eslint/prettier configs и deps, `pnpm install`
5. **Code** — заменить eslint-disable → biome-ignore
6. **Format** — `biome check --write .` (отдельный commit)
7. **Docs** — обновить `openspec/config.yaml`
8. **Verify** — `pnpm lint && pnpm typecheck && pnpm build`

**Rollback:** revert commits; восстановить eslint.config.ts и prettier.config.mts из git history.

## Open Questions

_(нет — scope однозначен)_
