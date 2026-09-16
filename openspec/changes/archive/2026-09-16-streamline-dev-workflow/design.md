## Context

См. proposal.md — Why. Текущий pre-commit (`.husky/pre-commit`) запускает четыре команды через `concurrently`: `build`, `lint`, `typecheck`, `syncpack:list`. CI ограничен Chromatic (paths-filtered). Правила `testing.mdc` и `commits.mdc` — `alwaysApply: true`. Агент `reviewer.md` дублирует architecture rules без SDD-контекста.

## Goals / Non-Goals

**Goals:**

- Ускорить pre-commit: только быстрые проверки (`lint` + `typecheck`) параллельно
- Перенести тяжёлые проверки (`build`, `test`, `test:e2e`, `syncpack`) в CI и `pnpm verify`
- Разгрузить контекст агента: testing/commits → on-demand skills
- Skill `prepare-pr` для SDD workflow: ветка → commit → push → PR (GitHub MCP)
- Запретить локальные commit и push в `main`/`master` через Husky hooks

**Non-Goals:**

- `lint-staged`, affected-only turbo filters
- `test:e2e` в pre-commit
- Перенос других always-on rules (`architecture`, `styling-rules`) в skills

## Decisions

### 1. Pre-commit: branch guard + concurrently lint + typecheck

**Решение:** `.husky/pre-commit` сначала проверяет текущую ветку; при `main` или `master` — exit 1 с сообщением. Затем `concurrently --kill-others-on-fail` для двух команд:

```bash
branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
  echo "Commits to $branch are not allowed. Create a feature branch first."
  exit 1
fi

pnpm exec concurrently --kill-others-on-fail \
  "pnpm lint" \
  "pnpm typecheck"
```

**Owner:** root (`.husky/pre-commit`)

**Альтернатива:** последовательный `pnpm lint && pnpm typecheck` — отклонено: пользователь явно хочет параллельный запуск.

**Альтернатива:** оставить `build` в pre-commit — отклонено: Storybook static build слишком тяжёлый для каждого коммита.

### 2. CI workflow: `.github/workflows/ci.yml`

**Решение:** отдельный workflow без paths-filter, на `pull_request` и `push` → `main`. Шаги: checkout, pnpm, node 22, `pnpm install --frozen-lockfile`, установка Playwright browsers (`pnpm exec playwright install --with-deps chromium` в `apps/web`), затем `pnpm verify` — тот же параллельный набор, что и локально.

**Альтернатива:** последовательные шаги lint → typecheck → … — отклонено: пользователь хочет параллельный verify и единый script локально/в CI.

**Owner:** root (`.github/workflows/ci.yml`), web e2e (`apps/web/playwright.config.ts` уже поддерживает `CI` через `reuseExistingServer: !process.env.CI`)

**Альтернатива:** один mega-workflow с Chromatic — отклонено: Chromatic требует secret и paths-filter; смешивание усложнит конфигурацию.

**Альтернатива:** отдельный e2e workflow — отклонено: пользователь хочет e2e в общем CI verify.

### 3. Rules → Skills

**Решение:**

| Было | Станет |
|------|--------|
| `.cursor/rules/testing.mdc` | `.cursor/skills/testing/SKILL.md` |
| `.cursor/rules/commits.mdc` | правила внутри `.cursor/skills/prepare-pr/SKILL.md` |

Skills без `disable-model-invocation` для testing (auto-invoke по description); `prepare-pr` — с `disable-model-invocation: true` (git ops только явно).

**Owner:** root (`.cursor/`)

### 4. Skill prepare-pr

**Решение:**

- На `main`/`master` → `git checkout -b <name>` (приоритет: OpenSpec change name, иначе kebab от scope/subject)
- На feature-ветке → не создавать новую
- Stage только именованные файлы (без `git add -A`)
- Commit: Conventional Commits + `pnpm exec commitlint`
- Push: `git push -u origin HEAD`
- PR: GitHub MCP (`project-0-messenger-github` → `create_pull_request`); перед созданием проверить открытый PR через `list_pull_requests` (head = текущая ветка)

**Owner:** root (`.cursor/skills/prepare-pr/SKILL.md`)

### 4b. Параллельный verify

**Решение:** root script `verify` — фаза 1 параллельно через `concurrently --kill-others-on-fail`: `lint`, `typecheck`, `syncpack:list`, `build`, `test`; фаза 2 последовательно: `test:e2e` (Playwright поднимает dev server, не конкурирует с build).

```bash
pnpm exec concurrently --kill-others-on-fail \
  "pnpm lint" \
  "pnpm typecheck" \
  "pnpm syncpack:list" \
  "pnpm build" \
  "pnpm test" \
&& pnpm test:e2e
```

CI вызывает `pnpm verify` после установки Playwright browsers — один источник правды.

**Owner:** root (`package.json`, `.github/workflows/ci.yml`)

**Альтернатива:** полный parallel включая e2e — отклонено: риск contention CPU/RAM и конфликта dev server.

### 5. Удаление reviewer agent

**Решение:** удалить `.cursor/agents/reviewer.md`. Generic review заменяется SDD verify (tasks + CI) и опционально Bugbot на PR.

**Owner:** root (`.cursor/agents/`)

### 6. Pre-push: запрет push в main

**Решение:** новый `.husky/pre-push` отклоняет push, если remote ref — `main` или `master` (локальный `git push origin main` и аналоги). Merge в main через PR на GitHub остаётся единственным путём.

```bash
while read -r local_ref local_sha remote_ref remote_sha; do
  if [ "$remote_ref" = "refs/heads/main" ] || [ "$remote_ref" = "refs/heads/master" ]; then
    echo "Direct push to main/master is not allowed. Use a feature branch and open a PR."
    exit 1
  fi
done
```

**Owner:** root (`.husky/pre-push`)

**Альтернатива:** только pre-commit guard — отклонено: не блокирует `git push origin main` с feature-ветки, если кто-то force-push или push main directly.

### 7. openspec/config.yaml

**Решение:** обновить ссылки на skills, pre-commit состав, CI workflow; добавить в `operations.apply.guidance` указатель на testing skill при тестовых tasks.

**Owner:** root (`openspec/config.yaml`)

## Risks / Trade-offs

| Риск | Mitigation |
|------|------------|
| Broken build попадёт в main без локального pre-commit build | CI `pnpm build` на PR; `pnpm verify` для локальной проверки |
| Агент забудет testing conventions без always-on rule | Хороший `description` у skill + guidance в config.yaml |
| Два workflow на PR (CI + Chromatic) | Нормально; Chromatic paths-filtered, CI — полный verify |
| CI дольше из‑за Playwright e2e | Только на PR/push, не в pre-commit; `playwright.config.ts` поднимает vite dev server |
| concurrently маскирует ошибку одной из команд | `--kill-others-on-fail` останавливает остальные при падении |
| Husky hooks обходятся через `--no-verify` | Документировать в prepare-pr skill: never skip hooks; server-side branch protection — future enhancement |

## Migration Plan

1. Добавить CI workflow и `pnpm verify` (безопасно — не ломает локальную работу)
2. Упростить pre-commit
3. Создать skills, удалить rules и reviewer
4. Обновить config.yaml и README
5. Archive change → main specs обновятся

Rollback: вернуть старый pre-commit из git history; удалить ci.yml.
