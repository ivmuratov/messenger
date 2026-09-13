## Why

Инфраструктура тестирования уже настроена (Vitest, Playwright), но тестовых файлов нет — `pnpm test` и `pnpm test:e2e` проходят с нулевым покрытием. После добавления native-стилей, темы и DrawerLayout нужны первые реальные тесты, чтобы зафиксировать поведение shared-утилит, theme-хука и критических web-сценариев до дальнейшего развития UI.

## What Changes

- Unit-тесты в `@ui` для `shared/utils/` (`nativeVariants`, `defineNativeProperties` + `createNativeSprinkles`, `nativeRecipe`)
- Unit-тест для `useThemedNativeStyles` через `renderHook` и `ThemeContext`
- Web e2e-сценарии в `apps/web/e2e/`: переключение drawer и смена темы на главной странице
- Обновление delta-спека `tooling/testing`: требования к наличию тестов и покрываемым модулям

## Capabilities

### New Capabilities

_(нет)_

### Modified Capabilities

- `tooling/testing`: добавить требования к первому набору unit-тестов в `@ui` и e2e-сценариев в `apps/web`

## Impact

- **packages/ui/src/shared/utils/** — новые `__tests__/*.test.ts` (3 файла)
- **packages/ui/src/shared/hooks/useThemedNativeStyles.ts** — `__tests__/useThemedNativeStyles.test.tsx`
- **apps/web/e2e/** — новые `*.spec.ts` (drawer + theme)
- **openspec/specs/tooling/testing/spec.md** — delta через change (после archive)

## Non-goals

- Unit-тесты `useDrawerLayoutRootMotion` (Reanimated, gesture-handler, worklets — вне scope до выделения чистой логики или mobile e2e)
- Отдельные тесты `shared/contexts/themes.ts` (два `createContext` — покрываются через `useThemedNativeStyles`)
- Component tests (`render(<Component />)`)
- Тесты `@core` (модулей пока нет)
- Mobile unit/e2e
- Добавление `pnpm test` в pre-commit и CI
