# ui-storybook

Storybook-каталог web-компонентов `@ui` и visual regression через [Chromatic](https://www.chromatic.com/).

Stories colocated в `packages/ui/src/**/web/*.stories.tsx`; static build — `dist/`.

## Команды

Из корня монорепы:

```bash
pnpm storybook          # dev-сервер
pnpm build-storybook    # static build → dist/
pnpm chromatic          # build + upload в Chromatic
```

## Chromatic

Chromatic сравнивает visual snapshots stories при изменениях в PR и на `main`. Baselines хранятся в облаке Chromatic.

### Настройка

1. Создайте проект на [chromatic.com](https://www.chromatic.com/) и получите **Project token**.
2. **GitHub (CI):** добавьте секрет `CHROMATIC_PROJECT_TOKEN` в Settings → Secrets and variables → Actions.
3. **Локально:** добавьте token в `.env` (см. `.env.example` в корне):

   ```bash
   CHROMATIC_PROJECT_TOKEN=chpt_...
   ```

### Review flow

1. PR с visual changes → Chromatic bot публикует ссылку на build в комментарии PR.
2. Reviewer принимает или отклоняет изменения в [Chromatic UI](https://www.chromatic.com/).
3. После accept — merge или re-run CI.

Первый успешный run на `main` создаёт initial baseline для всех stories.
