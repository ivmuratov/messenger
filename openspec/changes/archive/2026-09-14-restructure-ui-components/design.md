## Context

См. `proposal.md` — Why. Требования: `specs/ui/architecture/spec.md`, delta `tooling/storybook` и `tooling/testing`.

Сейчас в `@ui`:

- `src/atoms/` — ThemeSwitcher, Typography
- `src/layouts/` — DrawerLayout, Flex, Page
- `src/ThemeProvider/` — уже особняком
- `src/shared/` — токены, sprinkles, хуки, контексты, утилиты
- `molecules/` нет
- Кросс-импортов между компонентами нет: все тянут `@/shared/*`
- Публичный API — баррели `src/index.ts` / `src/index.native.ts`; web/mobile/storybook импортируют `from "@ui"`
- Правила слоёв живут в `.cursor/rules/architecture.mdc` и `openspec/config.yaml`, тулом не проверяются
- Stories colocated, glob уже `packages/ui/src/**/*.stories.tsx`; titles — `Atoms/*` и `Layouts/*`

Стили `.css.ts` (web) и `.styles.ts` (mobile) переезжают вместе с папками компонента, содержимое не меняется.

## Goals / Non-Goals

**Goals:**

- Одна механическая миграция папок + баррелей + titles + живых архитектурных артефактов
- Зафиксировать граф `ThemeProvider` → `components` → `shared` в правилах, чтобы ассистенты и люди не возвращали Atomic Design

**Non-Goals:**

- Новые импорты между компонентами в этом change (разрешение — в правилах, проводка — позже)
- Правки `.css.ts` / `.styles.ts` и поведения UI
- Конфиг Storybook app (glob уже покрывает новый путь)

## Decisions

### 1. Целевое дерево

**Решение (ui):** `git mv` в плоский `src/components/{Component}/`, внутренности компонента не трогать.

```
packages/ui/src/
  ThemeProvider/
  components/
    DrawerLayout/
    Flex/
    Page/
    ThemeSwitcher/
    Typography/
  shared/
  index.ts
  index.native.ts
```

**Почему:** слой `components/` отделяет UI от `shared/` и от оболочки, без атомов/молекул.

**Альтернатива:** всё сразу в `src/{Component}/` рядом с `shared/` — смешивает кит и инфраструктуру.

**Owner:** `ui`

### 2. ThemeProvider вне components

**Решение (ui):** оставить `src/ThemeProvider/`. Это «местный app»: может импортировать `components` и `shared`; обратно нельзя.

**Почему:** потребители оборачивают им корень; в Storybook он decorator, не каталог. Папка `providers/` рано при одном модуле.

**Альтернатива:** положить в `components/` — визуально сосед ThemeSwitcher, но ломает метафору оболочки.

**Owner:** `ui`

### 3. Без shared-components

**Решение (ui):** внутренние кирпичи, когда появятся, класть в `components/` и не экспортировать из барреля. Третью полку не заводить.

**Почему:** иначе Atomic Design вернётся под другим именем.

**Owner:** `ui`

### 4. Форма соседнего импорта

**Решение (ui):** `@/components/{Name}/web` и `@/components/{Name}/mobile` — баррель платформы, не `.css.ts` / `.styles.ts` / context. Внутри пакета не `from "@ui"` и не `src/index.ts`. В этом change новых соседних импортов нет.

**Почему:** баррель пакета даёт цикл; смешение web/mobile ломает native entry.

**Owner:** `ui`

### 5. Title stories `Components/{Component}`

**Решение (ui):** `Atoms/Typography` → `Components/Typography`, `Layouts/DrawerLayout` → `Components/DrawerLayout`. `ThemeProvider` без catalog story.

**Почему:** один бакет в sidebar совпадает с папкой. Web-only (stories); mobile stories нет.

**Owner:** `ui`

### 6. Документы архитектуры, не архивы

**Решение (root):** обновить `.cursor/rules/architecture.mdc`, `.cursor/agents/researcher.md`, `README.md`, `openspec/config.yaml`. Архивные `openspec/changes/archive/**` не трогать.

**Почему:** живой контракт для людей и агентов; архив — история.

**Owner:** `root` (правила, README, OpenSpec context); main-спеки storybook/testing — через archive этого change

### 7. Циклы — конвенция

**Решение (ui):** без madge/dependency-cruiser. Biome циклы не ловит.

**Почему:** каталог из пяти компонентов; тул — отдельный change, когда граф вырастет.

**Owner:** `ui`

## Risks / Trade-offs

- [Забытый путь `atoms/` / `layouts/` в доках или спеках] → grep по репо (кроме archive) в tasks
- [Циклы появятся незаметно] → правило в architecture.mdc; тул отложен
- [ThemeProvider начнёт тянуть тяжёлые компоненты] → разрешено спекой, не делать в этом change
- [Windows `git mv` для регистра/пути] → проверять, что `atoms/` и `layouts/` исчезли

## Migration Plan

1. Создать `src/components/`, перенести пять папок, поправить баррели.
2. Сменить titles stories (web).
3. Обновить архитектурные артефакты.
4. Verify: `pnpm --filter @ui lint && pnpm --filter @ui typecheck && pnpm --filter @ui test`; smoke `pnpm storybook` (sidebar `Components/*`).
5. Rollback: revert коммита; публичный API не менялся.

Web (`.css.ts`) и mobile (`.styles.ts`) переезжают одинаково, без правок содержимого.
