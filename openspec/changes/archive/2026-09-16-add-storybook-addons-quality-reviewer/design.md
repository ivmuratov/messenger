## Context

См. `proposal.md` — Why. Текущее состояние:

- `apps/ui-storybook`: Storybook 10.6.0, `@storybook/addon-docs`, global decorator `ThemeProvider defaultTheme="light"` (hardcoded)
- Chromatic CI на PR; baseline light зафиксирован design decision из `add-chromatic`
- `.cursor/agents/`: только `researcher.md`; generic `reviewer.md` удалён в `streamline-dev-workflow`
- Biome: группы a11y/complexity/performance частично ослаблены; global rules в `.cursor/rules/`

## Goals / Non-Goals

**Goals:**

- A11y audit в Storybook (axe-core panel) для web `@ui` stories
- Toolbar light/dark через `@storybook/addon-themes`, синхрон с `ThemeProvider`
- Syncpack-контроль версий новых addons
- Subagent `quality-reviewer` + skill `review-quality` для post-apply review
- Документация в `.cursor/README.md`, testing skill, `openspec/config.yaml`

**Non-Goals:**

- `@storybook/addon-vitest`, CI fail на a11y violations
- Interaction tests, mobile stories
- Spec-reviewer, generic architecture reviewer
- Замена `security-review` — только дополнение

## Decisions

### 1. Установка addons через storybook CLI

**Решение:** `npx storybook add @storybook/addon-a11y` и `@storybook/addon-themes` из `apps/ui-storybook` (или ручная установка `@10.6.0` + правка `main.ts`).

**Owner:** `apps/ui-storybook`

**Альтернатива:** ручной `pnpm add` — допустимо, если версии строго `10.6.0`.

### 2. Themes addon + ThemeProvider

**Решение:** decorator в `preview.tsx` принимает theme из addon-themes globals. Использовать `withThemeFromJSXProvider` или кастомный decorator:

- themes: `{ light, dark }` → `<ThemeProvider defaultTheme={theme}>{Story}</ThemeProvider>`
- `initialGlobals.theme = 'light'` для стабильного Chromatic default
- Toolbar item из addon-themes

**Почему:** `ThemeProvider` web уже ставит `document.documentElement.dataset.theme` в `useEffect`; addon MUST передавать `defaultTheme` / controlled theme при смене toolbar.

**Owner:** `apps/ui-storybook` (preview only; `@ui` ThemeProvider без изменений API, если decorator достаточен)

**Альтернатива:** `withThemeByDataAttribute` на `data-theme` — проще для VE, но нужна синхронизация React context для ThemeSwitcher.

### 3. A11y preview parameters

**Решение:** в `preview.tsx` — `parameters.a11y` с `test: 'todo'` в dev (не блокирует Chromatic/CI). Rule violations видны в панели; CI fail — non-goal этого change.

**Owner:** `apps/ui-storybook`

### 4. Chromatic и dark theme

**Решение:** default snapshot — light. Dark — опционально через named story export `Dark` с `parameters.theme = 'dark'` или `globals.theme = 'dark'` только для явных variants (Typography, Page). ThemeSwitcher default story — light only.

**Owner:** `apps/ui-storybook`, `@ui` stories (минимальные правки)

### 5. Syncpack

**Решение:** добавить в группу Storybook:

```ts
"@storybook/addon-a11y",
"@storybook/addon-themes",
```

**Owner:** root (`syncpack.config.ts`)

### 6. quality-reviewer subagent

**Решение:** `.cursor/agents/quality-reviewer.md`:

```yaml
---
name: quality-reviewer
model: inherit
description: Read-only review diff на security, perf, React render, a11y. После opsx-apply. Не architecture/imports.
readonly: true
---
```

Промпт: negative scope (не arch/naming/imports/styling location); positive scope (security in diff, O(n²), re-renders, RN FlatList/a11y, web ARIA/keyboard); output table + verdict. Fork идей из HKTITAN performance-analyzer + accessibility-checker, но **readonly** и monorepo-specific (web + mobile paths).

**Owner:** root (`.cursor/`)

### 7. Skill review-quality

**Решение:** `.cursor/skills/review-quality/SKILL.md` — по образцу `review-bugbot`:

- Task `subagent_type: "quality-reviewer"`
- Prompt: `Full Repository Path`, `Diff: branch changes` (default)
- Summarize as table Severity | Location | Finding

**Owner:** root (`.cursor/skills/`)

**Альтернатива:** slash command — отложено; skill достаточно для явного вызова.

### 8. openspec/config.yaml

**Решение:** в `operations.apply.guidance` добавить пункт: после UI/apply tasks — опционально `review-quality`; для security-sensitive — `review-security`.

**Owner:** root (`openspec/config.yaml`)

## Risks / Trade-offs

| Риск | Mitigation |
|------|------------|
| ThemeProvider не синхронизируется с toolbar | Decorator передаёт theme prop; smoke ThemeSwitcher light/dark |
| A11y panel шум на legacy stories | Fix critical только на затронутых stories; rest — advisory |
| Chromatic flaky при theme toggle | Default light; dark — отдельные named exports |
| quality-reviewer дублирует rules | Explicit negative scope в промпте |
| quality-reviewer шумит как старый reviewer | Узкий scope: perf/security/a11y only |

## Migration Plan

1. Установить addons, обновить syncpack
2. Настроить preview (themes + a11y)
3. Smoke `pnpm storybook`, `pnpm build-storybook`
4. Добавить quality-reviewer + skill + docs
5. Verify: `pnpm lint && pnpm typecheck && pnpm syncpack:list`

Rollback: revert addon deps и preview; удалить agent/skill files.
