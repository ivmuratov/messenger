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

UI-библиотека по Atomic Design.

```
packages/ui/src/
├── index.ts          # Public API
├── atoms/            # Базовые элементы (Button, Input...)
├── molecules/        # Комбинации атомов
├── organisms/        # Сложные блоки UI
└── theme/            # ThemeProvider, токены
```

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
