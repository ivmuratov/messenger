---
name: review-quality
description: Review diff через subagent quality-reviewer (perf, render, a11y, light security). Use when the user asks for quality review after code changes or /opsx-apply.
disable-model-invocation: true
---
# Review Quality

Skill только для **root**. Если ты уже subagent `quality-reviewer` — не читай этот skill и не запускай вложенный `quality-reviewer`. Review делай по `.cursor/agents/quality-reviewer.md`.

## Запуск

Один `quality-reviewer` за review: `run_in_background: false` (фон — только если попросили), `description: "Quality Review"`. На беседу не больше 5 subagent суммарно, включая retry; лишние режет `.cursor/hooks/limitSubagents.mjs`.

Diff считает subagent, root его не готовит. Путь — workspace или корень репозитория. `Base Branch` не указывай: subagent берёт default (обычно `main`). Указывай только если сравнивать нужно не с default base.

```text
Full Repository Path: <absolute repository path>
Diff: <"branch changes" | "uncommitted changes">
Base Branch: <только если base не default>
Custom Instructions: <только если пользователь дал инструкции>
```

По умолчанию `branch changes`: коммиты ветки плюс staged и unstaged относительно base. `uncommitted changes` — только если просят проверить исключительно незакоммиченное относительно `HEAD`.

## Retry

Если единственный дочерний subagent упал до verdict/findings:

- неверный вызов — исправь и один retry
- лимит или `decision: deny` — не retry, сообщи и остановись
- другая ошибка — один retry с тем же промптом
- текст про вложенный subagent или «использую skill review-quality» — это рекурсия, не retry

Второй subagent параллельно не запускай. Та же ошибка после retry — остановись и назови blocker.

## Ответ в чате

Пустой diff — одна фраза, что проверять нечего. Verdict не выдумывай, файл не создавай.

Иначе назови verdict из ответа (`PASS`, `PASS WITH NOTES` или `NEEDS WORK`). Без findings — одна строка. С findings — verdict и таблица: строка на finding, порядок `critical` → `warning` → `note`, колонки **Severity**, **Location**, **Finding**. Если файл записан, добавь путь.

Findings не исправляй и review не перезапускай, пока пользователь явно не попросит. Для auth, crypto и глубокой security рекомендуй `/review-security`.

## Файл

Пишет root после ответа. Subagent файлы не создаёт. Change — первое совпадение:

1. Пользователь назвал change, и `openspec/changes/<name>` есть (не в `archive/`).
2. Имя текущей ветки совпадает с каталогом активного change.
3. Ветка `main` или `master`, и активный change ровно один.

Иначе только чат. Единственный change на другой feature-ветке не бери.

Путь: `openspec/changes/<change>/reviews/review-<n>.md`. `<n>` — max + 1, пропуски не заполняй; файлов нет → `review-1.md`. Шапка, затем полный ответ subagent:

```markdown
# Review <n>

- Change: <change>
- Date: <YYYY-MM-DD>
- Diff: <branch changes | uncommitted changes>
- Verdict: <PASS | PASS WITH NOTES | NEEDS WORK>

<полный ответ subagent>
```
