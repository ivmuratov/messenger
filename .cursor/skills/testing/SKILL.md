---
name: testing
description: Стек тестирования (vitest, playwright, MSW, Storybook), размещение тестов в __tests__/, именование и scope. Use when writing tests, implementing OpenSpec test tasks, or running pnpm test / pnpm test:e2e.
---

# Тестирование

## Стек

- **vitest** — test runner и assertions
- **@testing-library/react** — React hooks через `renderHook`
- **msw** — мокирование API (в `@core`)
- **@playwright/test** — e2e-тесты web-приложения (`apps/web/e2e/`)
- **Storybook** (`apps/ui-storybook`) — визуальный каталог web- и mobile-компонентов `@ui` (mobile через RN-web в браузере); два конфига `.storybook-web/` и `.storybook-mobile/`
- **Chromatic** — visual regression по двум static build (web + mobile RN-web); CI на PR/push в `main`, локально `pnpm chromatic` (оба project); одна платформа — `pnpm --filter ui-storybook chromatic:web` / `chromatic:mobile`

## Storybook vs Chromatic vs Vitest

- **Storybook** — просмотр состояний web (`Components/*`, `pnpm storybook`) и mobile (`Mobile/*`, `pnpm --filter ui-storybook dev:mobile`); stories colocated в `packages/ui`; runner только в `apps/ui-storybook`. Mobile: RN-web + stubs в `.storybook-mobile/stubs/`; без `parameters.platform` в stories
- **Storybook addons** (в каждом конфиге `.storybook-web/` и `.storybook-mobile/`):
  - `@storybook/addon-a11y` — панель **Accessibility** (axe-core) при просмотре story; `parameters.a11y.test: 'todo'` в preview (advisory, без CI fail)
  - `@storybook/addon-themes` — toolbar **light/dark**, синхронизирован с web или mobile `ThemeProvider`; default `initialGlobals.theme = 'light'` для Chromatic baseline
- **Chromatic** — pixel comparison snapshots stories; baselines в облаке Chromatic; проверяет layout/tokens в RN-web, **не** жесты/worklets/native-анимации на устройстве; не заменяет unit-тесты hooks и utils
- **Vitest** — unit-тесты hooks, utils, stores, API; component tests (`render(<Component />)`) по-прежнему вне scope
- **Mobile e2e** — вне текущего scope (нет Maestro/EAS в этом стеке)
- **Типы stories:** `@storybook/react` devDep в `@ui`, отдельный `tsconfig.stories.json` для web и mobile stories (не попадает в `dist-types`)

## Что тестировать

### Core-модули (`packages/core/`)

- **Stores**: переходы состояний, actions, selectors
- **API hooks**: поведение query/mutation с замоканным API (MSW)
- **Utils**: чистая логика, валидаторы, mappers (наивысший приоритет)

### UI-хуки (`packages/ui/`)

- **React hooks**: поведение через `renderHook` с Provider-обёрткой контекста
- Чистая логика, извлечённая из хуков (если применимо)

### Web e2e (`apps/web/`)

- **E2e-сценарии**: критические user flows в браузере через Playwright

## Размещение тестов

Unit-тесты — в директории `__tests__/` на одном уровне с тестируемым модулем:

```
utils/
  validateSession.ts
  __tests__/
    validateSession.test.ts
hooks/
  useThemeSwitcher.ts
  __tests__/
    useThemeSwitcher.test.ts
```

E2e-тесты — в `apps/web/e2e/` с суффиксом `.spec.ts`.

## Именование

- **`describe` / `test.describe`** — английский идентификатор: имя функции, хука или области фичи
- **`it` / `test`** — русское описание поведения
- **Имена файлов тестов** — английский: `{symbol}.test.ts` / `{symbol}.test.tsx`

```typescript
describe("useThemedNativeStyles", () => {
  it('возвращает themes.light при theme="light"', () => {
    // ...
  });
});
```

## Правила

- Тестируй поведение, а не реализацию
- Одна концепция утверждения на тест
- Мокай внешние зависимости, а не внутренние модули
- Component tests (`render(<Component />)`) не входят в текущий scope
- После написания тестов запускай `pnpm test`; для e2e — `pnpm test:e2e`
