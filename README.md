# Messenger Monorepo

Монорепозиторий для мессенджера на базе pnpm + Turborepo.

## Структура

```
.
├── apps/
│   ├── web/              # Vite + React 19 + TanStack Router
│   └── mobile/           # Expo + React Native
├── packages/
│   ├── core/             # Бизнес-логика (store, hooks, api)
│   └── ui/               # UI kit (Atomic Design)
```

## Технологии

- **pnpm** + **Turborepo** — монорепозиторий
- **TypeScript** — везде
- **Vite 7** + **React 19** + **TanStack Router** — web
- **Expo** + **React Native** — mobile
- **@tanstack/react-query** — серверное состояние
- **zustand** — клиентское состояние
- **ESLint 9** (flat config) — линтинг
- **Prettier** — форматирование

## Установка

```bash
pnpm install
```

## Команды

### Разработка

```bash
pnpm dev              # Все приложения параллельно
```

### Сборка

```bash
pnpm build            # Сборка всех пакетов
```

### Линтинг

```bash
pnpm lint             # ESLint для всех пакетов
pnpm typecheck        # TypeScript проверка
```

### Форматирование

```bash
pnpm format           # Prettier + Stylelint (fix)
pnpm format:check     # Проверка без изменений
```

### Синхронизация версий

```bash
pnpm syncpack:list    # Показать рассинхронизированные версии
pnpm syncpack:fix     # Исправить версии
```

### Очистка

```bash
pnpm clean            # Удалить build артефакты
```

## Структура пакетов

### core

Бизнес-логика, переиспользуемая между web и mobile.

```
packages/core/src/
├── index.ts          # Public API
├── modules/          # Доменные модули (auth, posts, chat...)
│   └── {module}/
│       ├── api/      # TanStack Query
│       ├── hooks/    # React hooks
│       ├── model/    # Zustand stores
│       └── lib/      # Helpers
└── shared/           # Общая инфраструктура
```

### ui

UI-библиотека по Atomic Design с поддержкой платформо-специфичных реализаций для web и mobile.

#### Структура

```
packages/ui/src/
├── index.ts              # Public API для web
├── index.native.ts       # Public API для mobile
│
├── atoms/                # Базовые элементы (Button, Input, Text...)
│   └── Button/
│       ├── index.ts            # Экспорт web-версии
│       ├── index.native.ts     # Экспорт mobile-версии
│       ├── tokens.ts           # Общие токены (используются web и mobile)
│       ├── types.ts            # Общие типы (базовые пропсы)
│       ├── web/                # Web-реализация
│       │   ├── Button.tsx      # React компонент
│       │   ├── Button.css.ts   # Стили (vanilla-extract)
│       │   └── index.ts
│       └── mobile/             # Mobile-реализация
│           ├── Button.tsx      # React Native компонент
│           └── index.ts
│
├── molecules/            # Комбинации атомов
├── organisms/            # Сложные блоки UI
│
├── themes/               # Система тем
│   ├── index.ts            # Экспорт web-тем
│   ├── index.native.ts     # Экспорт mobile-тем
│   ├── tokens.ts           # Общие токены тем (цвета, отступы...)
│   ├── types.ts            # Типы тем (ThemeContract)
│   ├── web/                # Web-темы (vanilla-extract)
│   │   ├── theme.css.ts    # Базовый контракт темы
│   │   ├── light.css.ts    # Светлая тема
│   │   ├── dark.css.ts     # Темная тема
│   │   └── index.ts
│   └── mobile/             # Mobile-темы (StyleSheet)
│       ├── light.ts         # Светлая тема
│       ├── dark.ts          # Темная тема
│       └── index.ts
│
├── ThemeProvider/        # Провайдер тем
│   ├── index.ts            # Экспорт web-провайдера
│   ├── index.native.ts     # Экспорт mobile-провайдера
│   ├── context.ts          # React Context (общий)
│   ├── types.ts            # Типы провайдера (общие)
│   ├── useTheme.ts         # Хук useTheme (общий)
│   ├── web/                # Web-реализация
│   │   ├── ThemeProvider.tsx
│   │   └── index.ts
│   └── mobile/             # Mobile-реализация
│       ├── ThemeProvider.tsx
│       └── index.ts
│
└── styles/               # Глобальные стили
    ├── globals.css.ts
    ├── reset.css.ts
    ├── layers.css.ts
    └── index.ts
```

#### Правила организации компонентов

1. **Платформо-специфичные реализации**: каждый компонент имеет две реализации:
   - `web/` — React + vanilla-extract (`.css.ts` файлы)
   - `mobile/` — React Native + StyleSheet

2. **Общие файлы компонента**:
   - `tokens.ts` — единый источник истинности для стилей (используется и web, и mobile)
   - `types.ts` — общие типы (базовые пропсы)

3. **Экспорты**:
   - `index.ts` → экспортирует из `web/`
   - `index.native.ts` → экспортирует из `mobile/`

#### Правила организации тем

1. **Общие файлы**: `tokens.ts` (токены) и `types.ts` (типы)
2. **Платформо-специфичные темы**:
   - `web/` — vanilla-extract (`createTheme`, `createThemeContract`)
   - `mobile/` — StyleSheet из React Native
3. **Экспорты**: `index.ts` (web) и `index.native.ts` (mobile)

#### Правила организации ThemeProvider

1. **Общие файлы**: `context.ts`, `types.ts`, `useTheme.ts`
2. **Платформо-специфичные реализации**:
   - `web/` — применяет тему через `document.body.className`
   - `mobile/` — применяет тему через `style` проп View
3. **Экспорты**: `index.ts` (web) и `index.native.ts` (mobile)

#### Запрещенные практики

❌ Нельзя:
- Импортировать из `packages/core` или `apps/*`
- Использовать бизнес-логику (Zustand, TanStack Query)
- Делать HTTP-запросы
- Смешивать web и mobile код в одном файле

✅ Можно:
- React / React Native
- Стили (vanilla-extract, StyleSheet)
- Иконки
- Внутренние уровни Atomic Design (atoms → molecules → organisms)

### web

SPA на Vite + TanStack Router.

```
apps/web/
├── index.html        # Entry point HTML
├── vite.config.ts    # Vite конфигурация
└── src/
    ├── main.tsx      # Entry point React
    ├── routes/       # TanStack Router (file-based)
    │   ├── __root.tsx    # Корневой layout
    │   ├── index.tsx     # /
    │   ├── login.tsx     # /login
    │   └── chat/
    │       ├── route.tsx     # /chat layout
    │       ├── index.tsx     # /chat
    │       └── $id.tsx       # /chat/:id
    ├── modules/      # Фичи приложения
    └── shared/       # Общие компоненты
```

## Алиасы

В проекте настроены алиасы через tsconfig paths и vite.config.ts:

```typescript
import { ThemeProvider } from "@ui";
import { useAuthStore } from "@core";
import { MyComponent } from "@/modules/auth"; // локальный алиас
```

| Алиас   | Путь                |
| ------- | ------------------- |
| `@core` | `packages/core/src` |
| `@ui`   | `packages/ui/src`   |
| `@/*`   | `./src/*`           |

## Требования

- Node.js >= 22.21.1
- pnpm >= 10.0.0
