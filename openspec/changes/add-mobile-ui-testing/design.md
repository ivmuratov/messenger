## Context

См. `proposal.md` — Why.

Текущее состояние:

- `apps/ui-storybook`: Storybook 10.6.0 + Vite, web stories в `*/web/`, Chromatic CI с path filter на web paths
- `packages/ui`: 5 компонентов с `web/` и `mobile/`; mobile использует Reanimated, gesture-handler, `lucide-react-native`, `react-native-theme-switch-animation`

Ограничения: visual regression — **Chromatic**; активная продуктовая разработка на web; `apps/mobile` и native e2e в этом change не затрагиваются.

**Уточнение (revise):** вместо одного Storybook с `parameters.platform` — **два конфига в одном** `apps/ui-storybook`, чтобы не смешивать web/mobile `ThemeProvider` и не импортировать `packages/ui/src` из runner.

## Goals / Non-Goals

**Goals:**

- Mobile stories в `apps/ui-storybook` (sidebar `Mobile/*` через `.storybook-mobile/`)
- Web stories без изменений семантики (`Components/*` через `.storybook-web/`)
- Chromatic snapshots для web и mobile (два build, два Chromatic project)
- Typecheck mobile stories в `@ui`
- Документация границ RN-web visual regression

**Non-Goals:**

- Отдельный npm-пакет `ui-storybook-native` / STORYBOOK_ENABLED в prod mobile
- `react-native-web` внутри `packages/ui`
- Vitest component tests
- Maestro, EAS Build/Workflows и любые mobile e2e scripts/workflows
- Chromatic Native / device pixel baselines
- Проверка жестов, worklets, native-анимаций и различий iOS/Android
- Изменения `apps/mobile`
- `parameters.platform` (или иные story-level маркеры платформы)

## Decisions

### 1. Два конфига Storybook в одном `apps/ui-storybook` (Owner: `apps/ui-storybook`)

**Решение:**

| Конфиг | Glob stories | Output | Dev |
|--------|----------------|--------|-----|
| `.storybook-web/` | `packages/ui/src/**/web/*.stories.tsx` | `dist-web/` | `pnpm storybook` (:6006) |
| `.storybook-mobile/` | `packages/ui/src/**/mobile/*.stories.tsx` | `dist-mobile/` | `pnpm --filter ui-storybook dev:mobile` (:6007) |

Web: Vite + Vanilla Extract, `@ui` default export.

Mobile: Vite condition `react-native` для `@ui`, alias `react-native` → `react-native-web`, stubs для native-only deps.

**Почему:** web и mobile `ThemeProvider` несовместимы в одном preview; public API `@ui` достаточен без `packages/ui/src/...` в runner.

**Отклонено:** единый Storybook + `parameters.platform` — magic string, риск неверного provider, обход архитектуры.

**Отклонено:** второй workspace app — лишний пакет при том же дублировании конфигов.

### 2. Preview: один `ThemeProvider` на конфиг (Owner: `apps/ui-storybook`)

**Решение:**

- Web `preview.tsx`: `ThemeProvider` из `@ui` (web entry) + `withThemeByDataAttribute` + VE
- Mobile `preview.tsx`: `ThemeProvider` из `@ui` (resolve `react-native` → mobile entry) + themes addon через `globals.theme`

Stories **не** задают платформу в `parameters`.

### 3. Stubs для native-only модулей (Owner: `.storybook-mobile/`)

**Решение:** только в mobile `viteFinal`; stubs в `.storybook-mobile/stubs/` (не в `@ui`).

| Модуль | Подход |
|--------|--------|
| `react-native-reanimated` | mock/stub (no-op Animated, identity hooks) |
| `react-native-gesture-handler` | stub `GestureDetector` → pass-through children |
| `react-native-theme-switch-animation` | stub: синхронный вызов `switchThemeFunction` |
| `react-native-worklets` | `runOnJS` mock |
| `react-native-safe-area-context`, `react-native-edge-to-edge` | minimal no-op |

DrawerLayout mobile stories: статические `isOpened` true/false.

### 4. Colocated mobile stories (Owner: `@ui`)

**Решение:** `mobile/{Component}.stories.tsx`, title `Mobile/{Component}`, паритет состояний с web где применимо.

### 5. Chromatic: два project (Owner: CI + `apps/ui-storybook`)

**Решение:**

- Web: `CHROMATIC_PROJECT_TOKEN`, build `dist-web`
- Mobile: `CHROMATIC_PROJECT_TOKEN_MOBILE`, build `dist-mobile`
- Path filter без изменений по смыслу (web + mobile paths + `apps/ui-storybook/**`)

**Почему:** один Chromatic project на partial build перезаписывает/теряет stories другой платформы.

### 6. Typecheck stories (Owner: `@ui`)

**Решение:** `tsconfig.stories.json` include `src/**/mobile/*.stories.tsx`.

### 7. Syncpack (Owner: root)

**Решение:** согласовать `react-native-web`, `react-native` и runner-зависимости.

## Risks / Trade-offs

| Риск | Митигация |
|------|-----------|
| RN-web визуально ≠ native device | Документировать в README |
| Reanimated stub ломает DrawerLayout story | Статические Open/Closed; `disableSnapshot` только если flaky |
| Два Chromatic project — onboarding | README + `.env.example` + два GitHub secrets |
| Stubs скроют native-регрессию | Не считать RN-web доказательством жестов/worklets |

## Migration Plan

1. **Infra:** split `.storybook-web/` + `.storybook-mobile/`, удалить unified `.storybook/` и `parameters.platform`
2. **Stories:** убрать platform meta из mobile `*.stories.tsx`
3. **Chromatic:** два build step + `CHROMATIC_PROJECT_TOKEN_MOBILE`
4. **Docs + OpenSpec:** обновить change artifacts
5. **Verify:** `pnpm build-storybook`, `@ui typecheck`, lint ui-storybook

**Rollback:** вернуть single config (не рекомендуется); удалить mobile stories и mobile Chromatic project.
