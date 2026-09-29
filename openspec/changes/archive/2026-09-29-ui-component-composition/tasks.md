## 1. ui — Page + Flex (web)

- [x] 1.1 В `Page/web/Page.tsx`: импорт `Flex` из `@/components/Flex/web`; обернуть `children` в `Page.Header` в `Flex` (row, center, gap) — verify: `pnpm --filter @ui typecheck`
- [x] 1.2 В `Page/web/Page.css.ts`: убрать дублирующий flex-layout шапки, сохранить sticky/токены — verify: визуально web story `Components/Page`
- [x] 1.3 Обновить `Page/web/Page.stories.tsx`: минимум два элемента в `Page.Header` — verify: `pnpm storybook`, sidebar `Components/Page`

## 2. ui — Page + Flex (mobile)

- [x] 2.1 В `Page/mobile/Page.tsx`: импорт `Flex` из `@/components/Flex/mobile`; та же раскладка header — verify: `pnpm --filter @ui typecheck`
- [x] 2.2 Обновить `Page/mobile/Page.stories.tsx`: два+ элемента в header — verify: `pnpm --filter ui-storybook dev:mobile` (smoke)

## 3. ui — граф импортов

- [x] 3.1 Grep: `Flex` не импортирует `Page`; `Page` импортирует только баррель `Flex` — verify: ручной grep в `packages/ui/src/components`

## 4. web — паритет демо

- [x] 4.1 В `apps/web/src/app/routes/index.tsx`: `Typography` вместо `<h1>`, импорт из `@ui` — verify: `pnpm --filter web typecheck`, smoke home route

## 5. Проверка

- [x] 5.1 `pnpm --filter @ui lint && pnpm --filter @ui typecheck && pnpm --filter @ui test` — verify: успех
- [x] 5.2 `pnpm --filter web lint && pnpm --filter web typecheck` — verify: успех
