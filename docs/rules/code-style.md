---
description: Соглашения по именованию и стилю кода
alwaysApply: true
---

# Стиль кода

## Именование

- Файлы компонентов: `PascalCase.tsx`
- Остальные файлы: `camelCase.ts`
- Стили для компонентов: `{Component}.css.ts` (web), `{Component}.styles.ts` (mobile)
- Общие стили: `{styles}.css.ts` (web), `{styles}.styles.ts` (mobile)
- Функции и переменные: `camelCase`
- Хардкод-константы: `UPPERCASE_SNAKE_CASE`

## Стиль

- Предпочитай `const foo = () =>` вместо `function foo()`
  - **Исключение:** используй `function`, когда требуется hoisting (например, file-based routes TanStack Router, где компонент используется до объявления)
- Предпочитай именованные экспорты вместо default: `export const variable ...`, `export function ...`
