---
description: Стек тестирования, размещение, scope и именование (блоки на английском, описания на русском)
alwaysApply: true
---

# Тестирование

## Стек

- **vitest** — test runner и assertions
- **@testing-library/react** — React hooks через `renderHook`
- **msw** — мокирование API (в `@core`)
- **@playwright/test** — e2e-тесты web-приложения (`apps/web/e2e/`)

## Что тестировать

### Core-модули (`packages/core/`)

- **Stores**: переходы состояний, actions, selectors
- **API hooks**: поведение query/mutation с замоканным API (MSW)
- **Lib-функции**: чистая логика, валидаторы, mappers (наивысший приоритет)

### UI-хуки (`packages/ui/`)

- **React hooks**: поведение через `renderHook` с Provider-обёрткой контекста
- Чистая логика, извлечённая из хуков (если применимо)

### Web e2e (`apps/web/`)

- **E2e-сценарии**: критические user flows в браузере через Playwright

## Размещение тестов

Unit-тесты — в директории `__tests__/` на одном уровне с тестируемым модулем:

```
lib/
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
