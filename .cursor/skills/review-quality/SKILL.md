---
name: review-quality
description: Review diff через subagent quality-reviewer (perf, render, a11y, light security). Use when the user asks for quality review after code changes or /opsx-apply.
---
# Review Quality

Используй этот skill, когда пользователь просит quality review после изменений кода или `/opsx-apply`.

Запусти ровно один subagent `quality-reviewer` с параметрами:

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

Если subagent завершился с ошибкой до выдачи findings, прочитай текст ошибки.

- Если ошибка из-за неверного вызова subagent — исправь invocation и сразу повтори один раз.
- При любой другой ошибке subagent — повтори один раз с тем же форматом промпта.
- Если после повтора та же ошибка — остановись. Кратко сообщи пользователю, что review не завершился, и укажи ошибку или blocker.

После завершения subagent резюмируй результат:

- Если diff не найден или пуст — одной фразой сообщи, что review нечего проверять.
- Если issues нет — однострочный статус с verdict **PASS** или **PASS WITH NOTES**.
- Если есть issues — компактная markdown-таблица: одна строка на finding, сортировка по severity (сначала highest), колонки **Severity**, **Location**, **Finding**.

Не исправляй findings и не перезапускай review, пока пользователь явно не попросит.

Для auth, crypto или глубоко security-sensitive изменений дополнительно рекомендуй `/review-security` — quality-reviewer его **не** заменяет.
