---
name: prepare-pr
description: Готовит feature-ветку от main, коммит в формате Conventional Commits с проверкой commitlint, push и pull request через GitHub MCP (если MCP недоступен — gh). Использовать, когда пользователь просит подготовить PR, закоммитить изменения, запушить ветку или открыть pull request.
disable-model-invocation: true
---

# Prepare PR

Тесты, lint и quality review сами не запускать. Если в этом ходе их не было — написать об этом в ответе.

## Guardrails

- NEVER update git config
- NEVER run destructive git commands (`push --force`, `reset --hard`, etc.) unless the user explicitly requests them. NEVER force-push to `main`/`master` — warn if asked
- NEVER skip hooks (`--no-verify`, `--no-gpg-sign`) unless the user explicitly requests it
- NEVER commit or push directly to `main`/`master`
- NEVER `git add -A` or `git add .` — stage only named files
- NEVER create a duplicate PR — сначала проверить открытый PR текущей ветки
- `git commit --amend` только если одновременно: пользователь явно просит, HEAD создан в этой беседе, коммит не запушен. Hook отклонил коммит → новый коммит, не amend

## Шаги

### 1. Ветка

`git branch --show-current`. На `main`/`master` создать ветку и перейти: имя каталога `openspec/changes/<name>` (не `archive/`); несколько активных и неясно, какой про дифф → спросить; иначе kebab-case от scope/subject. `git checkout -b <branch-name>`. Уже на feature-ветке — новую не создавать.

### 2. Сверка с `origin/main`

```bash
git fetch origin main
git status
git diff
git log origin/main...HEAD --oneline
git diff origin/main...HEAD
```

Fetch не удался → локальная `main` и написать об этом в ответе.

- Чисто и `origin/main...HEAD` пуст → стоп, нечего отправлять
- Чисто и коммиты есть → сразу push и PR
- Есть изменения → один коммит, затем push и PR

Посторонние файлы не стейджить и перечислить в ответе. Секреты (`.env`, credentials, ключи, токены) не коммитить; если просят — предупредить и не добавлять.

### 3. Stage и commit

Только если есть незакоммиченные изменения. Файлы по имени: `git add path/to/file1 path/to/file2`.

`<type>(<scope>): <subject>` — scope ровно один; subject imperative, lowercase, без точки; header ≤ 72; body после пустой строки. Несколько пакетов → scope основного, остальные области в body.

| Scope    | Когда |
| -------- | ----- |
| `ui`     | `packages/ui` |
| `core`   | `packages/core` |
| `web`    | `apps/web` |
| `mobile` | `apps/mobile` |
| `docs`   | документация |
| `root`   | корень: tooling, husky, turbo, biome, `apps/ui-storybook`, workspace |

Type: `feat` | `fix` | `docs` | `style` | `refactor` | `test` | `chore` | `ci` | `build` | `perf` | `revert`

В commitlint — точное сообщение, включая body: `printf '%s\n' 'type(scope): subject' '' 'body line' | pnpm exec commitlint`

```bash
git commit -m "$(cat <<'EOF'
type(scope): subject

EOF
)"
git status
```

### 4. Push

`git push -u origin HEAD`. Отклонён → остановиться и сообщить. Не повторять и не делать force-push.

### 5. Pull request

Title — смысл всей ветки относительно `origin/main` (один коммит → его header). Test plan — по фактическим изменениям.

```markdown
## Summary
- ...

## Test plan
- [ ] ...
```

Namespace `project-0-messenger-github`, сначала `GetDynamicTools`. `error` или упавший вызов → сразу `gh`, без `mcp_auth` и без починки сервера. `needsAuth` → один `mcp_auth` и повтор; снова недоступен → `gh`.

MCP: `owner`/`repo` из `git remote get-url origin`, ветка из `git branch --show-current`. Открытый PR — `list_pull_requests` (`state: open`, `head: <owner>:<branch>`). Есть → вернуть `html_url`. Нет → `create_pull_request` (`base: main`, `head`, `title`, `body`).

Иначе тот же title и body:

```bash
gh pr list --head "<branch>" --state open --json url
gh pr create --base main --head "<branch>" --title "..." --body "$(cat <<'EOF'
...
EOF
)"
```

Вернуть URL PR.

## Примеры

✅ `feat(root): add storybook catalog for ui web components`
✅ `test(ui): add useThemeSwitcher hook tests`

❌ `feat: add storybook...` — нет scope
❌ `feat(storybook): ...` — scope не из enum
❌ `feat(ui,web): ...` — больше одного scope
