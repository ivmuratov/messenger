# Proposal

## Why

Mobile Storybook (`apps/ui-storybook`, порт 6007) падал при запуске: `ThemeSwitcher` тянет `lucide-react-native` → `react-native-svg`, и при prebundle esbuild брал native-вход `ReactNativeSVG.js` (Fabric), который импортирует `react-native/Libraries/Utilities/codegenNativeComponent` — такого модуля в `react-native-web` нет. Существующий обход (stub + алиасы + `resolveId`-плагин) не срабатывал из-за префиксного алиаса `react-native` → `react-native-web` и лечил симптом, а не причину.

## What Changes

- Mobile runner резолвит platform-файлы `.web.js` приоритетнее `.js` — и в dev prebundle (esbuild), и в `storybook build` (Vite resolver). RN-библиотеки с web-реализацией (`react-native-svg`) берут свой web-вход и не затрагивают native-код.
- Удалён обход для `codegenNativeComponent`: stub `stubs/codegenNativeComponent.ts`, два алиаса на него и `resolveId`-плагин `storybook-rn-codegen-native-component`.
- Stubs для native-only библиотек (`reanimated`, `gesture-handler`, `worklets`, `theme-switch-animation`, `edge-to-edge`, `safe-area-context`) остаются без изменений.

## Capabilities

### New Capabilities

— нет

### Modified Capabilities

- `tooling/storybook`: требование «Рендер mobile stories через react-native-web в ui-storybook» дополняется резолвом `.web.js` в dev и build и запретом stubs для внутренних модулей `react-native/Libraries/*`.

## Impact

- `apps/ui-storybook/.storybook-mobile/main.ts` — константа `RN_WEB_RESOLVE_EXTENSIONS` (`.web.js` + стандартные расширения Vite) в `resolve.extensions` и `optimizeDeps.esbuildOptions.resolveExtensions`; удалены плагин и алиасы `codegenNativeComponent`.
- `apps/ui-storybook/.storybook-mobile/stubs/codegenNativeComponent.ts` — удалён.
- `apps/ui-storybook/package.json` — без изменений (новых зависимостей нет).
- `packages/ui`, `apps/web`, `apps/mobile`, web runner (`.storybook-web/`) — не затрагиваются.

## Non-goals

- Замена stubs native-only библиотек реальными web-реализациями (в т.ч. `react-native-safe-area-context`) и подключение Babel-плагина worklets в Storybook.
- Реальные жесты и анимации `DrawerLayout` в mobile Storybook.
- Поведение при занятых портах 6006/6007 (интерактивный prompt Storybook под `concurrently`).
