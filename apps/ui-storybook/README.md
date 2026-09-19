# ui-storybook

Storybook-каталог web- и mobile-компонентов `@ui` и visual regression через [Chromatic](https://www.chromatic.com/).

Stories colocated в `packages/ui/src/**/web/*.stories.tsx` и `packages/ui/src/**/mobile/*.stories.tsx`. Один workspace-пакет `apps/ui-storybook`, **два конфига** Storybook:

| Конфиг | Stories glob | Dev port | Static output |
|--------|----------------|----------|---------------|
| `.storybook-web/` | `*/web/*.stories.tsx` | 6006 | `dist-web/` |
| `.storybook-mobile/` | `*/mobile/*.stories.tsx` | 6007 | `dist-mobile/` |

- **Web:** sidebar `Components/*`, DOM + Vanilla Extract, `ThemeProvider` через default export `@ui`.
- **Mobile:** sidebar `Mobile/*`, RN-web (`react-native` → `react-native-web`), `ThemeProvider` через `@ui` с Vite condition `react-native`. Native-only модули — stubs в `.storybook-mobile/stubs/`.

Story-файлы **не** содержат `parameters.platform`: платформа задаётся выбором конфига/runner, не метаданными story.

## Границы Chromatic и RN-web

Chromatic сравнивает **layout и токены** web- и mobile-stories в **двух отдельных build** (два Chromatic project). Это **не** подтверждает поведение на устройстве:

- жесты, worklets и native-анимации;
- различия iOS/Android;
- pixel-perfect совпадение RN-web и native runtime.

Unit-тесты hooks и utils остаются в Vitest. Mobile e2e (Maestro и т.п.) в этом каталоге не покрываются.

## Addons

- **Accessibility** (`@storybook/addon-a11y`) — панель Accessibility с axe-core audit при просмотре story
- **Themes** (`@storybook/addon-themes`) — toolbar light/dark, синхронизирован с `ThemeProvider` (web: `data-theme` + VE; mobile: mobile `ThemeProvider`). Default theme — `light` (Chromatic baseline)

Dark-варианты — через named story exports с `globals.theme = 'dark'`, не через toolbar в CI.

## Команды

Из корня монорепы:

```bash
pnpm storybook              # web dev :6006, Components/*
pnpm build-storybook        # dist-web + dist-mobile
pnpm chromatic              # web + mobile (два project token)
```

Платформа отдельно — скрипты пакета `ui-storybook`:

```bash
pnpm --filter ui-storybook dev:mobile
pnpm --filter ui-storybook build:web
pnpm --filter ui-storybook build:mobile
pnpm --filter ui-storybook chromatic:web
pnpm --filter ui-storybook chromatic:mobile
```

## Chromatic

Два Chromatic project (web и mobile RN-web), два token. Baselines хранятся в облаке Chromatic.

### Настройка

1. Создайте **два** проекта на [chromatic.com](https://www.chromatic.com/) (web catalog и mobile catalog) и получите project token для каждого.
2. **GitHub (CI):** секреты в Settings → Secrets and variables → Actions:
   - `CHROMATIC_PROJECT_TOKEN` — web build (`dist-web`)
   - `CHROMATIC_PROJECT_TOKEN_MOBILE` — mobile build (`dist-mobile`)
3. **Локально:** в `.env` (см. `.env.example` в корне):

   ```bash
   CHROMATIC_PROJECT_TOKEN=chpt_...
   CHROMATIC_PROJECT_TOKEN_MOBILE=chpt_...
   ```

   Для mobile upload CLI использует `CHROMATIC_PROJECT_TOKEN_MOBILE` (см. `chromatic:mobile` в `apps/ui-storybook/package.json`).

### Review flow

1. PR с visual changes → Chromatic bot публикует ссылки на build(s) в комментарии PR.
2. Reviewer принимает или отклоняет изменения в [Chromatic UI](https://www.chromatic.com/).
3. После accept — merge или re-run CI.

Непринятые visual changes дают **ненулевой exit code** (`pnpm chromatic` и CI job).

Первый успешный run на `main` создаёт initial baseline для stories в соответствующем project (`Components/*` или `Mobile/*`).
