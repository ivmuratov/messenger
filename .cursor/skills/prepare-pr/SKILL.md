---
name: prepare-pr
description: Prepare branch, commit, push, and open a PR — feature branch from main, Conventional Commits, commitlint validation, GitHub MCP. Use when the user asks to prepare a PR, commit changes, push a branch, or open a pull request.
disable-model-invocation: true
---

# Prepare PR

Подготовка ветки, коммита, push и создание pull request через GitHub MCP.

## Guardrails

- NEVER update git config
- NEVER run destructive git commands (`push --force`, `reset --hard`, etc.) unless the user explicitly requests them
- NEVER skip hooks (`--no-verify`, `--no-gpg-sign`, etc.) unless the user explicitly requests it
- NEVER force-push to `main`/`master`; warn the user if they request it
- NEVER commit or push directly to `main`/`master`
- NEVER use `git add -A` or `git add .` — stage only explicitly named files
- Avoid `git commit --amend` unless the user explicitly requests it and HEAD was not pushed
- NEVER create duplicate PR — проверить открытый PR для текущей ветки перед `create_pull_request`

## Шаги

### 1. Проверить ветку

```bash
git branch --show-current
```

- На `main` или `master` → создать feature-ветку:
  - приоритет: имя OpenSpec change (если есть)
  - иначе: kebab-case от scope/subject изменений
  - `git checkout -b <branch-name>`
- На feature-ветке → не создавать новую ветку

### 2. Проанализировать изменения

Параллельно:

```bash
git status
git diff
git log -5 --oneline
git log main...HEAD --oneline
git diff main...HEAD
```

### 3. Stage

Добавить только релевантные файлы по имени:

```bash
git add path/to/file1 path/to/file2
```

Не коммитить секреты (`.env`, credentials). Предупредить, если пользователь просит их закоммитить.

### 4. Commit (Conventional Commits)

Формат: `<type>(<scope>): <subject>`

- **scope обязателен** — всегда в скобках сразу после type
- **subject** — одна короткая фраза, imperative, lowercase, без точки в конце
- **header ≤ 72 символов**
- Подробности — только в body (пустая строка после header)

| Scope    | Когда |
| -------- | ----- |
| `ui`     | `packages/ui` |
| `core`   | `packages/core` |
| `web`    | `apps/web` |
| `mobile` | `apps/mobile` |
| `docs`   | документация |
| `root`   | корень: tooling, husky, turbo, biome, `apps/ui-storybook`, workspace |

Type: `feat` | `fix` | `docs` | `style` | `refactor` | `test` | `chore` | `ci` | `build` | `perf` | `revert`

Проверить сообщение:

```bash
echo "type(scope): subject" | pnpm exec commitlint
```

Коммит:

```bash
git commit -m "$(cat <<'EOF'
type(scope): subject

EOF
)"
```

### 5. Push

```bash
git push -u origin HEAD
```

### 6. Create pull request (GitHub MCP)

Использовать namespace `project-0-messenger-github`. Сначала `GetDynamicTools` для схемы инструментов.

1. Определить `owner`/`repo` из `git remote get-url origin`
2. Текущая ветка: `git branch --show-current`
3. Проверить существующий PR: `list_pull_requests` с `state: open`, `head: <owner>:<branch>` (или head filter по ветке)
4. Если PR уже есть → вернуть `html_url`, не создавать новый
5. Сформировать title (из последнего commit header или summary изменений) и body:

```markdown
## Summary
- ...

## Test plan
- [ ] ...
```

6. `create_pull_request`: `base: main`, `head: <branch>`, `title`, `body`
7. Вернуть URL PR пользователю

Fallback: если MCP недоступен — `gh pr create --title "..." --body "$(cat <<'EOF' ... EOF)"` после push.

## Примеры

✅ `feat(root): add storybook catalog for ui web components`
✅ `chore(root): migrate from eslint and prettier to biome`
✅ `test(ui): add useThemeSwitcher hook tests`

❌ `feat: add storybook...` — нет scope
❌ `feat(storybook): ...` — scope не из enum
