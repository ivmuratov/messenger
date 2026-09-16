## Why

Storybook-каталог `@ui` и Chromatic уже работают, но a11y-проверки и переключение light/dark в каталоге отложены с change `add-storybook`. Без `@storybook/addon-a11y` регрессии доступности в web-компонентах ловятся только вручную; без `@storybook/addon-themes` все stories зафиксированы на `defaultTheme="light"`, а ThemeSwitcher не демонстрирует dark-состояние. Платные CI-ревьюверы не используются — нужен локальный read-only subagent для perf, render и a11y в diff (без дублирования global rules).

## What Changes

- `@storybook/addon-a11y` и `@storybook/addon-themes@10.6.0` в `apps/ui-storybook`; регистрация в `.storybook/main.ts`
- Конфигурация `preview.tsx`: a11y-параметры (axe-core); themes toolbar, синхронизированный с `ThemeProvider` (`light` / `dark`)
- Syncpack-группа Storybook: добавить оба addon
- Chromatic: baseline light по умолчанию; dark — через отдельные story variants или globals (без flaky ThemeSwitcher в default snapshot)
- Subagent `.cursor/agents/quality-reviewer.md` (`readonly: true`): security (light), algorithms, React render, a11y; **не** architecture/imports/naming
- Skill `.cursor/skills/review-quality/SKILL.md` для запуска subagent на branch/uncommitted diff
- Обновление `.cursor/README.md`, `openspec/config.yaml`, `.cursor/skills/testing/SKILL.md`

## Capabilities

### New Capabilities

- `tooling/cursor-agents`: read-only subagent `quality-reviewer` и skill для code review после apply

### Modified Capabilities

- `tooling/storybook`: требования к a11y- и themes-addons, preview-конфигурации и границе с Chromatic

## Impact

- **apps/ui-storybook**: `package.json`, `.storybook/main.ts`, `.storybook/preview.tsx`
- **root**: `syncpack.config.ts`
- **`.cursor/`**: `agents/quality-reviewer.md`, `skills/review-quality/SKILL.md`, `README.md`
- **docs**: `openspec/config.yaml`, `.cursor/skills/testing/SKILL.md`
- **packages/ui**: stories MAY получить `parameters.a11y` / theme variants где нужно (минимально — ThemeSwitcher, Typography)

## Non-goals

- `@storybook/addon-vitest` и CI a11y-тесты stories (отдельный change)
- Interaction tests (`play` functions)
- Mobile stories (`@storybook/react-native`)
- Spec-reviewer для OpenSpec артефактов
- Дублирование встроенного `security-review` — для auth/crypto по-прежнему `/review-security`
- Generic `reviewer.md` (architecture review)
