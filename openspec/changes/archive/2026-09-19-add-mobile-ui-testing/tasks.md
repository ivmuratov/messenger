## 1. apps/ui-storybook — два конфига

- [x] 1.1 Зависимости `react-native-web`, `react-native`, `lucide-react-native` в `apps/ui-storybook/package.json`
- [x] 1.2 `.storybook-web/`: glob `*/web/*.stories.tsx`, web `ThemeProvider` из `@ui`, VE — verify: `pnpm --filter ui-storybook build:web`
- [x] 1.3 `.storybook-mobile/`: glob `*/mobile/*.stories.tsx`, RN-web aliases, stubs, mobile `ThemeProvider` из `@ui` (condition `react-native`) — verify: `pnpm --filter ui-storybook build:mobile`
- [x] 1.4 Удалить unified `.storybook/` и `parameters.platform` из mobile stories — verify: нет импортов `packages/ui/src` в preview

## 2. packages/ui mobile stories

- [x] 2.1–2.6 Mobile stories для Typography, DrawerLayout, Flex, Page, ThemeSwitcher; `tsconfig.stories.json` — verify: `pnpm --filter @ui typecheck`

## 3. Chromatic и CI

- [x] 3.1 Path filter `packages/ui/src/**/mobile/**` в `chromatic.yml`
- [x] 3.2 Ненулевой exit code при непринятых changes (без `--exit-zero-on-changes`)
- [x] 3.3 README: два конфига, два Chromatic project, RN-web границы
- [x] 3.4 Два GitHub secrets и успешный CI run с `dist-web` + `dist-mobile` — verify: `CHROMATIC_PROJECT_TOKEN_MOBILE` настроен в repo

## 4. Документация и OpenSpec

- [x] 4.1 `.cursor/skills/testing/SKILL.md` — два конфига
- [x] 4.2 `syncpack.config.ts`
- [x] 4.3 Revise `openspec/changes/add-mobile-ui-testing/*` под два конфига
- [x] 4.4 `pnpm --filter ui-storybook lint && pnpm --filter ui-storybook typecheck && pnpm build-storybook`
