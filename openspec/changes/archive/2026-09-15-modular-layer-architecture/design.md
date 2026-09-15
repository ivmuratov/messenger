## Context

См. `proposal.md` — Why. `core` пуст (placeholder `index.ts`), `web`/`mobile` — минимальный скелет с плоским `src/`. Правила и OpenSpec config описывают `model/lib` и корневой `core`. `ui` уже имеет layered architecture (`ThemeProvider → components → shared`) — её не меняем.

## Goals / Non-Goals

**Goals:**

- Единая модульная схема `app → modules → shared` в `core`, `web`, `mobile`.
- Subpath imports `@core/modules/*`, `@core/shared`; удаление корневого барреля.
- Web: bulk-move `src/*` → `src/app/*`; обновить `index.html` script src на `/src/app/main.tsx`.
- Mobile: `App.tsx` → `src/app/App.tsx`; `apps/mobile/index.ts` без изменений структуры.
- Расширяемые подпапки модулей (`store/`, `selectors/`, `contexts/` и др.) — единообразно во всех трёх слоях.
- Biome enforcement границ импортов.
- Синхронизация `.cursor/rules`, OpenSpec config, researcher.

**Non-Goals:**

- Доменные модули (auth, chat).
- Изменения `ui`, `ui-storybook`.
- Component tests, migration guide.
- Vitest-инфраструктура в `apps/mobile`.
- Пустые каталоги-заготовки (`.gitkeep`, локальные `README`, placeholder `index.ts`).

## Decisions

### 1. Структура каталогов в `core` (owner: `core`)

**Решение:** `modules/{domain}/` с **базовым набором** каталогов `api/`, `types/`, `hooks/`, `utils/` + `index.ts`. Дополнительно модуль MAY содержать `store/`, `selectors/`, `contexts/` и другие каталоги по необходимости — **единый принцип во всех трёх слоях** (`@core`, `web`, `mobile`). Не каждый модуль обязан иметь все каталоги; состав определяется при создании модуля. В `@core` `selectors/`/`contexts/` могут не понадобиться — решение откладывается.

`shared/{types,hooks,utils}/` + `index.ts` — без обязательных `store/`/`selectors/` (инфраструктурный слой).

**Альтернатива:** жёсткий whitelist папок — отклонено: пользователь хочет extensibility «поймём потом», но с единообразием.

### 2. Структура `web`/`mobile` (owner: `web`, `mobile`)

**Решение:** идентичная `@core` + `components/` в modules. Верхний уровень `src/`:

```
apps/{web|mobile}/src/
├── app/        # bootstrap, routes/nav, layouts (текущий код apps)
├── modules/
└── shared/
```

**Альтернатива:** routes в корне `src/routes/` — отклонено ранее; при bulk-move routes окажутся в `app/routes/`.

### 3. Entry points apps (owner: `web`, `mobile`)

**Web — решение:**

- Bulk-move всего текущего содержимого `apps/web/src/` в `apps/web/src/app/` (`main.tsx`, `routes/`, и т.д.).
- Обновить `apps/web/index.html`: script src с `/src/main.tsx` на `/src/app/main.tsx`.

**Mobile — решение:**

- `src/App.tsx` → `src/app/App.tsx`.
- `apps/mobile/index.ts` **остаётся** на месте; меняется только import: `./src/app/App`.
- **Не** создаём `src/index.ts`, **не** меняем `package.json` `"main"`.

**Альтернатива:** единый `src/index.ts` + `app/App.tsx` для обеих платформ — отклонено пользователем.

### 4. Subpath exports без per-module entries (owner: `core`)

**Решение:** в `packages/core/package.json`:

```json
"exports": {
  "./modules/*": {
    "types": "./dist-types/modules/*/index.d.ts",
    "default": "./src/modules/*/index.ts"
  },
  "./shared": {
    "types": "./dist-types/shared/index.d.ts",
    "default": "./src/shared/index.ts"
  }
}
```

Удалить `"."` export. Новые модули добавляются только как папка + `index.ts`.

**Альтернатива:** явный список модулей — отклонено пользователем.

### 5. Внутренние vs внешние импорты (owner: все слои)

| Контекст | Паттерн |
|----------|---------|
| apps → core | `core/modules/{name}`, `core/shared` |
| apps → @ui | `@ui` only |
| внутри пакета | `@/modules/...`, `@/shared`, `@/app/...` |
| внутри модуля | относительные `./`, `../` |

### 6. Biome noRestrictedImports (owner: `root`)

**Решение:** overrides в `biome.json` по glob-путям:

- `packages/core/src/shared/**` — запрет `@/modules/*`
- `packages/core/src/modules/**` — запрет импортов matching `@/modules/*/!(index)` deep paths (практически: запрет `@/modules/*/*/` кроме index — упростить через convention + review если Biome не поддерживает negation)
- `packages/core/**` — запрет `@ui`, `apps/`
- `apps/*/src/**` — запрет `packages/ui/src`, `@/components` из ui internals
- apps modules components — запрет `*.css.ts`, `*.styles.ts` imports

Примечание: Biome `noRestrictedImports` не покрывает все edge cases (циклы module↔module). На первом этапе — ключевые границы; циклы — code review.

**Альтернатива:** ESLint boundaries plugin — отклонено: проект на Biome.

### 7. TanStack Router после переноса routes (owner: `web`)

**Решение:** обновить `@tanstack/router-plugin` routes directory на `src/app/routes/` (через plugin config `routesDirectory` если требуется). Перегенерировать `routeTree.gen.ts`.

### 8. Каталоги по мере кода (owner: все слои)

**Решение:** `modules/` и `shared/` **не создаются заранее**. Появляются вместе с первым реальным кодом. Целевая структура — в артефактах OpenSpec и `.cursor/rules`, не в пустых папках, `.gitkeep` или локальных `README`.

**Альтернатива:** scaffold пустых каталогов при apply — отклонено пользователем.

### 9. Артефакты документации (owner: `root`)

**Решение:** один change обновляет `architecture.mdc`, `config.yaml`, `researcher.md`, `testing.mdc`; main spec `openspec/specs/architecture/spec.md` создаётся при archive.

## Risks / Trade-offs

- **[Biome ограничен для deep-import detection]** → фиксируем convention + public API; усиливаем review на PR.
- **[Wildcard exports + TypeScript declarations]** → проверить `tsc -b` резолвит `core/modules/foo`; при необходимости adjust `paths` в tsconfig base для apps.
- **[Router plugin paths]** → после переноса routes прогнать `pnpm dev` web и e2e smoke.

## Migration Plan

Код почти пуст — migration не требуется. Порядок implement:

1. Зафиксировать целевую структуру в правилах и OpenSpec (без пустых каталогов).
2. Обновить `core` exports, удалить root index.
3. Реорганизовать `web` (bulk-move в `app/`, обновить `index.html`).
4. Реорганизовать `mobile` (App → `app/App.tsx`, fix import в entry).
5. Biome rules + docs.
6. `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

Rollback: revert single change (нет production data).

## Open Questions

- Переиспользуемый UI между фичами внутри одного app — `shared/` vs новый module: решается при первой такой фиче.
- Нужны ли `selectors/`/`contexts/` в конкретном `@core`-модуле — решается per-module при появлении доменов.
