## Context

См. `proposal.md` — Why.

Текущее состояние:

- `@ui` экспортирует 6 web-кomponentов: ThemeProvider, ThemeSwitcher, Typography, DrawerLayout, Flex, Page
- Стили web — Vanilla Extract (`.css.ts`); `apps/web` уже использует `@vanilla-extract/vite-plugin`
- Storybook отсутствует; `syncpack.config.ts` имеет группы React, Tooling, Testing — без Storybook
- Документация: `README.md`, `.cursor/rules/*`, `.cursor/agents/*`, `openspec/config.yaml` — ui-storybook не упомянут
- Vitest покрывает hooks/utils; component tests вне scope (см. `tooling/testing`)

Ограничения: pnpm workspaces, Turbo, syncpack exact versions, Node >= 22.21.1, React 19.1.0, Vite 7 в web.

## Goals / Non-Goals

**Goals:**

- Минимальный рабочий `apps/ui-storybook` на Storybook **10.6.0** (latest stable)
- Colocated stories для визуальных web-кomponentов (`ThemeProvider` — только global decorator)
- Корректный рендер VE-стилей и ThemeProvider
- Root scripts + syncpack-группа Storybook
- Обновление всей проектной документации о новом слое

**Non-Goals:**

- Chromatic, CI visual regression, deploy каталога
- Mobile stories
- Runner/addons Storybook в `@ui` или root (в `@ui` допустим только `@storybook/react` devDep для типов stories)
- Addons beyond `@storybook/addon-docs` (autodocs)

## Decisions

### 1. Гибрид: runner в app, stories в @ui

**Решение:** конфиг и зависимости — `apps/ui-storybook`; story-файлы — `packages/ui/src/**/web/*.stories.tsx`.

**Почему:** соответствует границам apps/packages; `@ui` остаётся библиотекой; stories colocated с web-реализацией.

**Альтернатива:** всё в `@ui` — проще, но размывает роль пакета и тащит Storybook tooling в библиотеку.

**Owner:** `apps/ui-storybook`, `@ui` (stories only)

### 2. Storybook 10.6.0 + @storybook/react-vite

**Решение:** `storybook@10.6.0`, `@storybook/react-vite@10.6.0`, `@storybook/addon-docs@10.6.0`.

**Почему:** latest stable; нативная интеграция с Vite 7; CSF3 + autodocs.

**Owner:** `apps/ui-storybook`

### 3. Vanilla Extract в viteFinal

**Решение:** в `.storybook/main.ts` через `viteFinal` добавить `@vanilla-extract/vite-plugin` (та же major, что в web: `5.2.1`).

```typescript
async viteFinal(config) {
  const { vanillaExtractPlugin } = await import("@vanilla-extract/vite-plugin");
  config.plugins = [...(config.plugins ?? []), vanillaExtractPlugin()];
  return config;
}
```

**Owner:** `apps/ui-storybook`

### 4. Alias `@/` для stories в @ui

**Решение:** `vite-tsconfig-paths` или explicit alias `@` → `../../packages/ui/src` в viteFinal.

**Почему:** stories импортируют `./Typography` и `@/shared/...` как компоненты.

**Owner:** `apps/ui-storybook`

### 5. Typecheck и IDE для stories — `tsconfig.stories.json` + devDep в @ui

**Решение:**

- `packages/ui/tsconfig.json` — exclude `**/*.stories.tsx` (stories не попадают в `dist-types`)
- `packages/ui/tsconfig.stories.json` — extends base, `include: ["src/**/*.stories.tsx"]`, `noEmit: true`, `composite: false`
- `references` в основном tsconfig → `tsconfig.stories.json` (IDE подхватывает типы для story-файлов)
- `@ui` devDep: `@storybook/react@10.6.0` — только `Meta`, `StoryObj` и прочие типы CSF
- Script: `"typecheck": "tsc -b && tsc -p tsconfig.stories.json --noEmit"`

**Почему:** runner/addons остаются в ui-storybook; типы и подсказки при написании stories — в `@ui`, без emit `.d.ts` для stories.

**Альтернатива:** typecheck stories только в ui-storybook — ломает DX в IDE при редактировании файлов в `packages/ui`.

**Owner:** `@ui`

### 6. Global preview decorator

**Решение:** `.storybook/preview.tsx`:

