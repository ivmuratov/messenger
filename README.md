# Messenger Monorepo

Монорепозиторий мессенджера: pnpm + Turborepo, `web` (Vite + TanStack Router), `mobile` (Expo + React Native) и `ui-storybook` (визуальный каталог `@ui`). Общие пакеты: `core` (бизнес-логика, состояние, API) и `ui` (кросс-платформенные UI-компоненты).

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
| `pnpm storybook`                           | Storybook-каталог web-компонентов `@ui`               |
| `pnpm build-storybook`                     | Статическая сборка Storybook в `apps/ui-storybook/dist` |
| `pnpm chromatic`                           | Visual regression по Storybook stories (`apps/ui-storybook`) |
| `pnpm syncpack:list` / `pnpm syncpack:fix` | Синхронизация версий пакетов                          |
| `pnpm clean`                               | Очистка dist                                          |

## Требования

- Node.js >= 22.21.1
- pnpm >= 10.0.0

## Документация

Архитектура, правила кода, агенты и workflow — в [`.cursor/`](.cursor/README.md).

Storybook и Chromatic — в [`apps/ui-storybook/README.md`](apps/ui-storybook/README.md).
