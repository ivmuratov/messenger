# Конфигурация Cursor

Правила, агенты, команды и скиллы для AI-ассистента в этом монорепозитории.

## Содержимое

### `rules/` (`.mdc`)

Правила, которым должен следовать ассистент:

- **architecture.mdc** — границы пакетов, зависимости слоёв, структура модулей, иерархия компонентов
- **code-style.mdc** — стиль функций, экспорты, обработчики событий
- **naming-conventions.mdc** — имена файлов, `constants.ts` / `types.ts`, каталоги `utils/` и `hooks/`
- **styling-rules.mdc** — стилизация в `packages/ui` (Vanilla Extract для web, StyleSheet для mobile)

### `skills/`

On-demand скиллы (подключаются по задаче):

- **testing** — стек, размещение, scope и именование тестов (vitest, playwright, `__tests__/`)
- **review-quality** — read-only review diff: perf, React render, a11y, light security (после apply)
- **prepare-pr** — ветка от main, Conventional Commits, push, PR через GitHub MCP (git ops только явно)
- **openspec-*** — workflow OpenSpec (propose, apply, archive и др.)

### `agents/`

Промпты специализированных субагентов:

- **researcher** — исследование кодовой базы, поиск паттернов и связей
- **quality-reviewer** — read-only review diff на perf, render, a11y и базовую security; **не** architecture/imports/naming (это зона rules + Biome)

**Review skills:** `review-quality` (локальный subagent `quality-reviewer`) vs встроенный `security-review` — для auth/crypto и глубокого security audit используй `/review-security`; quality-reviewer дополняет, не заменяет.

### `commands/` (OpenSpec)

Slash-команды (`/opsx-*`) — на английском. См. `commands/` и `skills/openspec-*/`.

## Локальные настройки

Файл `mcp.json` и прочее локальное состояние IDE (history, tmp) не попадают в git — настраивай MCP и прочее под себя.

## Использование

- **Cursor** подхватывает `rules/*.mdc` автоматически; агентов, команд и скиллов можно подключать через `@.cursor/...`
- **Люди** — читайте этот каталог как документацию по архитектуре, стилю и workflow проекта
