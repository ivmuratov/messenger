---
name: review-quality
description: Review diff через subagent quality-reviewer (perf, render, a11y, light security). Use when the user asks for quality review after code changes or /opsx-apply.
disable-model-invocation: true
---
# Review Quality

Используй этот skill, когда **главный (root) агент** выполняет quality review после изменений кода или по явному запросу пользователя (`/review-quality`, «сделай quality review»).

## Только для root-агента

- Если ты **уже** subagent `quality-reviewer` — **не** используй этот skill. Выполни review по `.cursor/agents/quality-reviewer.md`.
- **Не** перечитывай этот skill внутри subagent и **не** запускай вложенный `quality-reviewer`.

## Лимит subagent

- За одну беседу — **не больше 5** запусков subagent суммарно (включая retry). Проектный hook `.cursor/hooks/limitSubagents.mjs` может отклонить лишние.
- Для quality review нужен **ровно один** запуск `quality-reviewer` (плюс максимум **один** retry при ошибке — см. ниже).

Запусти subagent `quality-reviewer` с параметрами:

- `run_in_background: false`, если явно не попросили запуск в фоне
- `description: "Quality Review"`
- `subagent_type: "quality-reviewer"`

Subagent сам вычисляет локальный diff по пути репозитория — **не** вычисляй diff сам перед запуском. Путь репозитория — активный workspace или корень репозитория с кодом, который нужно проверить.

По умолчанию subagent определяет базовую ветку репозитория (например, `main`) при вычислении `branch changes`. В большинстве случаев **не** указывай `Base Branch`. Указывай только если текущую ветку или PR нужно сравнить с конкретной веткой, отличной от default base branch.

Используй точно такой формат промпта:

```text
Full Repository Path: <absolute repository path>
Diff: <one of: "branch changes", "uncommitted changes">
Base Branch: <только если branch changes сравниваются с известной конкретной base branch>
Custom Instructions: <только если пользователь дал особые инструкции для review>
```

По умолчанию — `branch changes`. Для только uncommitted/local изменений — `uncommitted changes`.

## Retry (только root)

Если **единственный** прямой дочерний subagent завершился с ошибкой **до** выдачи findings (verdict/findings), прочитай текст ошибки.

- Если ошибка из-за неверного вызова subagent — исправь invocation и **один** retry.
- Если ошибка «лимит subagent» / `decision: deny` от hook — **не** retry. Сообщи пользователю и остановись.
- При любой другой ошибке subagent — **один** retry с тем же форматом промпта.
- **Не** запускай второй subagent параллельно с первым. **Не** retry, если subagent вернул текст про вложенный subagent или «использую skill review-quality» — это рекурсия, не ошибка diff.

Если после одного retry та же ошибка — остановись. Кратко сообщи пользователю, что review не завершился, и укажи ошибку или blocker.

После завершения subagent резюмируй результат:

- Если diff не найден или пуст — одной фразой сообщи, что review нечего проверять.
- Если issues нет — однострочный статус с verdict **PASS** или **PASS WITH NOTES**.
- Если есть issues — компактная markdown-таблица: одна строка на finding, сортировка по severity (сначала highest), колонки **Severity**, **Location**, **Finding**.

Не исправляй findings и не перезапускай review, пока пользователь явно не попросит.

Для auth, crypto или глубоко security-sensitive изменений дополнительно рекомендуй `/review-security` — quality-reviewer его **не** заменяет.
