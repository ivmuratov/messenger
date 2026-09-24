---
name: review
description: Параллельный post-apply review — OpenSpec verify + quality-reviewer (perf, render, a11y). Use after opsx-apply, ручных доработок или когда пользователь просит review.
disable-model-invocation: true
---

# Review

Skill только для **root**. Если ты subagent `quality-reviewer` или исполнитель verify — не читай этот skill и не запускай вложенные subagent. Verify делай по `.cursor/skills/openspec-verify-change/SKILL.md`; code review — по `.cursor/agents/quality-reviewer.md`.

## Запуск

В **одном** сообщении запусти **два** subagent **параллельно** (`run_in_background: false`, если пользователь не просил фон):

| Subagent | `description` | Тип |
| -------- | ------------- | --- |
| OpenSpec verify | `OpenSpec Verify` | `generalPurpose` |
| Code quality | `Quality Review` | `quality-reviewer` |

На беседу не больше 5 subagent суммарно, включая retry; лишние режет `.cursor/hooks/limitSubagents.mjs`. Параллельно больше двух subagent для review не запускай.

### 1. OpenSpec verify

Subagent **сначала** читает `.cursor/skills/openspec-verify-change/SKILL.md` и выполняет все шаги verify. Не implement, не archive, не правит код по findings.

```text
Full Repository Path: <absolute repository path>
Change: <имя change или "infer per skill">
Custom Instructions: <только если пользователь дал инструкции>
```

Если change уже определён для записи файла (см. ниже) — передай имя в `Change`. Иначе `infer per skill`.

Ответ MUST содержать полный **Verification Report** как в skill: Summary scorecard, Issues by Priority (CRITICAL / WARNING / SUGGESTION), Final Assessment.

### 2. Quality review

Diff считает subagent; root diff не готовит. `Base Branch` не указывай, если base — default.

```text
Full Repository Path: <absolute repository path>
Diff: <"branch changes" | "uncommitted changes">
Base Branch: <только если base не default>
Custom Instructions: <только если пользователь дал инструкции>
```

По умолчанию `branch changes`. `uncommitted changes` — только если просят проверить исключительно незакоммиченное относительно `HEAD`.

## Retry

Если **один** из двух subagent упал до готового отчёта:

- неверный вызов — исправь и **один** retry только для упавшего
- лимит или `decision: deny` — не retry, сообщи и остановись
- другая ошибка — один retry с тем же промптом для упавшего
- текст про вложенный subagent или «использую skill review» — рекурсия, не retry

Успешный subagent не перезапускай. Та же ошибка после retry — остановись и назови blocker.

## Change для verify и файла

Change — первое совпадение:

1. Пользователь назвал change, и `openspec/changes/<name>` есть (не в `archive/`).
2. Имя текущей ветки совпадает с каталогом активного change.
3. Ветка `main` или `master`, и активный change ровно один.

Иначе verify subagent выбирает change по своему skill; файл review не пиши, если change так и не определён однозначно для записи.

## Ответ в чате

Оба subagent ещё не завершились — дождись обоих.

Verify не удался, quality OK — кратко blocker verify; quality verdict и таблицу findings всё равно выведи.

Quality не удался, verify OK — blocker quality; scorecard и Final Assessment verify выведи.

Пустой diff у quality — одна фраза, что code review нечего; verify всё равно резюмируй.

Иначе:

1. **OpenSpec** — Final Assessment из ответа verify (не выдумывай).
2. **Code quality** — verdict (`PASS`, `PASS WITH NOTES`, `NEEDS WORK`). Без findings — одна строка. С findings — таблица: `critical` → `warning` → `note`, колонки **Severity**, **Location**, **Finding**.

Findings не исправляй и review не перезапускай, пока пользователь явно не попросит. Для auth, crypto и глубокой security рекомендуй `/review-security`.

## Файл

Пишет root после обоих ответов. Subagent файлы не создаёт. Только если change определён для записи (см. выше) **и** verify вернул Verification Report.

Путь: `openspec/changes/<change>/reviews/review-<n>.md`. `<n>` — max + 1; пропуски не заполняй; файлов нет → `review-1.md`.

Собери **один** markdown по образцу вывода `openspec-verify-change` (таблица Summary, группы CRITICAL / WARNING / SUGGESTION, один блок **Final Assessment**). Не используй старый формат с `Verdict:` только в шапке.

```markdown
# Review <n>

- Change: <change>
- Date: <YYYY-MM-DD>
- Diff: <branch changes | uncommitted changes>

## Verification Report: <change-name>

### Summary

| Dimension    | Status |
| ------------ | ------ |
| Completeness | <из verify Summary> |
| Correctness  | <из verify Summary> |
| Coherence    | <из verify Summary> |
| Code Quality | <PASS \| PASS WITH NOTES \| NEEDS WORK — кратко, на русском> |

### Issues by Priority

Скопируй из ответа verify блоки **CRITICAL**, **WARNING**, **SUGGESTION** (формулировки и рекомендации не перефразируй). Дополни findings quality-reviewer:

- severity `critical` → в **CRITICAL** (префикс «Code quality:», Location из таблицы)
- severity `warning` → в **WARNING**
- severity `note` → в **SUGGESTION**

Если у quality нет findings — не добавляй пустых пунктов.

### Final Assessment

Один абзац на русском: итог verify (готовность к archive, skipped checks, счётчики) **и** code quality verdict. Если verify уже дал Final Assessment — объедини с quality без противоречий; при конфликте приоритета — CRITICAL quality или verify блокирует «ready for archive».

---

## Detail: OpenSpec Verification

<полный markdown-ответ verify subagent без изменений>

## Detail: Code Quality

<полный markdown-ответ quality-reviewer без изменений>
```

Если verify не выполнился — файл не создавай. Если diff пуст и quality только «нечего проверять», но verify успешен — файл создай по verify + строка Code Quality «Нечего проверять (пустой diff)».
