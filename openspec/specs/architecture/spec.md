# architecture Specification

## Purpose

Задаёт единую модульную архитектуру слоёв `core`, `apps/web` и `apps/mobile`: структуру каталогов, граф зависимостей, правила public API и импортов между пакетами.

## Requirements

### Requirement: Структура пакета `core`

`packages/core/src` MUST организовывать код в две верхние области: `modules/` (доменные модули) и `shared/` (переиспользуемая инфраструктура без доменной привязки). Каталоги MUST появляться вместе с первым кодом, не как пустые заготовки. Каждый доменный модуль MUST лежать в `modules/{domain}/`, содержать файл `index.ts` как public API и **базовые** каталоги `api/`, `types/`, `hooks/`, `utils/` (плоские списки файлов внутри, с colocated `__tests__/`). Модуль MAY дополнительно содержать `store/`, `selectors/`, `contexts/` и другие каталоги по необходимости — тот же принцип extensibility MUST применяться в `web` и `mobile`. Не каждый модуль обязан включать все каталоги. Каталог `shared/` MUST содержать `types/`, `hooks/`, `utils/` и `index.ts`. Корневой `packages/core/src/index.ts` MUST NOT существовать.

#### Scenario: Структура доменного модуля

- **WHEN** проверяется `packages/core/src/modules/auth`
- **THEN** MUST существовать файл `index.ts`
- **AND** MUST существовать базовые каталоги `api/`, `types/`, `hooks/`, `utils/` (если модуль их использует)
- **AND** файлы внутри каждого каталога MUST лежать плоско (без вложенных подпапок, кроме `__tests__/`)

#### Scenario: Опциональные каталоги модуля

- **WHEN** модулю нужны Zustand store, selectors или React contexts
- **THEN** MAY существовать каталоги `store/`, `selectors/`, `contexts/` (или иные) внутри `modules/{domain}/`
- **AND** тот же принцип MUST применяться в `apps/web` и `apps/mobile` для feature-модулей

#### Scenario: Структура shared в `core`

- **WHEN** проверяется `packages/core/src/shared`
- **THEN** MUST существовать каталоги `types/`, `hooks/`, `utils/` и файл `index.ts`

#### Scenario: Нет корневого барреля `core`

- **WHEN** проверяется `packages/core/src/index.ts`
- **THEN** файл MUST NOT существовать

### Requirement: Структура apps/web и apps/mobile

`apps/web/src` и `apps/mobile/src` MUST организовывать код в три верхние области (целевая модель): `app/`, `modules/` и `shared/`. После начального apply MUST существовать `app/`; `modules/` и `shared/` MUST появляться вместе с первым кодом. Структура MUST быть идентичной для обеих платформ, когда соответствующие каталоги существуют. Текущий код приложения (bootstrap, routes, navigation, layouts) MUST находиться в `app/`. Каждый feature-модуль MUST лежать в `modules/{feature}/` с тем же принципом каталогов, что и в `@core`, плюс `components/` (`.tsx` — screen/feature UI) и `index.ts`. Каталог `shared/` MUST содержать `types/`, `hooks/`, `utils/` и `index.ts`.

#### Scenario: Структура web-приложения после apply

- **WHEN** проверяется `apps/web/src` сразу после apply, до первых feature-модулей
- **THEN** MUST существовать каталог `app/`
- **AND** `modules/` и `shared/` MAY отсутствовать до появления кода

#### Scenario: Маршруты TanStack Router в app

- **WHEN** проверяется file-based routing web-приложения
- **THEN** route-файлы MUST находиться в `apps/web/src/app/routes/`

#### Scenario: Навигация `mobile` в app

- **WHEN** проверяется конфигурация React Navigation
- **THEN** navigators и screen registration MUST находиться в `apps/mobile/src/app/`

#### Scenario: Идентичность `web` и `mobile`

- **WHEN** в обоих приложениях появляются каталоги `modules/` или `shared/`
- **THEN** принцип организации MUST совпадать с целевой моделью spec

### Requirement: Entry points приложений

**Web:** текущее содержимое `apps/web/src/` MUST быть перенесено в `apps/web/src/app/`. Файл `apps/web/index.html` MUST обновить script src на путь entry после переноса (например, `/src/app/main.tsx`).

