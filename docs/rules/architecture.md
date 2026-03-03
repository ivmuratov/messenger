---
description: Архитектура, границы пакетов, границы стилизации, иерархия компонентов, импорты, структура модулей
alwaysApply: true
---

# Архитектура

## Обзор

- `packages/ui` — Переиспользуемые UI-компоненты (Atomic Design), кросс-платформенные
- `packages/core` — Общая бизнес-логика, состояние, API
- `apps/web` — Веб-приложение (Vite + TanStack Router)
- `apps/mobile` — Мобильное приложение (Expo + React Native)

## Зависимости пакетов

```
ui, core → web, mobile
```

- Приложения потребляют пакеты; пакеты никогда не импортируют из приложений
- Нет импортов между `apps/web` и `apps/mobile`
- Нет импортов между `packages/core` и `packages/ui`
- Потребляй пакеты через публичный API: `import { Button } from "ui"`

## packages/ui

### Структура

```
{Component}/
├── types.ts          # Общий интерфейс пропсов
├── tokens.ts         # Дизайн-токены
├── index.ts          # Web-экспорт
├── index.native.ts   # Mobile-экспорт
├── web/              # Web-реализация
└── mobile/           # Mobile-реализация
```

### Стилизация

- Vanilla Extract (`.css.ts`) и StyleSheet (`.styles.ts`) только здесь; `core`, `web`, `mobile` не стилизуют компоненты
- Другие слои потребляют готовые UI из `packages/ui`

### Иерархия UI (`src/`)

**`src/components/`** — UI-блоки (строительные кирпичи):

- `atoms/` — примитивы (Button, Text, Icon)
- `molecules/` — композиция atoms (SearchBar, FormField)

**Правила импортов components:**

- Горизонтальные импорты запрещены: `atoms/` ↔ `atoms/`, `molecules/` ↔ `molecules/`
- Разрешено: `molecules/` → `atoms/`
- Запрещено: `atoms/` → `molecules/`

**`src/layouts/`** — компоненты размещения (PageLayout, GridLayout)

**Правила импортов layouts:**

- Горизонтальные импорты запрещены: `layouts/` ↔ `layouts/`
- Layouts НЕ импортируют из `components/`
- Components НЕ импортируют из `layouts/` (полная изоляция)

### Импорты

- Используй алиас `@/` для внутренних импортов внутри пакета

## packages/core

### Структура

```
modules/{module}/
├── model/            # Zustand store + типы
├── api/              # TanStack Query + HTTP-клиент
├── hooks/            # UI-агностичные хуки
├── lib/              # Чистая бизнес-логика
└── index.ts          # Публичный API
```

### Импорты

- Используй алиас `@/` для внутренних импортов внутри пакета
- Никогда не импортируй из `packages/ui`

## apps/web, apps/mobile

### Импорты

- Используй алиас `@/` для внутренних импортов внутри приложения
- Потребляй `packages/ui` и `packages/core` через публичный API
- Никогда не импортируй между `apps/web` и `apps/mobile`
