# Messenger Monorepo

Монорепозиторий мессенджера: pnpm + Turborepo, web (Vite + TanStack Router) и mobile (Expo + React Native). Общие пакеты: `core` (бизнес-логика, состояние, API) и `ui` (Atomic Design компоненты).

## Быстрый старт

```bash
pnpm install
```

Создайте `.env` по примеру `.env.example`.

## Команды

| Команда                                    | Описание                                              |
| ------------------------------------------ | ----------------------------------------------------- |
| `pnpm dev`                                 | Запуск разработки                                     |
| `pnpm build`                               | Сборка                                                |
| `pnpm lint`                                | Проверка lint и форматирования (Biome)                |
| `pnpm format`                              | Автоисправление форматирования, lint и импортов       |
| `pnpm typecheck`                           | Проверка типов                                        |
| `pnpm test`                                | Unit-тесты (Vitest)                                   |
| `pnpm test:e2e`                            | E2e-тесты web (Playwright)                            |
| `pnpm syncpack:list` / `pnpm syncpack:fix` | Синхронизация версий пакетов                          |
| `pnpm clean`                               | Очистка dist                                          |

## Требования

- Node.js >= 22.21.1
- pnpm >= 10.0.0

## Документация

Архитектура, правила кода, скиллы и агенты — в `docs/`. См. [docs/README.md](docs/README.md).
