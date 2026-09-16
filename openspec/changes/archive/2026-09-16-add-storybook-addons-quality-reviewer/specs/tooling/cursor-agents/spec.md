## Purpose

Локальный read-only code review в Cursor после apply: perf, render, a11y и базовая security без дублирования global architecture rules и без платных CI-ревьюверов.

## ADDED Requirements

### Requirement: Subagent quality-reviewer

Репозиторий MUST предоставлять custom subagent `quality-reviewer` в `.cursor/agents/quality-reviewer.md` с `readonly: true`. Subagent MUST анализировать diff (branch changes или uncommitted changes) и возвращать structured findings. Subagent MUST NOT редактировать файлы.

#### Scenario: Запуск через skill

- **WHEN** пользователь или родительский агент вызывает skill review-quality после изменений кода
- **THEN** MUST быть запущен subagent `quality-reviewer` с путём репозитория и типом diff
- **AND** subagent MUST вернуть verdict и таблицу findings

#### Scenario: Read-only поведение

- **WHEN** subagent `quality-reviewer` выполняет review
- **THEN** MUST NOT создавать или изменять файлы проекта
- **AND** MUST NOT выполнять state-changing shell commands

### Requirement: Scope review quality-reviewer

Review MUST покрывать: уязвимости безопасности в изменённом коде (XSS, unsanitized input, secrets в diff), неэффективные алгоритмы на hot paths, лишние React re-renders (web), React Native list/accessibility patterns (mobile), a11y (ARIA, labels, keyboard, RN accessibilityRole/Label). Review MUST NOT сообщать о нарушениях package boundaries, naming conventions, file structure, styling location — они покрыты `.cursor/rules` и Biome.

#### Scenario: Исключение architecture findings

- **WHEN** diff содержит импорт `.css.ts` из feature-модуля app
- **THEN** quality-reviewer MUST NOT включать finding (это зона lint/rules)
- **AND** MUST сфокироваться только на perf/security/a11y в изменённых строках

#### Scenario: React render finding

- **WHEN** diff добавляет inline object/function в props hot-path list component
- **THEN** quality-reviewer MAY сообщить finding с severity и recommendation по memoization

### Requirement: Skill review-quality

Репозиторий MUST предоставлять skill `.cursor/skills/review-quality/SKILL.md`, описывающий запуск subagent `quality-reviewer` по образцу review-bugbot (Task tool, diff branch changes по умолчанию). Skill MUST указывать формат вывода: verdict (PASS / PASS WITH NOTES / NEEDS WORK) и таблица Severity | Location | Finding.

#### Scenario: Формат вывода

- **WHEN** subagent завершил review без blocking findings
- **THEN** skill workflow MUST резюмировать one-line status с verdict PASS или PASS WITH NOTES
- **AND** при findings MUST вывести markdown-таблицу, отсортированную по severity

### Requirement: Документация cursor agents

`.cursor/README.md` MUST описывать subagent `quality-reviewer` и skill `review-quality`. Skill MUST NOT дублировать встроенный `security-review`; для auth/crypto changes MUST рекомендовать `/review-security` дополнительно.

#### Scenario: README agents section

- **WHEN** разработчик читает `.cursor/README.md`
- **THEN** MUST найти описание `quality-reviewer` и когда использовать `review-quality` vs `review-security`
