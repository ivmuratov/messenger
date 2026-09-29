# Design

## Context

См. `proposal.md`. Сейчас все компоненты в `components/` импортируют только `@/shared`. `Page.Header` на web задаёт `display: flex` в `Page.css.ts`; mobile — `View` без явного row-flex. Правила соседних импортов и запрет циклов уже в `openspec/specs/ui/architecture/spec.md`.

## Goals / Non-Goals

**Goals:**

- Одно направленное ребро `Page → Flex` на обеих платформах
- Единые дефолты шапки: row, `alignItems: center`, gap через spacing props `Flex` (например `gap` / `columnGap` из `SpacingProps`)
- Обновить stories и web demo для согласованности с mobile

**Non-Goals:**

- Менять API `Flex` или добавлять пропсы в `Page`
- Встраивать `ThemeSwitcher` или `Typography` внутрь `Page`
- Трогать `DrawerLayout`

## Decisions

### 1. Flex внутри Page.Header, не снаружи

**Решение (ui):** `Page.Header` всегда оборачивает `children` в `<Flex direction="row" alignItems="center" …>`.

**Почему:** потребители не дублируют обёртку; один раз задаём layout shell.

**Альтернатива:** оставить только CSS flex на web — mobile без симметрии и без reuse `Flex`.

**Owner:** `packages/ui`

### 2. Импорт только баррель

**Решение (ui):** `import { Flex } from "@/components/Flex/web"` (и `/mobile`).

**Owner:** `packages/ui`

### 3. Стили шапки (web)

**Решение (ui):** в `Page.css.ts` убрать `display: flex` у header, если flex полностью на `Flex`; sticky, z-index, border, background оставить на оболочке header (`<header className={pageHeaderStyles}>` + внутренний `Flex`).

**Owner:** `packages/ui` web

### 4. Демо web

**Решение (web):** в `index.tsx` импорт `Typography` из `@ui`, заменить `<h1>` на `<Typography>` с тем же текстом, сохранить `Flex` в sidebar/body.

**Owner:** `apps/web`

## Risks / Trade-offs

- **[Risk] Двойной flex (CSS + Flex)** → убрать `display: flex` из VE header, если layout на компоненте.
- **[Risk] Лишний DOM-узел** → приемлемо для единообразия web/mobile; откат — вернуть CSS-only на web (вне scope).

## Migration Plan

Обычный PR: без миграции API. Chromatic может обновить снимки Page stories — ожидаемо.

## Open Questions

- Конкретный spacing token для gap в header (например `gap="8"` vs `12`) — зафиксировать при implement по визуальному сравнению со sticky header в Storybook.
