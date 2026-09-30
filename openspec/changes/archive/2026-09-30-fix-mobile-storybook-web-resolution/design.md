# Design

## Context

Мотивация — см. `proposal.md` (Why).

- `react-native-svg` 15.15.4 не имеет поля `exports`; Vite берёт `module` → `lib/module/index.js`, который делает относительный `export * from './ReactNativeSVG'`. Рядом лежат `ReactNativeSVG.js` (native, импортирует `./fabric` → `codegenNativeComponent`, `TurboModuleRegistry`) и `ReactNativeSVG.web.js` (импортирует только `./xml`, `./elements` → `elements.web.js`, `./deprecated`, утилиты).
- В dev Vite prebundle'ит зависимости через esbuild: bare-импорты резолвит Vite-resolver (с алиасами), а относительные импорты внутри пакета — сам esbuild по `resolveExtensions` (по умолчанию `.tsx,.ts,.jsx,.js,.css,.json`, без `.web.js`).
- В `storybook build` prebundle нет; всё резолвит Vite по `resolve.extensions`.
- Алиас-строка `"react-native": "react-native-web"` в Vite матчит и подпути (`react-native/...` → `react-native-web/...`), поэтому stub для `react-native/Libraries/Utilities/codegenNativeComponent` за ним не срабатывал.
- Web-путь `react-native-svg` использует из `react-native` только `unstable_createElement`, `Platform`, `StyleSheet`, `PixelRatio`, `Touchable` — всё есть в `react-native-web` 0.21.2.

## Goals / Non-Goals

**Goals:**

- Один механизм выбора web-реализации RN-библиотек, одинаковый для dev и build mobile runner.
- Минимальный конфиг без обходов для внутренних модулей `react-native`.

**Non-Goals:**

- Пересмотр stubs native-only библиотек (см. Decisions → «Stubs native-only библиотек остаются»).
- Изменения web runner (`.storybook-web/`) и `@ui`.

## Decisions

### Резолв `.web.js` вместо stub для `codegenNativeComponent`

**Владелец:** `apps/ui-storybook` (`.storybook-mobile/main.ts`).

Mobile runner ставит `.web.js` перед стандартным списком расширений Vite (`.mjs`, `.js`, `.mts`, `.ts`, `.jsx`, `.tsx`, `.json`). Библиотека сама выбирает web-вход, native-код (`fabric`, `TurboModuleRegistry`) в граф не попадает.

Альтернативы:

- Stub `codegenNativeComponent` + regex-алиасы + `resolveId`-плагин + `esbuildOptions.alias` — чинит один модуль, но native-вход `react-native-svg` тянет и другие отсутствующие в RN-web экспорты (`TurboModuleRegistry`); конфиг разрастается на каждую такую библиотеку.
- Полный набор `.web.{mjs,mts,ts,jsx,tsx}` — избыточен: зависимости резолвятся в скомпилированный JS (`main`/`module`, поле `react-native` Vite не читает), а в `packages/ui/src` нет `*.web.*` (платформы разделены каталогами `web/` и `mobile/`).

### Одна константа в двух местах конфига

**Владелец:** `apps/ui-storybook`.

`RN_WEB_RESOLVE_EXTENSIONS` передаётся в `resolve.extensions` (build и непребандленный код) и в `optimizeDeps.esbuildOptions.resolveExtensions` (dev prebundle). Без первого `build:mobile` и Chromatic снова возьмут native-вход; без второго сломается `dev:mobile`.

### Stubs native-only библиотек остаются

**Владелец:** `apps/ui-storybook` (`.storybook-mobile/stubs/`).

- `react-native-edge-to-edge`, `react-native-theme-switch-animation` — статически импортируют `TurboModuleRegistry`, которого нет в RN-web; esbuild упадёт на `No matching export`.
- `react-native-reanimated`, `react-native-gesture-handler`, `react-native-worklets` — web поддерживают, но worklets и `useAnimatedStyle` без deps требуют Babel-плагина worklets в Vite; stubs дают детерминированный статический рендер для Chromatic.
- `react-native-safe-area-context` — имеет web-реализацию, но замена требует объявить зависимость в `apps/ui-storybook` и может сдвинуть mobile baselines; вынесено за рамки change.

### Влияние на UI-слои

- web (`.css.ts`): не затрагивается.
- mobile (`.styles.ts`): не затрагивается; меняется только резолв зависимостей в mobile runner.

## Risks / Trade-offs

- [Зависимость с `.web.mjs` / `.web.ts` будет резолвиться в native-вход] → проявится той же ошибкой резолва native-модуля; добавить расширение в `RN_WEB_RESOLVE_EXTENSIONS`.
- [Алиас `react-native` остаётся префиксным] → глубокие импорты `react-native/...` из новых зависимостей не будут замаскированы и упадут явно; это ожидаемый сигнал, что библиотеке нужен web-вход или stub целиком.
- [Кэш prebundle со старым конфигом] → хэш optimizer включает `optimizeDeps`/`resolve`, кэш инвалидируется; при сомнениях — `storybook dev --no-cache`.
