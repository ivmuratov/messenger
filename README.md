# Messenger Monorepo

Монорепозиторий для мессенджера на базе pnpm + Turborepo.

## Структура

```
.
├── apps/
│   ├── web/              # Приложение для веба
│   └── mobile/           # Приложение для мобилки
├── packages/
│   ├── core/             # Общая бизнес-логика
│   └── ui/               # UI kit
```

## Зависимости между слоями

```mermaid
flowchart BT
  subgraph packages["packages"]
    ui["ui"]
    core["core"]
  end

  subgraph apps["apps"]
    web["web"]
    mobile["mobile"]
  end

  web --> ui
  web --> core
  mobile --> ui
  mobile --> core
```

## Технологии

- **pnpm** + **Turborepo** + **TypeScript** — монорепозиторий
- **Vite** + **React** + **TanStack Router** — web
- **Expo** + **React Native** — mobile
- **@tanstack/react-query** + **zustand** — core
- **tsdown** + **React** + **React Native** + **@vanilla-extract/css** — ui 
- **ESLint** + **Prettier** — линтинг, форматирование

## Установка пакетов

```bash
pnpm install              
```
Создать в корне проекта файл `.env` и заполнить его по примеру `.env.example`

## Команды

### Разработка

```bash
pnpm run dev              
```

### Сборка dist артефактов

```bash
pnpm run build           
```

### Линтинг и проверка типов

```bash
pnpm run lint             
pnpm run typecheck        
```

### Форматирование

```bash
pnpm run format           
pnpm run format:check     
```

### Синхронизация версий

```bash
pnpm syncpack:list        # Показать рассинхронизированные версии пакетов
pnpm syncpack:fix         # Синхронизировать версии пакетов
```

### Очистка dist артефактов

```bash
pnpm clean                
```

## Структура пакетов

### core

#### Назначение

Общая бизнес-логика, состояние и API-слой, переиспользуемый для web и mobile.

#### Структура

```
packages/core/
└── src/
    ├── modules/               # Модули (auth, posts, chat, user и т.д.)
    │   └── {module}/
    │       ├── model/         # Zustand stores + локальные типы
    │       │   ├── store.ts
    │       │   └── types.ts
    │       ├── api/           # TanStack Query + HTTP-клиент
    │       │   ├── {module}Api.ts
    │       │   └── {module}Queries.ts
    │       ├── hooks/         # UI-агностичные hooks
    │       │   ├── useLogin.ts
    │       │   ├── useLogout.ts
    │       │   └── useAuthUser.ts
    │       ├── lib/           # Чистая бизнес-логика, helpers
    │       │    ├── {module}Mapper.ts
    │       │    └── {module}Validators.ts
    │       └──  index.ts      # Public API {module}
    │
    ├── shared/                # Общая инфраструктура для всех модулей
    │   ├── api/
    │   │   ├── httpClient.ts  # axios/fetch-обёртка
    │   │   └── endpoints.ts
    │   ├── store/
    │   │   ├── appStore.ts
    │   │   └── middlewares.ts
    │   ├── config/
    │   │   └── env.ts
    │   └── lib/
    │       └── date.ts
    │          
    └── index.ts               # Public API core
```

### ui

#### Назначение

UI-библиотека (по Atomic Design) с поддержкой платформо-специфичных реализаций для web и mobile.

#### Структура

```
packages/ui/src/
├── index.ts                    # Public API для web
├── index.native.ts             # Public API для mobile
│
├── atoms/                      # Базовые элементы (Button, Input, Text...)
│   └── {Atom}/
│       ├── index.ts            # Экспорт web-версии
│       ├── index.native.ts     # Экспорт mobile-версии
│       ├── tokens.ts           # Общие токены (используются web и mobile)
│       ├── types.ts            # Общие типы (базовые пропсы)
│       ├── web/                # Web-реализация
│       │   ├── {Atom}.tsx      # React компонент
│       │   ├── {Atom}.css.ts   # Стили (vanilla-extract)
│       │   └── index.ts
│       └── mobile/             # Mobile-реализация
│           ├── {Atom}.tsx      # React Native компонент
│           └── index.ts
│
├── molecules/                  # Комбинации атомов
├── organisms/                  # Сложные блоки UI
│
├── themes/                     # Система тем
│   ├── index.ts                # Экспорт web-тем
│   ├── index.native.ts         # Экспорт mobile-тем
│   ├── tokens.ts               # Общие токены тем (цвета, отступы...)
│   ├── types.ts                # Типы тем (ThemeContract)
│   ├── web/                    # Web-темы (vanilla-extract)
│   │   ├── theme.css.ts        # Базовый контракт темы
│   │   ├── light.css.ts        # Светлая тема
│   │   ├── dark.css.ts         # Темная тема
│   │   └── index.ts
│   └── mobile/                 # Mobile-темы (StyleSheet)
│       ├── light.ts            # Светлая тема
│       ├── dark.ts             # Темная тема
│       └── index.ts
│
├── ThemeProvider/              # Провайдер тем
└── styles/                     # Глобальные стили
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

### web

#### Назначение

SPA на Vite + TanStack Router

#### Структура

```
apps/web/
├── index.html                  # Entry point HTML
├── vite.config.ts              # Vite конфигурация
└── src/
    ├── main.tsx                # Entry point React
    ├── routes/                 # TanStack Router (file-based)
    │   ├── __root.tsx          # Корневой layout
    │   ├── index.tsx           # /
    │   ├── login.tsx           # /login
    │   └── chat/
    │       ├── route.tsx       # /chat layout
    │       ├── index.tsx       # /chat
    │       └── $id.tsx         # /chat/:id
    ├── modules/                # Фичи приложения
    └── shared/                 # Общие компоненты
```
### mobile

#### Назначение

Нативное приложение на Expo

#### Структура

```
apps/mobile/
├── index.ts                    # Entry point (registerRootComponent)
├── app.json                    # Expo конфигурация
└── src/
    ├── App.tsx                 # Корневой компонент
    ├── screens/                # Expo Router / stack / screens
    │   ├── LoginScreen.tsx
    │   ├── HomeScreen.tsx
    │   └── ChatScreen.tsx
    │
    ├── modules/
    │   ├── auth/
    │   │   ├── ui/             # RN-компоненты, использующие core + ui
    │   │   ├── model/
    │   │   ├── lib/
    │   │   └── index.ts
    │   ├── chat/
    │   └── ...
    │
    └── shared/
        ├── ui/                 # mobile-специфичные общие компоненты
        ├── hooks/
        └── lib/
```

## Требования

- Node.js >= 22.21.1
- pnpm >= 10.0.0
