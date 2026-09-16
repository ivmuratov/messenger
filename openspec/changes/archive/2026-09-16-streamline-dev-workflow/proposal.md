## Why

Pre-commit запускает `build`, `lint`, `typecheck` и `syncpack:list` параллельно на каждый коммит — это медленно и блокирует локальную работу. Правила testing и commits с `alwaysApply: true` постоянно занимают контекст агента, хотя нужны только при написании тестов или подготовке PR. CI покрывает только Chromatic; полная верификация (build, test, syncpack) не автоматизирована на PR.

## What Changes

- Pre-commit: только `lint` + `typecheck` параллельно через `concurrently --kill-others-on-fail`; убрать `build` и `syncpack:list`
- Новый CI workflow на PR/push: полный verify через `pnpm verify` (параллельно, как локально)
- Root script `pnpm verify` — полный набор проверок параллельно через `concurrently` (`lint`, `typecheck`, `build`, `test`, `syncpack:list`), затем `test:e2e`
- Перенос `.cursor/rules/testing.mdc` → `.cursor/skills/testing/SKILL.md` (on-demand)
- Перенос `.cursor/rules/commits.mdc` → правила внутри `.cursor/skills/prepare-pr/SKILL.md`
- Новый skill `.cursor/skills/prepare-pr/SKILL.md`: ветка от main (если на main), commit по Conventional Commits, push, создание PR через GitHub MCP
- Husky: запрет локальных commit и push в `main`/`master` (pre-commit + pre-push hooks)
- Удаление `.cursor/agents/reviewer.md` (generic review не вписывается в SDD)
- Обновление `openspec/config.yaml`, `.cursor/README.md`

## Capabilities

### New Capabilities

- `tooling/ci`: CI workflow на PR/push с полной верификацией монорепы

### Modified Capabilities

- `tooling/lint-format`: pre-commit MUST запускать `lint` и `typecheck` параллельно через `concurrently`; MUST NOT запускать `build` и `syncpack:list`

## Impact

- **root**: `.husky/pre-commit`, `.husky/pre-push` (новый), `package.json` (+ `verify`), `.github/workflows/ci.yml` (новый)
- **docs**: `openspec/config.yaml`, `.cursor/README.md`
- **`.cursor/`**: удалить `rules/testing.mdc`, `rules/commits.mdc`, `agents/reviewer.md`; создать `skills/testing/SKILL.md`, `skills/prepare-pr/SKILL.md`
- **Chromatic workflow**: без изменений (отдельный paths-filtered workflow)

## Non-goals

- `lint-staged` / affected-only проверки в pre-commit
- `test:e2e` в pre-commit (только CI и `pnpm verify`)
- Перенос `architecture.mdc`, `styling-rules.mdc` и других always-on rules в skills
