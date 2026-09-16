## 1. root (syncpack)

- [x] 1.1 Добавить `@storybook/addon-a11y` и `@storybook/addon-themes` в группу Storybook в `syncpack.config.ts` — verify: `pnpm syncpack:list` без mismatch после установки addons

## 2. apps/ui-storybook (addons)

- [x] 2.1 Установить `@storybook/addon-a11y@10.6.0` и `@storybook/addon-themes@10.6.0` в `apps/ui-storybook/package.json`, зарегистрировать в `.storybook/main.ts` — verify: `pnpm install` успешен; `main.ts` содержит оба addon
- [x] 2.2 Обновить `.storybook/preview.tsx`: themes toolbar (light/dark) синхронизирован с `ThemeProvider`; `parameters.a11y`; `initialGlobals.theme = 'light'` — verify: `pnpm storybook` — toolbar переключает тему, Typography меняет VE-токены
- [x] 2.3 Smoke a11y panel на story Typography — verify: в Storybook dev открывается панель Accessibility без ошибок конфигурации
- [x] 2.4 `pnpm build-storybook` — verify: static build успешен

## 3. packages/ui (stories, опционально)

- [x] 3.1 При необходимости: dark variant для Typography или ThemeSwitcher story (`globals.theme = 'dark'`) без ломания Chromatic default — verify: default story snapshot остаётся light; dark variant переключается в dev

## 4. root (.cursor — quality-reviewer)

- [x] 4.1 Создать `.cursor/agents/quality-reviewer.md` (`readonly: true`, negative scope arch rules, focus security/perf/render/a11y web+RN) — verify: файл с frontmatter `name: quality-reviewer`
- [x] 4.2 Создать `.cursor/skills/review-quality/SKILL.md` (Task launch, diff branch changes, output table + verdict) — verify: skill описывает subagent_type и формат вывода
- [x] 4.3 Обновить `.cursor/README.md`: quality-reviewer + review-quality; отличие от review-security — verify: README перечисляет agent

## 5. root (docs / config)

- [x] 5.1 Обновить `.cursor/skills/testing/SKILL.md`: Storybook a11y addon + themes toolbar — verify: секция Storybook упоминает a11y panel
- [x] 5.2 Обновить `openspec/config.yaml`: verification/guidance для review-quality после apply — verify: config содержит упоминание review-quality
- [x] 5.3 Обновить `apps/ui-storybook/README.md`: a11y panel и themes toolbar — verify: README описывает новые возможности

## 6. Финальная верификация

- [x] 6.1 `pnpm lint && pnpm typecheck && pnpm syncpack:list` — verify: все green
- [x] 6.2 `pnpm build-storybook` — verify: build с addons успешен
