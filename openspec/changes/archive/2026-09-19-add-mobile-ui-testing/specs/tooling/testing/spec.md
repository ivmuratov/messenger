## MODIFIED Requirements

### Requirement: Storybook как визуальный слой, Vitest — логика и hooks

Визуальный каталог web- **и mobile-** компонентов MUST обеспечиваться Storybook (`apps/ui-storybook` + colocated `*.stories.tsx` в `@ui`; mobile через RN-web в том же runner). Unit-тесты Vitest MUST по-прежнему покрывать lib, stores, API hooks и React hooks; component tests через `render(<Component />)` в Vitest MUST NOT добавляться. Storybook stories MUST NOT заменять unit-тесты hooks и utils. Инфраструктура mobile e2e и проверки native-only поведения MUST оставаться вне текущего change.

#### Scenario: Hook остаётся в Vitest

- **WHEN** тестируется `useThemeSwitcher`
- **THEN** тест MUST выполняться через Vitest и `renderHook` в `__tests__/`
- **AND** MUST NOT переноситься в Storybook как замена unit-теста

#### Scenario: Визуальные состояния в Storybook

- **WHEN** нужно просмотреть варианты web- или mobile-кomponenta (размеры Typography, open/closed DrawerLayout)
- **THEN** MUST использоваться Storybook stories
- **AND** MUST NOT требоваться Vitest component test с `render(<Component />)`
