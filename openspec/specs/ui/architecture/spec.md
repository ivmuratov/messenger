# ui/architecture Specification

## Purpose

Задаёт организацию пакета `@ui`: оболочка ThemeProvider, плоский каталог components и инфраструктура shared — без иерархии Atomic Design.

## Requirements

### Requirement: Структура пакета @ui

`packages/ui/src` MUST содержать три верхние области: `ThemeProvider/` (оболочка приложения внутри пакета), `components/` (плоский список визуальных компонентов) и `shared/` (токены, sprinkles, хуки, контексты, утилиты). Каталоги `atoms/`, `molecules/` и `layouts/` MUST NOT существовать. Каждый визуальный компонент MUST лежать непосредственно в `components/{Component}/` с внутренней структурой `types.ts`, при необходимости `tokens.ts`, `web/` и `mobile/`. `ThemeProvider` MUST оставаться вне `components/`.

#### Scenario: Плоский каталог компонентов

- **WHEN** проверяется `packages/ui/src`
- **THEN** существуют каталоги `ThemeProvider/`, `components/` и `shared/`
- **AND** `components/` содержит `DrawerLayout`, `Flex`, `Page`, `ThemeSwitcher`, `Typography` как прямые дочерние папки
- **AND** каталогов `atoms/`, `molecules/` и `layouts/` нет

#### Scenario: Внутренняя структура компонента сохранена

- **WHEN** открывается `packages/ui/src/components/Typography`
- **THEN** присутствуют `types.ts`, `web/` и `mobile/`

### Requirement: Граф зависимостей слоёв

Модули `@ui` MUST зависеть только вниз: `ThemeProvider` → `components` → `shared`. `ThemeProvider` MAY импортировать `components` и `shared`. Модули в `components/` MUST NOT импортировать `ThemeProvider`. Модули в `shared/` MUST NOT импортировать `ThemeProvider` и MUST NOT импортировать `components`. Внутри `packages/ui` импорт публичного барреля `@ui` и файлов `src/index.ts` / `src/index.native.ts` MUST NOT.

#### Scenario: Компонент не импортирует оболочку

- **WHEN** файл в `components/` содержит import
- **THEN** путь MUST NOT указывать на `ThemeProvider`

#### Scenario: Shared не импортирует верхние слои

- **WHEN** файл в `shared/` содержит import
- **THEN** путь MUST NOT указывать на `components/` или `ThemeProvider`

#### Scenario: ThemeProvider может импортировать кит

- **WHEN** реализация `ThemeProvider` импортирует модуль из `components/` или `shared/`
- **THEN** такой импорт MUST быть допустим

#### Scenario: Нет импорта через публичный баррель пакета

- **WHEN** файл внутри `packages/ui/src` импортирует символ того же пакета
- **THEN** MUST NOT использовать `from "@ui"`
- **AND** MUST NOT импортировать `src/index.ts` или `src/index.native.ts`

### Requirement: Соседние импорты без циклов

Внутри `components/` и внутри `shared/` соседние модули MAY импортировать друг друга. Циклические зависимости внутри слоя MUST NOT. Web-реализация MUST импортировать только web-поверхность соседа; mobile-реализация — только mobile-поверхность. Импорт внутренностей соседа (файлы стилей, приватный context) MUST NOT: только входная точка платформы (`web/` или `mobile/`).

#### Scenario: Сосед в components на web

- **WHEN** web-реализация компонента импортирует другого соседа из `components/`
- **THEN** импорт MUST идти в web-баррель соседа (например `@/components/Typography/web`)
- **AND** MUST NOT идти в `.css.ts` или иные внутренности соседа

#### Scenario: Сосед в components на mobile

- **WHEN** mobile-реализация компонента импортирует другого соседа из `components/`
- **THEN** импорт MUST идти в mobile-баррель соседа (например `@/components/Typography/mobile`)
- **AND** MUST NOT идти в `.styles.ts` или иные внутренности соседа

#### Scenario: Цикл внутри слоя запрещён

- **WHEN** модуль A в `components/` или в `shared/` импортирует модуль B того же слоя
- **THEN** B (прямо или транзитивно) MUST NOT импортировать A

### Requirement: Публичный API потребителей @ui

Приложения `apps/web`, `apps/mobile` и `apps/ui-storybook` MUST импортировать компоненты и `ThemeProvider` только из публичного API `@ui`. Переезд внутренних папок MUST NOT требовать смены пути импорта у потребителей.

#### Scenario: Потребитель не знает внутренний путь

- **WHEN** `apps/web` или `apps/mobile` импортирует `Page`, `Flex`, `ThemeSwitcher` или `ThemeProvider`
- **THEN** импорт MUST быть `from "@ui"`

### Requirement: Артефакты архитектуры @ui синхронизированы

Живые документы, описывающие устройство `@ui`, MUST отражать компонентный подход (`ThemeProvider` / `components` / `shared`) и граф импортов. Они MUST NOT описывать Atomic Design (`atoms/`, `molecules/`, `layouts/`) как актуальную организацию. В scope: `.cursor/rules/architecture.mdc`, `.cursor/agents/researcher.md`, корневой `README.md`, `openspec/config.yaml`.

#### Scenario: Правило architecture без Atomic Design

- **WHEN** читается `.cursor/rules/architecture.mdc`
- **THEN** иерархия `@ui` описана как `ThemeProvider`, `components`, `shared`
- **AND** нет действующих правил импортов атомов, молекул и лайаутов

#### Scenario: Context OpenSpec, README и researcher

- **WHEN** читаются `openspec/config.yaml`, корневой `README.md` и `.cursor/agents/researcher.md`
- **THEN** пакет `@ui` описан без Atomic Design
- **AND** структура совпадает с `ThemeProvider` / `components` / `shared`
