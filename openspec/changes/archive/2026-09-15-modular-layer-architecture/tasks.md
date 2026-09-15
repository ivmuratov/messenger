## 1. @core — exports

- [x] 1.1 Удалить `packages/core/src/index.ts` — verify: файла нет
- [x] 1.2 Обновить `packages/core/package.json` exports: `./modules/*` и `./shared`, удалить `"."` — verify: `pnpm --filter @core typecheck` проходит

## 2. apps/web — реорганизация слоёв

- [x] 2.1 Bulk-move текущего содержимого `apps/web/src/` (`main.tsx`, `routes/`, и т.д.) в `apps/web/src/app/` — verify: код под `app/`
- [x] 2.2 Обновить TanStack Router plugin config если требуется для `app/routes/` — verify: `routeTree.gen.ts` генерируется
- [x] 2.3 Обновить `apps/web/index.html`: script src `/src/main.tsx` → `/src/app/main.tsx` — verify: dev-сервер загружает приложение
- [x] 2.4 Обновить imports внутри перенесённых файлов — verify: `pnpm --filter web typecheck`

## 3. apps/mobile — реорганизация слоёв

- [x] 3.1 Перенести `src/App.tsx` → `src/app/App.tsx` — verify: файл на новом месте
- [x] 3.2 Обновить import в `apps/mobile/index.ts` на `./src/app/App` — verify: `pnpm --filter mobile typecheck`
- [x] 3.3 **Не создавать** `apps/mobile/src/index.ts`, **не менять** роль `apps/mobile/index.ts` — verify: `src/index.ts` отсутствует

## 4. Biome — enforcement

- [x] 4.1 Добавить `noRestrictedImports` overrides в `biome.json` для `@core` (`shared→modules`, `@core→@ui`) — verify: тестовый forbidden import ловится lint
- [x] 4.2 Добавить overrides для `apps/web` и `apps/mobile` (deep `@ui`, стили в modules) — verify: `pnpm lint` проходит на чистом коде

## 5. Документация и правила

- [x] 5.1 Обновить `.cursor/rules/architecture.mdc` под новую структуру `@core`, `web`, `mobile` (extensible module folders, entry points) — verify: нет `model/`, `lib/`, корневого `@core`, нет `src/index.ts` pattern
- [x] 5.2 Обновить `openspec/config.yaml` context (imports, structure) — verify: соответствует spec
- [x] 5.3 Обновить `.cursor/agents/researcher.md` — verify: карта пакетов актуальна
- [x] 5.4 Обновить `.cursor/rules/testing.mdc` (paths `utils/`) — verify: примеры путей совпадают с spec

## 6. Финальная верификация

- [x] 6.1 `pnpm lint && pnpm typecheck && pnpm test && pnpm build` — verify: все green
- [x] 6.2 `pnpm test:e2e` — verify: e2e проходят после переноса routes и обновления entry
- [x] 6.3 `openspec validate modular-layer-architecture --strict` — verify: change valid
