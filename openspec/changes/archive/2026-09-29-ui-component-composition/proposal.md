# Proposal

## Why

После переезда в плоский `components/` правила разрешают соседние импорты, но в коде их нет: `Page.Header` дублирует flex-layout в CSS, а демо web использует сырые `<h1>` вместо `Typography`, хотя mobile уже собирает экран через `@ui`. Нужна первая безопасная «проводка» композиции без циклов и без новых подпапок.

## What Changes

- `Page.Header` (web и mobile) оборачивает `children` в `Flex` с согласованным row-layout (выравнивание, gap через spacing props `Flex`)
- Импорт `Flex` только через платформенный баррель (`@/components/Flex/web` | `.../mobile`); `Flex` не импортирует `Page`
- Story `Page` (web и mobile): в шапке несколько детей, чтобы зафиксировать compound + flex-поведение
- `apps/web/src/app/routes/index.tsx`: заменить `<h1>` на `Typography` в тех же местах, где mobile использует `Typography` (паритет демо shell)
- Публичный API `@ui`, пропсы `Page` и внешняя композиция `DrawerLayout → Page → …` не меняются

## Capabilities

### New Capabilities

- `ui/page`: поведение и внутренняя композиция `Page` (шапка через `Flex`, правила импорта соседа)

### Modified Capabilities

- `tooling/storybook`: сценарий compound `Page` с несколькими детьми в `Page.Header`

## Impact

- **packages/ui/src/components/Page/web/Page.tsx** — импорт `Flex`, разметка `Page.Header`
- **packages/ui/src/components/Page/mobile/Page.tsx** — то же для mobile
- **packages/ui/src/components/Page/web/Page.css.ts** — убрать дублирующий `display: flex` из шапки, если layout полностью на `Flex` (остальные токены шапки сохранить)
- **packages/ui/src/components/Page/web/Page.stories.tsx**, **.../mobile/Page.stories.tsx** — пример с двумя+ элементами в header
- **apps/web/src/app/routes/index.tsx** — `Typography` вместо `<h1>`
- **packages/ui** — новое ребро графа `Page → Flex`; без изменений `index.ts` / `index.native.ts`

## Non-goals

- Папка `primitives/` или `layouts/` внутри `components/`
- `DrawerLayout → Page`, `Page → ThemeSwitcher`, `DrawerLayout → Flex` внутри `@ui`
- Изменение `Typography`, `Flex`, `DrawerLayout`, `ThemeSwitcher` кроме косвенного потребления
- ESLint dependency-cruiser / madge для циклов
- Новые unit/e2e-тесты, если не потребуются для регрессии (достаточно lint, typecheck, Storybook smoke)
