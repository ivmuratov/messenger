# cursor-agents Specification

## Purpose

Локальный read-only code review в Cursor после apply: perf, render, a11y и базовая security без дублирования global architecture rules и без платных CI-ревьюверов.

## Requirements

### Requirement: Subagent quality-reviewer

Репозиторий MUST предоставлять custom subagent `quality-reviewer` в `.cursor/agents/quality-reviewer.md` с `readonly: true`. Subagent MUST анализировать diff (branch changes или uncommitted changes) и возвращать structured findings. Subagent MUST NOT редактировать файлы.

#### Scenario: Запуск через skill

- **WHEN** пользователь или родительский агент вызывает skill review после изменений кода
- **THEN** MUST быть запущены параллельно subagent verify (по `.cursor/skills/openspec-verify-change/SKILL.md`) и subagent `quality-reviewer` с путём репозитория и типом diff
- **AND** quality-reviewer MUST вернуть verdict и таблицу findings

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

### Requirement: Skill review

Репозиторий MUST предоставлять skill `.cursor/skills/review/SKILL.md`, описывающий параллельный запуск OpenSpec verify (subagent выполняет `.cursor/skills/openspec-verify-change/SKILL.md`) и subagent `quality-reviewer` (diff branch changes по умолчанию). Skill MUST задавать объединённый файл review по формату Verification Report из openspec-verify-change (Summary scorecard с строкой Code Quality, Issues by Priority, Final Assessment) и формат quality: verdict (PASS / PASS WITH NOTES / NEEDS WORK) и таблица Severity | Location | Finding.

#### Scenario: Verdict PASS

- **WHEN** subagent завершил review и findings нет
- **THEN** verdict MUST быть PASS
- **AND** skill workflow MUST резюмировать one-line status с этим verdict

#### Scenario: Verdict PASS WITH NOTES

- **WHEN** findings только severity `note`
- **THEN** verdict MUST быть PASS WITH NOTES
- **AND** skill workflow MUST вывести эти findings таблицей вместе с verdict

#### Scenario: Verdict NEEDS WORK

- **WHEN** есть хотя бы один finding severity `warning` или `critical`
- **THEN** verdict MUST быть NEEDS WORK
- **AND** skill workflow MUST вывести markdown-таблицу, отсортированную по severity, вместе с verdict

#### Scenario: Запись review в change

- **WHEN** review завершился с verdict и change определён: пользователь назвал существующий каталог в `openspec/changes/` вне `archive/`, либо имя текущей ветки совпадает с каталогом change, либо ветка `main`/`master` и активный change ровно один
- **THEN** root-агент MUST записать объединённый Verification Report в `openspec/changes/<change>/reviews/review-<n>.md` с шапкой change, date, diff, Summary (включая Code Quality), Issues by Priority и Final Assessment; полные ответы subagent — в секциях Detail
- **AND** `<n>` MUST быть на один больше максимального существующего номера; пропуски MUST NOT заполняться
- **AND** subagent MUST NOT создавать этот файл
- **AND** если change не определён или diff пуст — файл MUST NOT создаваться, результат остаётся в чате

### Requirement: Документация cursor agents

`.cursor/README.md` MUST описывать subagent `quality-reviewer` и skill `review`. Skill MUST NOT дублировать встроенный `security-review`; для auth/crypto changes MUST рекомендовать `/review-security` дополнительно.

#### Scenario: README agents section

- **WHEN** разработчик читает `.cursor/README.md`
- **THEN** MUST найти описание `quality-reviewer` и когда использовать `review` vs `review-security`
