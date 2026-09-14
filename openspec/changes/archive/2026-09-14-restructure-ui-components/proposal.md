## Why

Atomic Design в `@ui` уже не описывает код: `molecules/` нет, layouts изолированы от atoms и мешают композиции, а `ThemeProvider` живёт вне слоёв. Пока каталог маленький (5 визуальных компонентов), дешевле сменить организацию на обычный компонентный подход, чем тащить фиктивную иерархию дальше.

## What Changes

- Папки `src/atoms/` и `src/layouts/` схлопываются в плоский `src/components/` (DrawerLayout, Flex, Page, ThemeSwitcher, Typography)
- `src/ThemeProvider/` остаётся особняком — оболочка приложения внутри пакета
- `src/shared/` не переезжает; внутренние соседние импорты в `shared/` и `components/` разрешены, циклы запрещены
- Граф зависимостей: `ThemeProvider` → `components` → `shared` (только вниз)
- Публичный API `@ui` не меняется: приложения по-прежнему импортируют `from "@ui"`
- Обновляются все живые артефакты проекта, которые описывают архитектуру `@ui` (правила, OpenSpec context, README, агент researcher, delta main-спеков Storybook и testing)

## Capabilities

### New Capabilities

- `ui/architecture`: структура пакета `@ui` (ThemeProvider / components / shared) и правила импортов между слоями и соседями

### Modified Capabilities

- `tooling/storybook`: пути stories и title без Atomic Design (`Atoms/*`, `Layouts/*` → `Components/{Component}`)
- `tooling/testing`: примеры путей unit-тестов `@ui` после переезда `ThemeSwitcher`

## Impact

- **packages/ui/src/** — переезд `atoms/*` и `layouts/*` в `components/`; `index.ts`, `index.native.ts`; titles в `*.stories.tsx`
- **packages/ui/src/ThemeProvider/** — без переезда; правило: может импортировать `components` и `shared`
- **apps/web, apps/mobile, apps/ui-storybook** — без смены публичных импортов; glob stories уже `**/*.stories.tsx`
- **.cursor/rules/architecture.mdc** — иерархия и импорты `@ui`
- **.cursor/agents/researcher.md**, **README.md**, **openspec/config.yaml** — формулировки Atomic Design
- **openspec/specs/tooling/storybook/spec.md**, **openspec/specs/tooling/testing/spec.md** — пути и titles (через delta)

## Non-goals

- Менять публичный API `@ui` или поведение компонентов
- Собирать компоненты друг из друга (Page из Flex и т.п.) — только организация и правила
- Переносить `ThemeProvider` в `components/` или менять раскладку внутри `shared/`
- Добавлять детектор циклов (madge / dependency-cruiser) — конвенция, без нового тулинга
- Править архивные OpenSpec-changes