**Mobile:** `apps/mobile/index.ts` MUST оставаться корневой точкой входа Expo без изменения роли. Корневой UI-компонент MUST находиться в `apps/mobile/src/app/App.tsx`. Import в `apps/mobile/index.ts` MUST обновиться на `./src/app/App`.

#### Scenario: Web bulk-move в app

- **WHEN** проверяется `apps/web/src` после реорганизации
- **THEN** `main.tsx`, `routes/` и прочий текущий код MUST находиться под `apps/web/src/app/`

#### Scenario: index.html указывает на entry в app

- **WHEN** проверяется `apps/web/index.html` после apply
- **THEN** script src MUST указывать на `/src/app/main.tsx` (или актуальный путь entry в `app/`)
- **AND** MUST NOT ссылаться на `/src/main.tsx`

#### Scenario: Mobile entry без нового src/index.ts

- **WHEN** проверяется entry mobile-приложения
- **THEN** `apps/mobile/index.ts` MUST существовать и регистрировать root component
- **AND** `apps/mobile/src/index.ts` MUST NOT существовать
- **AND** `apps/mobile/src/app/App.tsx` MUST быть корневым UI-компонентом

### Requirement: Граф зависимостей внутри слоя

Внутри `@core`, `apps/web` и `apps/mobile` зависимости MUST направлены только вниз: `app → modules → shared`. Модули `shared/` MUST NOT импортировать из `modules/`. Модули в `modules/` MAY импортировать друг друга только через public API (`index.ts` или `@/modules/{other}`). Внутри одного модуля MUST использоваться относительные импорты.

#### Scenario: Shared не импортирует modules

- **WHEN** файл в `shared/` содержит import
- **THEN** путь MUST NOT указывать на `modules/`

#### Scenario: Межмодульный импорт через public API

- **WHEN** модуль `auth` импортирует символ из модуля `session`
- **THEN** import MUST идти из `@/modules/session` (или `@/modules/session/index`)
- **AND** MUST NOT импортировать файлы внутри `session/` минуя `index.ts`

#### Scenario: Внутри модуля — относительные импорты

- **WHEN** файл `modules/auth/hooks/useAuth.ts` импортирует тип из того же модуля
- **THEN** допускается относительный import (например, `../types/user.ts`)

### Requirement: Public API модулей

Каждый модуль MUST экспортировать наружу только символы, re-exported из `index.ts`. Импорт приватных файлов модуля (не re-exported в `index.ts`) из других модулей или из внешних потребителей MUST NOT. Типы домена, нужные снаружи модуля, MUST re-export через `index.ts`.

#### Scenario: Запрет deep import в чужой модуль

- **WHEN** код вне `modules/auth/` импортирует `@/modules/auth/utils/hashPassword.ts` напрямую
- **THEN** такой import MUST считаться нарушением архитектуры

#### Scenario: Допустимый import через index

- **WHEN** `apps/web` импортирует `useAuth` из `@core/modules/auth`
- **THEN** символ MUST быть объявлен в `packages/core/src/modules/auth/index.ts`

### Requirement: Subpath exports @core

Пакет `@core` MUST предоставлять subpath exports через wildcard: `@core/modules/{domain}` и `@core/shared`. Корневой export `"."` MUST NOT существовать в `packages/core/package.json`. Добавление нового доменного модуля MUST NOT требовать правок `exports` в `package.json` (wildcard покрывает новые модули).

#### Scenario: Импорт модуля из приложения

- **WHEN** `apps/web` импортирует доменную логику
- **THEN** import MUST быть `from "@core/modules/{domain}"` или `from "@core/shared"`
- **AND** MUST NOT быть `from "@core"`

#### Scenario: Wildcard exports в package.json

- **WHEN** проверяется `packages/core/package.json` → `exports`
- **THEN** MUST присутствовать entries для `./modules/*` и `./shared`
- **AND** MUST NOT присутствовать entry `"."`

### Requirement: Импорты между пакетами

