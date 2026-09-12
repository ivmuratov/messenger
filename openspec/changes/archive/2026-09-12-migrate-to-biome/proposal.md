## Why

Монорепа использует два отдельных инструмента — ESLint и Prettier — с восемью npm-зависимостями, двумя конфигами и дублирующимися командами в Turbo/Husky. Biome 2.x объединяет линтинг, форматирование и сортировку импортов в один быстрый инструмент с единым конфигом, что упрощает поддержку и ускоряет pre-commit.

## What Changes

- Установка `@biomejs/biome@2.5.12` (последняя стабильная версия) в корень монорепы
- Создание единого `biome.json` с миграцией правил из `eslint.config.ts` и `prettier.config.mts`
- Замена скриптов `lint`, `format`, `format:check` во всех пакетах на команды Biome
- Удаление ESLint, Prettier и всех связанных плагинов из `package.json` и lockfile
- Удаление `eslint.config.ts`, `prettier.config.mts`, `.prettierignore`, `.eslintcache` из `.gitignore`
- Обновление `.husky/pre-commit` и `turbo.json` под Biome
- Замена `eslint-disable` комментария в коде на `biome-ignore`
- Массовое форматирование кодовой базы (`biome check --write`)
- Обновление `openspec/config.yaml` и документации — полное удаление упоминаний ESLint и Prettier

## Capabilities

### New Capabilities

- `tooling/lint-format`: единый инструмент проверки и форматирования кода (Biome) для всего монорепо

### Modified Capabilities

_(нет — `openspec/specs/` пуст)_

## Impact

- **root**: `package.json`, `pnpm-lock.yaml`, `turbo.json`, `biome.json` (новый), `.husky/pre-commit`, `.gitignore`
- **Удаляются**: `eslint.config.ts`, `prettier.config.mts`, `.prettierignore`
- **packages/ui**: `package.json`, `src/layouts/DrawerLayout/mobile/useDrawerLayoutRootMotion.ts` (biome-ignore)
- **packages/core**: `package.json`
- **apps/web**: `package.json`
- **apps/mobile**: `package.json`
- **openspec**: `config.yaml`
- **Все `.ts`/`.tsx` файлы**: возможные изменения форматирования и порядка импортов

## Non-goals

- Настройка CI (GitHub Actions) — отдельный change
- Добавление Vitest
- GritQL-плагин для запрета `React.FC` (convention остаётся в code review / rules)
- Per-package `biome.json` с overrides — достаточно одного root-конфига
