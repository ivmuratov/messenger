# lint-format Specification

## Purpose

Единый инструмент проверки стиля и качества кода для всего монорепозитория, заменяющий раздельные линтер и форматтер.

## Requirements

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
- **THEN** Husky pre-commit запускает `pnpm lint` (Biome) без отдельной проверки форматирования
- **AND** pre-commit MUST NOT вызывать ESLint или Prettier

### Requirement: Сохранение ключевых правил качества кода

Biome MUST обеспечивать эквивалентную защиту для правил, ранее enforced ESLint:

- неиспользуемые переменные (с игнором `_` prefix)
- type-only imports (`useImportType`)
- React hooks rules (`useHookAtTopLevel`, `useExhaustiveDependencies`)
- no duplicate imports
- organize imports

Type-aware правила для promises (`noFloatingPromises`, `noMisusedPromises`) MUST быть включены на уровне error.

#### Scenario: Floating promise обнаружен

- **WHEN** в коде есть необработанный Promise без await/void/catch/then
- **THEN** `pnpm lint` сообщает об ошибке

#### Scenario: Нарушение rules-of-hooks

- **WHEN** React hook вызывается вне компонента или условно
- **THEN** `pnpm lint` сообщает об ошибке

#### Scenario: Type-only import

- **WHEN** импорт используется только как тип без `import type`
- **THEN** Biome сообщает об ошибке или автоисправляет при `--write`

### Requirement: Форматирование соответствует прежним настройкам

Formatter MUST использовать эквивалентные настройки прежнего Prettier:

- `lineWidth`: 100
- `indentStyle`: space, `indentWidth`: 2
- `quoteStyle`: double
- `semicolons`: always
- `trailingCommas`: es5
- `arrowParentheses`: always

#### Scenario: Форматирование TypeScript-файла

- **WHEN** Biome форматирует `.ts`/`.tsx` файл
- **THEN** результат соответствует указанным параметрам (100 символов, двойные кавычки, точки с запятой)

### Requirement: Игнорирование артефактов сборки

Biome MUST NOT проверять сгенерированные и build-артефакты:

- `node_modules`, `dist`, `dist-native`, `.expo`
- `*.gen.ts`, `.tanstack`
- config-файлы (`*.config.ts`, `*.config.mts`, `*.config.js`, `*.config.mjs`)

#### Scenario: Автогенерированный route tree

- **WHEN** Biome сканирует монорепу
- **THEN** файлы `*.gen.ts` исключены из проверки

### Requirement: Подавление правил в коде

Подавление правил MUST использовать синтаксис Biome (`biome-ignore`), а не ESLint (`eslint-disable`).

#### Scenario: Игнорирование exhaustive-deps

- **WHEN** в коде необходимо подавить `useExhaustiveDependencies`
- **THEN** используется комментарий `biome-ignore lint/correctness/useExhaustiveDependencies`
- **AND** в кодовой базе MUST NOT остаться `eslint-disable` комментариев