- import `@ui` ThemeProvider styles (через side-effect import ThemeProvider styles path)
- decorator: `<ThemeProvider defaultTheme="light">{Story()}</ThemeProvider>`

ThemeSwitcher story работает без дублирования Provider.

**Owner:** `apps/ui-storybook`

### 7. Story naming и содержание

| Компонент | Title | Минимальные stories |
|-----------|-------|---------------------|
| ThemeProvider | — | Нет story; только global decorator в `preview.tsx` |
| ThemeSwitcher | `Atoms/ThemeSwitcher` | Default |
| Typography | `Atoms/Typography` | Default, Sizes (arg types) |
| Flex | `Layouts/Flex` | Default, Row |
| Page | `Layouts/Page` | Default (Header + Body) |
| DrawerLayout | `Layouts/DrawerLayout` | Open, Closed |

Compound: `DrawerLayout` + `.Aside` + `.Main`; `Page` + `.Header` + `.Body`.

**Owner:** `@ui`

### 8. Syncpack группа Storybook

**Решение:** добавить в `syncpack.config.ts`:

```typescript
{
  label: "Storybook",
  dependencies: [
    "storybook",
    "@storybook/react-vite",
    "@storybook/react",
    "@storybook/addon-docs",
    "@storybook/builder-vite",
  ],
  packages: ["**"],
  policy: "sameRange",
}
```

Exact version `10.6.0` для всех.

**Owner:** root

### 9. Root scripts

```json
"storybook": "pnpm --filter ui-storybook dev",
"build-storybook": "pnpm --filter ui-storybook build"
```

`apps/ui-storybook/package.json`:

```json
"dev": "storybook dev -p 6006",
"build": "storybook build -o dist"
```

Turbo: наследует global `dev` (persistent, no cache) — отдельная запись не обязательна.

**Owner:** root, `apps/ui-storybook`

### 10. Зависимости ui-storybook

**prod/runtime deps:** `@ui` workspace, `react`, `react-dom`, peer styling (`@vanilla-extract/css`, `clsx`, `lucide-react` — для ThemeSwitcher в stories)

**devDeps:** storybook packages, `@vanilla-extract/vite-plugin`, `vite-tsconfig-paths`, `typescript`

**Owner:** `apps/ui-storybook`

### 11. Документация

Обновить:

- `README.md` — команды `pnpm storybook`, `pnpm build-storybook`
- `.cursor/README.md` — упоминание `apps/ui-storybook`
- `.cursor/rules/architecture.mdc` — слой в обзоре и границах apps
- `.cursor/rules/testing.mdc` — секция Storybook vs Vitest
- `.cursor/agents/researcher.md`, `.cursor/agents/reviewer.md` — ui-storybook в контексте
- `openspec/config.yaml` — layout, verification commands

**Owner:** root (docs)

## Risks / Trade-offs

| Риск | Митигация |
|------|-----------|
| VE не резолвится в Storybook | Smoke story Typography первой; viteFinal plugin |
| `@/` alias ломает импорты в stories | vite-tsconfig-paths + alias в `viteFinal`; `apps/ui-storybook/tsconfig.json` без `paths` (typecheck только `.storybook/`) |
| Stories без types в IDE | `@storybook/react` devDep + `tsconfig.stories.json` с project reference |
| ThemeSwitcher требует ThemeContext | Global decorator ThemeProvider |
| DrawerLayout compound API | Story с явной композицией Root/Aside/Main |
| Storybook 10 breaking vs 8 tutorials | Документировать версию 10.6.0 в design/tasks |

## Migration Plan

1. Добавить syncpack группу Storybook
2. Scaffold `apps/ui-storybook` + install deps
3. Настроить `.storybook/main.ts`, `preview.tsx`
4. `tsconfig.stories.json` + `@storybook/react` devDep в `@ui`; ui-storybook tsconfig только для `.storybook/`
5. Написать stories (Typography первой — smoke)
6. Root scripts
7. Обновить документацию
8. Verify: `pnpm storybook`, `pnpm build-storybook`, `pnpm lint`, `pnpm typecheck`, `pnpm syncpack:list`

**Rollback:** удалить `apps/ui-storybook`, stories, revert docs/syncpack/root scripts.

## Open Questions

_(нет — scope зафиксирован)_
