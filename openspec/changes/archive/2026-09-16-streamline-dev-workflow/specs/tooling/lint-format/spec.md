## MODIFIED Requirements

### Requirement: Единый инструмент линтинга и форматирования

Монорепозиторий MUST использовать один инструмент (Biome) для линтинга, форматирования и сортировки импортов. В проекте MUST NOT остаться зависимостей, конфигов или скриптов, связанных с ESLint или Prettier.

#### Scenario: Проверка кода из корня

- **WHEN** разработчик выполняет `pnpm lint` из корня монорепы
- **THEN** Biome проверяет линт и форматирование во всех пакетах
- **AND** команда завершается с ненулевым кодом при нарушениях

#### Scenario: Автоисправление

- **WHEN** разработчик выполняет `pnpm format` из корня
- **THEN** Biome автоматически исправляет форматирование, линт-нарушения с safe-fix и порядок импортов

#### Scenario: Pre-commit hook

- **WHEN** разработчик создаёт коммит
- **THEN** Husky pre-commit MUST запускать `pnpm lint` и `pnpm typecheck` параллельно через `pnpm exec concurrently --kill-others-on-fail`
- **AND** pre-commit MUST NOT вызывать ESLint или Prettier
- **AND** pre-commit MUST NOT вызывать `pnpm build` или `pnpm syncpack:list`
