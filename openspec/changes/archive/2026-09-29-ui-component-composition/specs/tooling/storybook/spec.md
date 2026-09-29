# Spec Delta

## ADDED Requirements

### Requirement: Page story демонстрирует шапку с несколькими детьми

Web- и mobile-story для `Page` MUST рендерить `Page.Header` с не менее чем двумя sibling-элементами (например, текстовая метка и управление), чтобы зафиксировать compound-структуру и раскладку шапки после внутреннего использования `Flex`.

#### Scenario: Web Page header с двумя элементами

- **WHEN** открывается web story `Components/Page`
- **THEN** в `Page.Header` MUST быть видны минимум два соседних элемента
- **AND** MUST использоваться `Page.Body` с содержимым (compound полностью)

#### Scenario: Mobile Page header с двумя элементами

- **WHEN** открывается mobile story `Mobile/Page`
- **THEN** в `Page.Header` MUST быть видны минимум два соседних элемента
- **AND** MUST использоваться `Page.Body` с содержимым
