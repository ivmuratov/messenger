## 1. Syncpack и root (инфра)

- [x] 1.1 Добавить группу `Storybook` в `syncpack.config.ts` (`storybook`, `@storybook/react-vite`, `@storybook/react`, `@storybook/addon-docs`, `@storybook/builder-vite`) — verify: `pnpm syncpack:list` без mismatch после установки deps
- [x] 1.2 Добавить в root `package.json` scripts `storybook` и `build-storybook` — verify: команды резолвятся через `pnpm storybook --help` / filter ui-storybook

## 2. apps/ui-storybook (scaffold и конфиг)

- [x] 2.1 Создать `apps/ui-storybook/package.json` (`name: ui-storybook`, deps `@ui` workspace, react 19.1.0, storybook 10.6.0) — verify: `pnpm install` успешен
- [x] 2.2 Создать `.storybook/main.ts`: framework `@storybook/react-vite`, stories glob `../../../packages/ui/src/**/*.stories.tsx`, addon `@storybook/addon-docs`, `viteFinal` с `vanillaExtractPlugin` и alias `@/` → `packages/ui/src` — verify: конфиг без TS-ошибок
- [x] 2.3 Создать `.storybook/preview.tsx`: import глобальных стилей ThemeProvider, decorator с `<ThemeProvider defaultTheme="light">` — verify: preview компилируется
- [x] 2.4 Создать `apps/ui-storybook/tsconfig.json` (только `.storybook/`, jsx react-jsx, без `paths`) + scripts `dev`/`build`/`typecheck`/`lint` — verify: `pnpm --filter ui-storybook typecheck` проходит
- [x] 2.5 Добавить `apps/ui-storybook` в biome lint scope (или локальный biome config) — verify: `pnpm --filter ui-storybook lint` проходит

## 3. @ui — tsconfig, devDep и stories

- [x] 3.1 Добавить `@storybook/react@10.6.0` в devDependencies `@ui` — verify: `pnpm syncpack:list` без mismatch с ui-storybook
- [x] 3.2 Создать `packages/ui/tsconfig.stories.json` (include `*.stories.tsx`, noEmit) + exclude stories в основном tsconfig + project reference — verify: IDE/types работают в `*.stories.tsx`
- [x] 3.3 Обновить script typecheck в `@ui`: `tsc -b && tsc -p tsconfig.stories.json --noEmit` — verify: `pnpm --filter @ui typecheck` проходит после stories
- [x] 3.4 Создать `Typography.stories.tsx` (title `Atoms/Typography`, tag autodocs, Default + варианты размеров) — verify: smoke — story рендерится с VE-стилями в `pnpm storybook`
- [x] 3.5 `ThemeProvider` без отдельной story — только global decorator в `preview.tsx` — verify: ThemeSwitcher и Typography рендерятся с темой
- [x] 3.6 Создать `ThemeSwitcher.stories.tsx` (title `Atoms/ThemeSwitcher`, Default) — verify: иконка Moon/Sun отображается
- [x] 3.7 Создать `Flex.stories.tsx` (title `Layouts/Flex`, Default column + Row variant) — verify: sprinkles/spacing применяются
- [x] 3.8 Создать `Page.stories.tsx` (title `Layouts/Page`, Default с Header + Body) — verify: compound API работает
- [x] 3.9 Создать `DrawerLayout.stories.tsx` (title `Layouts/DrawerLayout`, Open + Closed с Aside/Main) — verify: `aria-hidden` и collapsed-стили различаются

## 4. Документация

- [x] 4.1 Обновить `README.md`: команды `pnpm storybook`, `pnpm build-storybook`, упоминание `apps/ui-storybook` — verify: таблица команд актуальна
- [x] 4.2 Обновить `.cursor/README.md`: слой ui-storybook в описании монорепо — verify: apps/ui-storybook упомянут
- [x] 4.3 Обновить `.cursor/rules/architecture.mdc`: `apps/ui-storybook` в обзоре, границах apps, зависимостях (`@ui` → ui-storybook) — verify: правило импортов apps не нарушено
- [x] 4.4 Обновить `.cursor/rules/testing.mdc`: секция Storybook (визуальный каталог) vs Vitest (hooks/utils), размещение `*.stories.tsx`, `tsconfig.stories.json` — verify: нет противоречия с component tests scope
- [x] 4.5 Обновить `.cursor/agents/researcher.md` и `.cursor/agents/reviewer.md`: ui-storybook в контексте проекта — verify: агенты знают про каталог
- [x] 4.6 Обновить `openspec/config.yaml`: layout (`apps/ui-storybook`), verification commands (`pnpm storybook`, `pnpm build-storybook`) — verify: config отражает новый слой

## 5. Финальная верификация

- [x] 5.1 `pnpm storybook` — verify: sidebar содержит Atoms/*, Layouts/* (5 компонентов; ThemeProvider — только decorator)
- [x] 5.2 `pnpm build-storybook` — verify: static build в `apps/ui-storybook/dist` успешен
- [x] 5.3 `pnpm lint && pnpm typecheck && pnpm test && pnpm syncpack:list` — verify: без регрессий
