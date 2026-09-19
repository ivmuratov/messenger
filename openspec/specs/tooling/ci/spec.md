# ci Specification

## Purpose

Автоматическая верификация монорепозитория на PR и push: полный набор проверок качества кода, который не входит в быстрый pre-commit hook.

## Requirements

### Requirement: CI workflow на PR и push

Монорепозиторий MUST иметь GitHub Actions workflow, запускающийся на `pull_request` и `push` в `main`. Workflow MUST выполнять `pnpm verify` после установки Playwright browsers. Script `verify` MUST запускать `lint`, `typecheck`, `syncpack:list`, `build` и `test` параллельно через `concurrently --kill-others-on-fail`, затем `test:e2e` последовательно. Workflow MUST NOT заменять существующий Chromatic workflow.

#### Scenario: CI на pull request

- **WHEN** открывается или обновляется pull request
- **THEN** CI workflow MUST запускаться и выполнять полный набор verify-команд
- **AND** workflow MUST завершаться с ненулевым кодом при падении любой команды

#### Scenario: CI на push в main

- **WHEN** выполняется push в ветку `main`
- **THEN** CI workflow MUST запускаться с тем же набором verify-команд

#### Scenario: Web e2e в CI

- **WHEN** CI workflow выполняет `pnpm test:e2e`
- **THEN** Playwright MUST запускать e2e-тесты для `apps/web`
- **AND** browsers MUST быть установлены до запуска (например, `playwright install --with-deps chromium`)

#### Scenario: Chromatic остаётся отдельным

- **WHEN** изменяются только paths, покрытые `.github/workflows/chromatic.yml`
- **THEN** Chromatic workflow MUST продолжать работать независимо от CI workflow
- **AND** CI workflow MUST также запускаться на PR (без paths-filter, если не указано иное)

### Requirement: Локальная защита ветки main

Монорепозиторий MUST блокировать локальные commit и push в `main`/`master` через Husky hooks. Pre-commit MUST отклонять commit, если текущая ветка — `main` или `master`. Pre-push MUST отклонять push, если целевой remote ref — `refs/heads/main` или `refs/heads/master`.

#### Scenario: Commit на main отклонён

- **WHEN** разработчик на ветке `main` выполняет `git commit`
- **THEN** pre-commit hook MUST завершиться с ненулевым кодом
- **AND** commit MUST NOT быть создан

#### Scenario: Push в main отклонён

- **WHEN** разработчик выполняет `git push origin main` (или push в `master`)
- **THEN** pre-push hook MUST завершиться с ненулевым кодом
- **AND** push MUST NOT быть выполнен

#### Scenario: Commit и push на feature-ветке разрешены

- **WHEN** разработчик на ветке `feat/add-auth` выполняет commit и `git push -u origin HEAD`
- **THEN** pre-commit и pre-push hooks MUST NOT блокировать операцию (при прохождении lint/typecheck)

### Requirement: Локальная команда verify

Root `package.json` MUST предоставлять script `verify`, выполняющий тот же набор проверок, что и CI: `lint`, `typecheck`, `build`, `test`, `test:e2e`, `syncpack:list`.

#### Scenario: Запуск verify из корня

- **WHEN** разработчик выполняет `pnpm verify` из корня монорепы
- **THEN** lint, typecheck, syncpack:list, build и test MUST запускаться параллельно через `concurrently --kill-others-on-fail`
- **AND** test:e2e MUST запускаться после успешного завершения параллельной фазы
- **AND** команда завершается с ненулевым кодом при падении любого шага

#### Scenario: CI использует тот же verify

- **WHEN** CI workflow выполняет verify после `pnpm install` и установки Playwright browsers
- **THEN** MUST вызываться `pnpm verify`, а не дублировать отдельные последовательные шаги

### Requirement: Chromatic запускается при изменениях mobile UI

Существующий workflow `.github/workflows/chromatic.yml` MUST учитывать изменения mobile stories и mobile-реализаций компонентов `@ui`. Path filter MUST содержать `packages/ui/src/**/mobile/**` для `pull_request` и `push` в `main`. Workflow MUST выполнять **два** static build Storybook (`dist-web` и `dist-mobile`) и **два** upload в Chromatic с секретами `CHROMATIC_PROJECT_TOKEN` (web) и `CHROMATIC_PROJECT_TOKEN_MOBILE` (mobile). MUST NOT требоваться отдельный third-party mobile e2e job.

#### Scenario: Изменение mobile-компонента запускает Chromatic

- **WHEN** pull request изменяет файл в `packages/ui/src/components/DrawerLayout/mobile/`
- **THEN** Chromatic workflow MUST быть eligible к запуску

#### Scenario: Изменение mobile story запускает Chromatic

- **WHEN** pull request или push в `main` изменяет `packages/ui/src/components/Flex/mobile/Flex.stories.tsx`
- **THEN** Chromatic workflow MUST быть eligible к запуску

#### Scenario: Mobile upload использует отдельный project token

- **WHEN** CI выполняет шаг Chromatic для mobile build
- **THEN** MUST использоваться `CHROMATIC_PROJECT_TOKEN_MOBILE`
- **AND** storybook build dir MUST быть `dist-mobile`
