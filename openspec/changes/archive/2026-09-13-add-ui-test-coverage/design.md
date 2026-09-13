## Context

См. `proposal.md` — Why.

Текущее состояние:

- Vitest настроен в `@ui` (jsdom, alias `@/`, pattern `src/**/__tests__/**/*.test.{ts,tsx}`)
- Playwright настроен в `apps/web` (`e2e/`, webServer через Vite, `--pass-with-no-tests`)
- Тестовых файлов нет; `@core` без модулей
- Целевой код уже существует:
  - `packages/ui/src/shared/utils/` — `nativeVariants`, `nativeSprinkles`, `nativeRecipe`
  - `packages/ui/src/shared/hooks/useThemedNativeStyles.ts` — читает `ThemeContext`, возвращает `themes[theme]`
  - `apps/web/src/routes/index.tsx` — demo-страница с `DrawerLayout`, кнопкой toggle и `ThemeSwitcher`
  - `packages/ui/src/ThemeProvider/web/ThemeProvider.tsx` — пишет `document.documentElement.dataset.theme`
  - `packages/ui/src/layouts/DrawerLayout/web/DrawerLayout.tsx` — `aria-hidden={!isOpened}` на aside

Ограничения из предыдущего change (`add-testing-tooling`): component tests запрещены; hooks — только через `renderHook`.

## Goals / Non-Goals

**Goals:**

- Первый набор unit-тестов в `@ui` для shared utils и `useThemedNativeStyles`
- Первые e2e-сценарии в `apps/web/e2e/` для drawer и темы
- Все тесты проходят через `pnpm test` и `pnpm test:e2e` из корня

**Non-Goals:**

- Unit-тесты Reanimated/gesture-handler/worklets-хуков (в т.ч. `useDrawerLayoutRootMotion`): логика в worklet-колбэках, jsdom не выполняет pipeline без тяжёлых моков; web drawer покрывается e2e, mobile — позже (extract logic / mobile e2e)
- Отдельные тесты `shared/contexts/themes.ts`
- Component tests, `@core` tests, mobile tests
- Изменение production-кода ради тестируемости (если потребуется — отдельный change)

## Decisions

### 1. Приоритет: utils → hook → e2e

**Решение:** писать тесты в порядке возрастания сложности и зависимостей.

**Почему:** utils — чистая логика, быстрая обратная связь; hook — один Provider; e2e — медленнее, но проверяет интеграцию web-слоя.

**Owner:** `@ui`, `web`

### 2. Unit-тесты utils без мока StyleSheet

**Решение:** использовать реальный `StyleSheet.create` из `react-native` в Vitest/jsdom. Проверять структуру возвращаемых объектов (ключи, значения свойств), не numeric ID StyleSheet.

**Примеры проверок:**

| Модуль | Что проверять |
|--------|---------------|
| `nativeVariants` | Ключи = ключи токена; с mapData — результат mapData |
| `defineNativeProperties` + `createNativeSprinkles` | shorthand разворачивает несколько свойств; прямой проп — одно свойство |
| `nativeRecipe` | base + выбранные variants; пропуск falsy variant |

**Альтернатива:** мок `StyleSheet.create` → `(x) => x` — проще assertions, но не проверяет интеграцию с RN API. Отклонено.

**Owner:** `@ui`

### 3. useThemedNativeStyles через renderHook + ThemeContext

**Решение:**

```tsx
// packages/ui/src/shared/hooks/__tests__/useThemedNativeStyles.test.tsx
const wrapper = ({ children, theme = "light" }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

renderHook(() => useThemedNativeStyles(), { wrapper });
```

**Сценарии:**

1. `theme="light"` → `themes.light`
2. `theme="dark"` → `themes.dark`
3. Без Provider — `expect(...).toThrow(/ThemeProvider/)`

**Примечание:** `ThemeContext` имеет default `"light"`, поэтому «без Provider» технически не падает. Тест «вне Provider» MUST использовать Provider с `null` или отдельную обёртку без value — **если** текущая реализация не бросает ошибку при default context, тест фиксирует фактическое поведение: проверять throw только когда `theme` falsy. Текущий код: `if (!theme) throw` — default `"light"` truthy, ошибка не выбросится без явного `null`. **Корректировка:** тест MUST проверять throw при `<ThemeContext.Provider value={null as unknown as Theme}>` или аналоге, либо зафиксировать в тесте, что default context не считается «вне Provider». Спека требует throw «без Provider» — на практике тестируем Provider с falsy theme как proxy для «невалидного контекста».

**Owner:** `@ui`

### 4. E2e: один spec-файл, два describe-блока

**Решение:** `apps/web/e2e/home.spec.ts` с двумя группами:

**Drawer:**

- `page.goto("/")`
- `aside = page.locator("aside")`
- Начальное: `await expect(aside).toHaveAttribute("aria-hidden", "true")`
- Click `getByRole("button", { name: "Toggle Drawer" })` → `aria-hidden="false"`
- Повторный click → `aria-hidden="true"`

**Theme:**

- Начальное: `defaultTheme="dark"` в `main.tsx` → `data-theme="dark"`
- Click `getByRole("button", { name: "Toggle theme" })` → `data-theme="light"`
- Повторный click → `data-theme="dark"`

**Почему aria-hidden / data-theme:** стабильные семантические маркеры без привязки к CSS-классам Vanilla Extract.

**Owner:** `web`

### 5. E2e не тестирует view transitions

**Решение:** Playwright кликает кнопку темы и проверяет только `data-theme`; анимация View Transition API игнорируется.

**Почему:** `ThemeSwitcher` использует `document.startViewTransition` при поддержке — поведение темы не зависит от анимации.

**Owner:** `web`

### 6. Без изменений production-кода

**Решение:** тесты пишутся под существующую разметку (`Toggle Drawer`, `aria-label="Toggle theme"`).

**Owner:** все пакеты

## Risks / Trade-offs

| Риск | Митигация |
|------|-----------|
| `StyleSheet.create` в jsdom может вести себя иначе, чем на device | Проверять content styles, не ID; при падении — локальный mock в test setup |
| `useThemedNativeStyles` throw-сценарий не совпадает с буквальным «без Provider» | Тест с falsy theme value; при необходимости — follow-up change на stricter context check |
| E2e flaky из-за CSS transitions drawer | Assert только `aria-hidden`, не transform; при необходимости `toHaveAttribute` с retry Playwright |
| Drawer mobile vs web расхождение | E2e покрывает только web CSS drawer; mobile gestures — см. Non-Goals |

## Migration Plan

1. Добавить unit-тесты в `@ui` (`shared/utils/__tests__/`, `shared/hooks/__tests__/`)
2. Добавить `apps/web/e2e/home.spec.ts`
3. Verify: `pnpm --filter @ui test`, `pnpm test:e2e`, `pnpm test`
4. Archive change → delta сливается в `openspec/specs/tooling/testing/spec.md`

**Rollback:** удалить test-файлы; infra без изменений.

## Open Questions

_(нет)_
