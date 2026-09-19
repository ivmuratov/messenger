## ADDED Requirements

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
