## 1. Unit-тесты shared/utils (@ui)

- [x] 1.1 Создать `packages/ui/src/shared/utils/__tests__/nativeVariants.test.ts`: сценарии без mapData и с mapData — verify: `pnpm --filter @ui test` проходит
- [x] 1.2 Создать `packages/ui/src/shared/utils/__tests__/nativeSprinkles.test.ts`: прямой проп, shorthand, неизвестный scale — verify: `pnpm --filter @ui test` проходит
- [x] 1.3 Создать `packages/ui/src/shared/utils/__tests__/nativeRecipe.test.ts`: base + variants, пропуск falsy variant — verify: `pnpm --filter @ui test` проходит

## 2. Unit-тест useThemedNativeStyles (@ui)

- [x] 2.1 Создать `packages/ui/src/shared/hooks/__tests__/useThemedNativeStyles.test.tsx`: `theme="light"` и `theme="dark"` возвращают `themes.light` / `themes.dark` — verify: `pnpm --filter @ui test` проходит
- [x] 2.2 Добавить тест на throw при falsy theme в Provider (proxy для невалидного контекста) — verify: `pnpm --filter @ui test` проходит

## 3. Web e2e (@ui интеграция через apps/web)

- [x] 3.1 Создать `apps/web/e2e/home.spec.ts`: drawer open/close через `aria-hidden` на `aside` — verify: `pnpm test:e2e` проходит
- [x] 3.2 Добавить в `home.spec.ts` сценарий переключения темы через `data-theme` на `document.documentElement` — verify: `pnpm test:e2e` проходит

## 4. Финальная верификация

- [x] 4.1 Запустить `pnpm test` из корня — verify: `@ui` tests green, `@core` и `web` unit без регрессий (0 или существующие тесты)
- [x] 4.2 Запустить `pnpm lint && pnpm typecheck` — verify: без ошибок
