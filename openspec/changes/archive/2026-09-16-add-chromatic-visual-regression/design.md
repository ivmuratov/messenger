## Context

См. `proposal.md` — Why.

Текущее состояние:

- `apps/ui-storybook`: Storybook 10.6.0, glob `packages/ui/src/**/*.stories.tsx`, `@storybook/addon-docs`, global `ThemeProvider` decorator
- Root scripts: `pnpm storybook`, `pnpm build-storybook`; static output — `apps/ui-storybook/dist`
- ~5 web-кomponentов со stories (ThemeSwitcher, Typography, DrawerLayout, Flex, Page)
- CI отсутствует (нет `.github/workflows/`); pre-commit: build, lint, typecheck, syncpack
- Change `add-storybook` явно отложил Chromatic; Purpose main-spec `tooling/storybook` упоминает visual regression, но requirement ещё нет

Ограничения: pnpm workspaces, runner/addons только в `apps/ui-storybook`; `@ui` — только `@storybook/react` devDep для типов stories.

## Goals / Non-Goals

**Goals:**

- Chromatic visual regression для всех текущих и будущих stories `@ui`
- GitHub Actions workflow на PR и push в default branch
- Root script `pnpm chromatic` для локального запуска
- Документация onboarding (token, review flow, accept changes)
- Задокументированный fallback: миграция на Lost Pixel OSS при исчерпании free tier Chromatic

**Non-Goals:**

- Deploy Storybook (Pages/Vercel)
- Mobile stories, interaction tests, a11y addon, `@storybook/addon-themes`
- Реализация Lost Pixel сейчас
- Chromatic в pre-commit
- Cross-browser matrix (Safari/Firefox) — только Chrome на free tier

## Decisions

### 1. Chromatic вместо Lost Pixel (сейчас)

**Решение:** `chromatic` CLI + managed baselines в облаке Chromatic.

**Почему:** нет CI; маленький каталог (~10–15 snapshots); free tier 5000 billed snapshots/мес с TurboSnap; лучший PR review UX из коробки.

**Альтернатива:** Lost Pixel OSS — self-hosted, baselines в git, но больше операционки при старте с нуля.

**Fallback (design-level):** при приближении к лимитам или отказе от SaaS — change `migrate-to-lost-pixel`: `build-storybook` + GitHub Action `lost-pixel/lost-pixel`, baselines в `.lostpixel/`. Stories colocated и runner в `apps/ui-storybook` не меняются.

**Owner:** `apps/ui-storybook`, root (CI)

### 2. Зависимость chromatic только в ui-storybook

**Решение:** `chromatic` в devDependencies `apps/ui-storybook`; root script:

```json
"chromatic": "pnpm --filter ui-storybook chromatic"
```

**Почему:** соответствует границе runner/addons из `tooling/storybook`; root без Storybook/Chromatic deps.

**Owner:** `apps/ui-storybook`, root (script only)

### 3. Script chromatic в ui-storybook

**Решение:**

```json
"chromatic": "chromatic --build-script-name=build --exit-zero-on-changes"
```

Флаги:

- `--build-script-name=build` — использует существующий `build` (`storybook build -o dist`)
- `--exit-zero-on-changes` — локально не блокирует при новых changes (удобно для первого baseline); **CI** запускает без этого флага или с `--exit-once-uploaded` по необходимости, чтобы PR fail при unaccepted changes

**CI variant:**

```bash
pnpm build-storybook && pnpm --filter ui-storybook exec chromatic --storybook-build-dir=dist
```

Или единый script с env `CI=true` для разного exit behavior.

**Owner:** `apps/ui-storybook`

### 4. GitHub Actions workflow

**Решение:** `.github/workflows/chromatic.yml`:

- Trigger: `pull_request`, `push` на default branch (main)
- Paths filter: `packages/ui/**/*.stories.tsx`, `packages/ui/src/**/web/**`, `apps/ui-storybook/**`
- Steps: checkout → pnpm install → Node 22 → `pnpm build-storybook` → chromatic с `CHROMATIC_PROJECT_TOKEN`
- `fetch-depth: 0` для TurboSnap (git history)

**Почему:** path filter экономит CI minutes; TurboSnap снижает billed snapshots.

**Owner:** root

### 5. Syncpack

**Решение:** добавить `chromatic` в группу `Storybook` в `syncpack.config.ts` (exact version).

**Owner:** root

### 6. Документация

Обновить:

- `README.md` — `pnpm chromatic`, секрет, ссылка на Chromatic dashboard, review flow (без migration path на Lost Pixel)
- `.cursor/rules/testing.mdc` — Storybook/Chromatic vs Vitest
- `openspec/config.yaml` — verification command `pnpm chromatic`

План fallback на Lost Pixel — только в OpenSpec (`design.md`, delta spec); `README.md` MUST NOT дублировать migration path.

**Owner:** root

### 7. Review flow для разработчиков

**Решение:**

1. PR с visual changes → Chromatic bot комментирует ссылку на build
2. Reviewer accept/reject в Chromatic UI
3. Re-run или merge после accept

Первый run на main создаёт initial baseline.

**Owner:** process (documented in README)

## Risks / Trade-offs

| Риск | Митигация |
|------|-----------|
| Flaky snapshots (fonts, animations) | Статичные stories; при необходимости `chromatic.disableSnapshot` на анимированных stories |
| Free tier исчерпан | TurboSnap + path filter; fallback design на Lost Pixel |
| Token leak | Только GitHub Secret; `.env` в gitignore; документировать |
| ThemeSwitcher меняет иконку по теме | Global decorator `defaultTheme="light"` — стабильный baseline; dark — отдельный change с `@storybook/addon-themes` |
| CI без истории git — TurboSnap не работает | `fetch-depth: 0` в checkout action |
| Vendor lock-in Chromatic | Stories и `build-storybook` остаются portable; миграция — смена runner step |

## Migration Plan

1. Создать проект на chromatic.com, получить `CHROMATIC_PROJECT_TOKEN`
2. Добавить `chromatic` devDep и scripts в `apps/ui-storybook`
3. Добавить root script `chromatic`
4. Добавить GitHub Secret
5. Создать workflow, push → первый baseline на main
6. Обновить документацию
7. Verify: локальный `pnpm chromatic` (dry-run или test project), CI green на PR без visual changes

**Rollback:** удалить workflow, chromatic dep/scripts, revert docs; baselines остаются в Chromatic (можно archive project).

## Open Questions

_(нет — выбор Chromatic и scope зафиксированы пользователем)_