`@core` MUST NOT импортировать из `@ui`, `apps/web`, `apps/mobile`. `apps/web` и `apps/mobile` MUST импортировать `@ui` только через публичный API `from "@ui"`. Deep imports во внутренности `@ui` (`packages/ui/src/**`) MUST NOT. `apps/web` и `apps/mobile` MUST NOT импортировать друг друга. Стилизация (Vanilla Extract, StyleSheet) MUST оставаться только в `@ui`; `modules/components/` в apps MUST NOT содержать `.css.ts` или `.styles.ts`.

#### Scenario: @core изолирован от UI

- **WHEN** файл в `packages/core` содержит import
- **THEN** путь MUST NOT указывать на `@ui` или `apps/`

#### Scenario: Apps импортируют @ui через баррель

- **WHEN** `apps/web` или `apps/mobile` импортирует UI-компонент
- **THEN** import MUST быть `from "@ui"`
- **AND** MUST NOT быть `from "@/components/..."` или прямого пути в `packages/ui/src`

#### Scenario: Запрет стилей в app modules

- **WHEN** проверяется `apps/web/src/modules/**/components/` или `apps/mobile/src/modules/**/components/`
- **THEN** MUST NOT существовать файлов `*.css.ts` или `*.styles.ts`

### Requirement: Внутренние импорты через алиас @/

Внутри `@core`, `apps/web` и `apps/mobile` импорты собственного кода MUST использовать алиас `@/` (`@/modules/...`, `@/shared`, `@/app/...`). MUST NOT использовать package-style импорты (`@core/...`) внутри того же пакета.

#### Scenario: Внутренний import в @core

- **WHEN** модуль в `packages/core` импортирует shared
- **THEN** import MUST быть `from "@/shared"` (или `@/shared/index`)
- **AND** MUST NOT быть `from "@core/shared"`

### Requirement: Enforcement границ импортов через Biome

Монорепозиторий MUST настраивать Biome `noRestrictedImports` (или эквивалент) для автоматической проверки архитектурных границ: `shared → modules`, deep imports между модулями, `@core → @ui`, deep imports в `@ui` из apps, стили в app modules. Нарушение MUST приводить к ошибке lint.

#### Scenario: Lint ловит shared → modules

- **WHEN** файл в `shared/` содержит import из `@/modules/`
- **THEN** `pnpm lint` MUST завершаться с ошибкой для затронутого пакета

#### Scenario: Lint ловит from "@core" без subpath

- **WHEN** приложение содержит `from "@core"` (корневой import)
- **THEN** lint MUST сообщать об ошибке или typecheck MUST не резолвить такой import

### Requirement: Постепенное внедрение каталогов

При apply change MUST NOT создаваться пустые каталоги-заготовки (`.gitkeep`, локальные `README`, placeholder `index.ts`). Каталоги `modules/` и `shared/` MUST появляться только вместе с первым реальным кодом. Целевая структура MUST быть зафиксирована в правилах и OpenSpec до появления файлов.

#### Scenario: Нет пустых заготовок при rollout

- **WHEN** change применён, но доменный или feature-код ещё не добавлен
- **THEN** MUST NOT существовать пустых каталогов `modules/` или `shared/` только ради структуры
- **AND** MUST NOT существовать `.gitkeep` или локальных `README` как placeholder

#### Scenario: Core без доменных модулей

- **WHEN** `@core` ещё не содержит доменного кода
- **THEN** `packages/core/src/modules/` и `packages/core/src/shared/` MAY отсутствовать
- **AND** корневой `packages/core/src/index.ts` MUST NOT существовать

### Requirement: Артефакты архитектуры синхронизированы

Живые документы MUST отражать модульную архитектуру `@core`, `web`, `mobile`. В scope: `.cursor/rules/architecture.mdc`, `openspec/config.yaml`, `.cursor/agents/researcher.md`. Они MUST NOT описывать устаревшую структуру (`model/`, `lib/`, корневой `@core`, плоский `src/` без слоёв в apps).

#### Scenario: architecture.mdc актуален

- **WHEN** читается `.cursor/rules/architecture.mdc`
- **THEN** `@core` описан как `modules/` + `shared/` с subpath exports
- **AND** `apps/web` и `apps/mobile` описаны как `app/` + `modules/` + `shared/`

#### Scenario: @ui без изменений

- **WHEN** читается `.cursor/rules/architecture.mdc` секция `@ui`
- **THEN** структура `ThemeProvider / components / shared` MUST оставаться без изменений
