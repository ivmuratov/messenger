## 1. CI и verify

- [x] 1.1 Добавить script `verify` в root `package.json`: параллельно `lint`, `typecheck`, `syncpack:list`, `build`, `test` через `concurrently`, затем `test:e2e` — verify: `pnpm verify` завершается успешно
- [x] 1.2 Создать `.github/workflows/ci.yml`: trigger на `pull_request` и `push` → `main`; install + Playwright browsers + `pnpm verify` — verify: workflow вызывает `pnpm verify`, не дублирует отдельные шаги
- [x] 1.3 Убедиться, что `.github/workflows/chromatic.yml` не изменён — verify: Chromatic workflow на месте с paths-filter

## 2. Husky hooks

- [x] 2.1 Обновить `.husky/pre-commit`: guard на `main`/`master` + `concurrently --kill-others-on-fail` для `pnpm lint` и `pnpm typecheck`; убрать `build` и `syncpack:list` — verify: `grep -E 'build|syncpack' .husky/pre-commit` пуст; hook содержит проверку ветки и concurrently
- [x] 2.2 Создать `.husky/pre-push`: отклонять push в `refs/heads/main` и `refs/heads/master` — verify: `git push origin main` (dry-run или на тестовом remote) завершается с ошибкой hook

## 3. Skills (testing, prepare-pr)

- [x] 3.1 Создать `.cursor/skills/testing/SKILL.md` с содержимым из `testing.mdc` и description для auto-invoke (vitest, playwright, `__tests__/`, OpenSpec test tasks) — verify: файл существует, frontmatter содержит `name: testing`
- [x] 3.2 Создать `.cursor/skills/prepare-pr/SKILL.md`: branch от main, commit по Conventional Commits (правила из `commits.mdc`), push, PR через GitHub MCP; `disable-model-invocation: true` — verify: guardrails включают no `git add -A`, no force-push, no commit/push to main, no `--no-verify`; commitlint validation; шаг create_pull_request
- [x] 3.3 Удалить `.cursor/rules/testing.mdc` и `.cursor/rules/commits.mdc` — verify: файлы отсутствуют

## 4. Agents и документация

- [x] 4.1 Удалить `.cursor/agents/reviewer.md` — verify: файл отсутствует
- [x] 4.2 Обновить `.cursor/README.md`: skills testing/prepare-pr; убрать testing.mdc, commits.mdc, reviewer — verify: README не ссылается на удалённые файлы
- [x] 4.3 Обновить `openspec/config.yaml`: ссылка на testing skill; pre-commit = lint + typecheck (concurrently); CI workflow; `operations.apply.guidance` — указатель на testing skill — verify: `grep testing.mdc openspec/config.yaml` пуст; pre-commit описан корректно

## 5. Финальная проверка

- [x] 5.1 Запустить `pnpm lint && pnpm typecheck` — verify: успешно
- [x] 5.2 Запустить `pnpm verify` — verify: успешно
- [x] 5.3 Запустить `openspec validate streamline-dev-workflow --strict` — verify: без ошибок

## 6. Ревизия: параллельный verify и PR в prepare-pr

- [x] 6.1 Обновить `verify` в `package.json`: `concurrently` для lint/typecheck/syncpack/build/test, затем test:e2e — verify: script содержит concurrently и test:e2e после `&&`
- [x] 6.2 Упростить `.github/workflows/ci.yml`: один шаг `pnpm verify` после Playwright install — verify: нет отдельных sequential steps lint/typecheck/...
- [x] 6.3 Обновить `.cursor/skills/prepare-pr/SKILL.md`: шаг 6 — PR через GitHub MCP (`create_pull_request`, проверка через `list_pull_requests`) — verify: skill описывает MCP namespace и guardrail «не дублировать PR»
- [x] 6.4 Синхронизировать OpenSpec artifacts (proposal, design, ci spec) и `.cursor/README.md` — verify: `openspec validate streamline-dev-workflow --strict`
