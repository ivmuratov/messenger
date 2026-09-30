---
name: opsx-review
description: Параллельный post-apply review — OpenSpec verify + quality-reviewer (perf, render, a11y). Use after opsx-apply, ручных доработок, или когда пользователь просит opsx-review, /opsx-review, spec+code review после change.
disable-model-invocation: true
---

# Opsx review

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

Ответ MUST содержать блоки **CRITICAL**, **WARNING**, **SUGGESTION** (как в verify skill) и перечень просмотренных файлов/артефактов, если verify их фиксировал.

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
- текст про вложенный subagent или «использую skill opsx-review» — рекурсия, не retry

Успешный subagent не перезапускай. Та же ошибка после retry — остановись и назови blocker.

## Change для verify и файла

Change — первое совпадение:

1. Пользователь назвал change, и `openspec/changes/<name>` есть (не в `archive/`).
2. Имя текущей ветки совпадает с каталогом активного change.
3. Ветка `main` или `master`, и активный change ровно один.

Иначе verify subagent выбирает change по своему skill; файл review не пиши, если change так и не определён однозначно для записи.

## Ответ в чате

Оба subagent ещё не завершились — дождись обоих.

Если один subagent упал — кратко blocker; второй выведи **только** в сжатом формате ниже (без таблиц и итогов).

Иначе выведи **три** блока (как в файле `review-<n>.md`, без дублирования лишнего):

1. **Файлы** — отсортированный список путей
2. **Spec review** — CRITICAL / WARNING / SUGGESTION из verify
3. **Code review** — CRITICAL / WARNING / SUGGESTION из quality-reviewer (`critical` / `warning` / `note` → те же уровни; пункт: `path:line — finding`)

Пустой подблок — строка «—». Verdict, scorecard, Final Assessment в чат **не** выводи.

Findings не исправляй и review не перезапускай, пока пользователь явно не попросит. Для auth, crypto и глубокой security рекомендуй `/review-security`.

## Файл

Пишет root после обоих ответов. Subagent файлы не создаёт. Только если change определён для записи (см. выше) **и** verify subagent успешно завершился.

Путь: `openspec/changes/<change>/reviews/review-<n>.md`. `<n>` — max + 1; пропуски не заполняй; файлов нет → `review-1.md`.

**Только три секции.** Без шапки, таблиц, scorecard, verdict, Final Assessment, Detail и выводов.

```markdown
## Файлы

- <path>
- …

## Spec review

### CRITICAL

- …

### WARNING

- …

### SUGGESTION

- …

## Code review

### CRITICAL

- …

### WARNING

- …

### SUGGESTION

- …
```

**Файлы:** объедини уникальные пути из diff quality-reviewer (без `openspec/changes/**/reviews/**`) и файлы, которые verify явно проверял (код, delta specs, tasks). Сортировка по пути.

**Spec review:** скопируй пункты verify в **CRITICAL** / **WARNING** / **SUGGESTION** без перефразирования.

**Code review:** findings quality-reviewer — `critical` → **CRITICAL**, `warning` → **WARNING**, `note` → **SUGGESTION**; формат пункта `path:line — finding`. Не смешивай с spec review.

Пустой подблок — одна строка `—`. Не добавляй пустые bullet «для галочки».

Если verify не выполнился — файл не создавай. Если diff пуст и quality только «нечего проверять», но verify успешен — файл создай; **Code review** во всех подблоках `—`.
