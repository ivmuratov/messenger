## 1. ui — переезд папок (web и mobile)

- [x] 1.1 Создать `packages/ui/src/components/` и `git mv` в него `ThemeSwitcher`, `Typography` из `atoms/` и `DrawerLayout`, `Flex`, `Page` из `layouts/` (web/ и mobile/ переезжают вместе) — verify: каталогов `src/atoms/` и `src/layouts/` нет, пять папок лежат в `src/components/`
- [x] 1.2 Обновить `packages/ui/src/index.ts` на пути `./components/*/web` — verify: в файле нет `atoms/` и `layouts/`, все пять компонентов реэкспортируются
- [x] 1.3 Обновить `packages/ui/src/index.native.ts` на пути `./components/*/mobile` — verify: в файле нет `atoms/` и `layouts/`, все пять компонентов реэкспортируются
- [x] 1.4 Проверить, что `ThemeProvider/` и `shared/` на месте и внутренние импорты `@/shared/*` не сломались — verify: нет импортов на старые `atoms/` / `layouts/` внутри `packages/ui/src`

## 2. ui — stories (web)

- [x] 2.1 Сменить title пяти stories на `Components/{Component}` (`ThemeSwitcher`, `Typography`, `Flex`, `Page`, `DrawerLayout`) — verify: в `*.stories.tsx` нет `Atoms/` и `Layouts/`
- [x] 2.2 Убедиться, что `ThemeProvider` не добавлен в каталог как отдельная story — verify: нет новой catalog-story для ThemeProvider; decorator в preview без изменений

## 3. root — артефакты архитектуры @ui

- [x] 3.1 Переписать иерархию и правила импортов в `.cursor/rules/architecture.mdc` на `ThemeProvider` → `components` → `shared`, соседи без циклов — verify: в файле нет действующих правил atoms/molecules/layouts
- [x] 3.2 Обновить `openspec/config.yaml` (context packages/ui) под ту же структуру и граф импортов — verify: в context нет Atomic Design как актуальной иерархии
- [x] 3.3 Обновить корневой `README.md` и `.cursor/agents/researcher.md` — verify: `@ui` описан как компонентный пакет, не Atomic Design
- [x] 3.4 Grep живых путей `atoms/`, `layouts/`, `Atomic Design` (исключить `openspec/changes/archive`) — verify: совпадения только в исторических архивах или в delta/main-спеках до archive

## 4. Проверка потребителей (web, mobile, storybook)

- [x] 4.1 `pnpm --filter @ui lint && pnpm --filter @ui typecheck && pnpm --filter @ui test` — verify: команды завершаются успешно
- [x] 4.2 Проверить `apps/web` и `apps/mobile`: импорты по-прежнему `from "@ui"` — verify: нет глубоких путей в `atoms/` / `layouts/` / `components/`
- [x] 4.3 Smoke `pnpm storybook` — verify: sidebar показывает `Components/*` для пяти компонентов, stories рендерятся
