## MODIFIED Requirements

### Requirement: Размещение и именование тестовых файлов

Unit-тесты MUST располагаться в пакете-владельце исходного кода. На одном уровне с тестируемым модулем (функцией, хуком, store) MUST быть директория `__tests__/`, внутри которой лежат файлы с суффиксом `.test.ts` или `.test.tsx`. Unit-тесты MUST NOT располагаться рядом с исходником без обёртки `__tests__/`.

#### Scenario: Test file в __tests__ рядом с lib-функцией

- **WHEN** модуль `packages/core/src/modules/auth/lib/validateSession.ts` получает тест
- **THEN** тестовый файл MUST находиться по пути `packages/core/src/modules/auth/lib/__tests__/validateSession.test.ts`

#### Scenario: Test file в __tests__ рядом с hook

- **WHEN** хук `packages/ui/src/components/ThemeSwitcher/hooks/useThemeSwitcher.ts` получает тест
- **THEN** тестовый файл MUST находиться по пути `packages/ui/src/components/ThemeSwitcher/hooks/__tests__/useThemeSwitcher.test.ts`
