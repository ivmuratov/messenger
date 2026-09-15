## Why

Монорепа на ранней стадии: `core` пуст, `web`/`mobile` — скелет. Сейчас правила описывают разрозненные структуры (`model/lib` в core, плоский `src/` в apps, корневой баррель `core`), а целевая модель — единая модульная архитектура с явными границами. Зафиксировать её до появления доменного кода дешевле, чем мигрировать позже.

## What Changes

- **BREAKING**: удалить корневой `packages/core/src/index.ts`; потребители импортируют `@core/modules/*` и `@core/shared`, не `from "@core"`.
- Зафиксировать структуру `@core`: `modules/{domain}/` (базовые `api/`, `types/`, `hooks/`, `utils/` + опциональные `store/`, `selectors/`, `contexts/` и др.) и `shared/` (`types/`, `hooks/`, `utils/`, `index.ts`).
- Зафиксировать структуру `apps/web` и `apps/mobile`: верхний уровень `src/` — `app/`, `modules/`, `shared/`; граф `app → modules → shared`.
- **Web**: текущее содержимое `src/` переезжает в `src/app/`; в `index.html` обновить script src на новый путь (`/src/app/main.tsx`).
- **Mobile**: `apps/mobile/index.ts` **не меняется**; только `App.tsx` → `src/app/App.tsx` (обновить import в entry).
- Единый граф зависимостей: `app → modules → shared`; модули между собой — только через `index.ts`.
- Wildcard `exports` в `packages/core/package.json` (`./modules/*`, `./shared`).
- Biome `noRestrictedImports` для enforcement границ импортов.
- Обновить `.cursor/rules/architecture.mdc`, `openspec/config.yaml`, `.cursor/agents/researcher.md`, `.cursor/rules/testing.mdc`.
- Перенести web-код в `src/app/`; mobile `App.tsx` — в `src/app/App.tsx`.
- `@ui` и `apps/ui-storybook` — **без изменений**.

## Capabilities

### New Capabilities

- `architecture`: единая модульная архитектура `core`, `web`, `mobile` — слои, структура папок, граф импортов, public API, subpath exports, lint enforcement.

### Modified Capabilities

- `tooling/testing`: пути примеров и scope unit-тестов под новую структуру (`utils/` вместо `lib/`).

## Impact

- `packages/core/package.json` — wildcard exports, удаление корневого export.
- `packages/core/src/` — удаление `index.ts`; целевая структура `modules/`, `shared/` — в правилах (каталоги по мере кода).
- `apps/web/src/` — bulk-move в `app/`; `apps/web/index.html` — обновление script src.
- `apps/mobile/src/app/App.tsx` — перенос из `src/App.tsx`; `apps/mobile/index.ts` — только путь import.
- `biome.json` — `noRestrictedImports` overrides по пакетам.
- `.cursor/rules/architecture.mdc`, `openspec/config.yaml`, `.cursor/agents/researcher.md`, `.cursor/rules/testing.mdc`.
- `openspec/specs/architecture/spec.md` — новая main spec после merge.

## Non-goals

- Реализация доменных модулей (auth, chat и т.д.).
- Изменения `@ui`, `apps/ui-storybook`.
- Migration guide для legacy-кода (его нет).
- Component tests; e2e остаётся в `apps/web/e2e/`.
- Vitest-инфраструктура в `apps/mobile`.
- Предварительное создание пустых каталогов (`.gitkeep`, локальные `README`, placeholder `index.ts`).
