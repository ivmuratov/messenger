# cursor-agents Specification

## Purpose

Локальный read-only code review в Cursor после apply: perf, render, a11y и базовая security без дублирования global architecture rules и без платных CI-ревьюверов.

## Requirements

### Requirement: Subagent quality-reviewer

Репозиторий MUST предоставлять custom subagent `quality-reviewer` в `.cursor/agents/quality-reviewer.md` с `readonly: true`. Subagent MUST анализировать diff (branch changes или uncommitted changes) и возвращать structured findings. Subagent MUST NOT редактировать файлы.

#### Scenario: Запуск через skill

- **WHEN** пользователь или родительский агент вызывает skill opsx-review после изменений кода
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

### Requirement: Skill opsx-review

Репозиторий MUST предоставлять skill `.cursor/skills/opsx-review/SKILL.md`, описывающий параллельный запуск OpenSpec verify (subagent выполняет `.cursor/skills/openspec-verify-change/SKILL.md`) и subagent `quality-reviewer` (diff branch changes по умолчанию). Skill MUST задавать сжатый файл `review-<n>.md` из трёх секций: список просмотренных файлов; **Spec review** (подблоки CRITICAL, WARNING, SUGGESTION из verify); **Code review** (те же подблоки из findings quality-reviewer). Файл MUST NOT содержать таблицы, scorecard, verdict, Final Assessment и полные дампы ответов subagent. Subagent quality-reviewer по-прежнему MUST возвращать verdict и таблицу findings в ответ root.

#### Scenario: Verdict quality-reviewer

- **WHEN** subagent quality-reviewer завершил review
- **THEN** MUST вернуть verdict (PASS / PASS WITH NOTES / NEEDS WORK) и таблицу findings root-агенту
- **AND** root MUST маппить findings в секцию Code review файла без таблиц

#### Scenario: Запись review в change

- **WHEN** opsx-review завершился и change определён: пользователь назвал существующий каталог в `openspec/changes/` вне `archive/`, либо имя текущей ветки совпадает с каталогом change, либо ветка `main`/`master` и активный change ровно один
- **AND** verify subagent успешно завершился
- **THEN** root-агент MUST записать `openspec/changes/<change>/reviews/review-<n>.md` только с секциями **Файлы**, **Spec review**, **Code review**
- **AND** `<n>` MUST быть на один больше максимального существующего номера; пропуски MUST NOT заполняться
- **AND** subagent MUST NOT создавать этот файл
- **AND** если change не определён или verify не выполнился — файл MUST NOT создаваться

### Requirement: Документация cursor agents

`.cursor/README.md` MUST описывать subagent `quality-reviewer` и skill `opsx-review`. Skill MUST NOT дублировать встроенные Cursor `review` / `code-review` и `security-review`; для auth/crypto changes MUST рекомендовать `/review-security` дополнительно.

#### Scenario: README agents section

- **WHEN** разработчик читает `.cursor/README.md`
- **THEN** MUST найти описание `quality-reviewer` и когда использовать `opsx-review` vs встроенный review и `review-security`
