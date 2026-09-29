# page Specification

## Purpose

Описывает compound-компонент `Page`: слоты `Header` и `Body` и допустимую внутреннюю композицию с соседними компонентами `@ui` без циклов.

## Requirements

### Requirement: Page.Header использует Flex для раскладки children

Web- и mobile-реализация `Page.Header` MUST оборачивать переданные `children` в `Flex` с горизонтальным направлением (`direction="row"`), выравниванием по центру поперечной оси и согласованным интервалом между элементами через spacing props `Flex`. Внешний API `Page` (compound `Page`, `Page.Header`, `Page.Body`) MUST NOT меняться: потребители по-прежнему передают произвольные `children` в `Page.Header`.

#### Scenario: Несколько элементов в шапке (web)

- **WHEN** потребитель рендерит `<Page.Header>` с двумя или более sibling-элементами на web
- **THEN** элементы MUST располагаться в одной горизонтальной строке с видимым интервалом между ними
- **AND** шапка MUST сохранять sticky-поведение и визуальные токены шапки (фон, нижняя граница)

#### Scenario: Несколько элементов в шапке (mobile)

- **WHEN** потребитель рендерит `<Page.Header>` с двумя или более sibling-элементами на mobile
- **THEN** элементы MUST располагаться в одной горизонтальной строке с согласованным интервалом
- **AND** MUST применяться themed-стили шапки (фон, нижняя граница)

### Requirement: Page импортирует Flex только через платформенный баррель

Файлы реализации `Page` MUST импортировать `Flex` из `@/components/Flex/web` или `@/components/Flex/mobile` в зависимости от платформы. MUST NOT импортировать `.css.ts`, `.styles.ts` или иные внутренности `Flex`. Модули `Flex` MUST NOT импортировать `Page` (прямо или транзитивно через другие компоненты в рамках этого change).

#### Scenario: Web-импорт Flex

- **WHEN** проверяется `packages/ui/src/components/Page/web/Page.tsx`
- **THEN** импорт `Flex` MUST идти из `@/components/Flex/web`
- **AND** MUST NOT быть импортов из `@/components/Page/` внутри `packages/ui/src/components/Flex/`

#### Scenario: Mobile-импорт Flex

- **WHEN** проверяется `packages/ui/src/components/Page/mobile/Page.tsx`
- **THEN** импорт `Flex` MUST идти из `@/components/Flex/mobile`
- **AND** MUST NOT быть импортов из `@/components/Page/` внутри `packages/ui/src/components/Flex/mobile/`
