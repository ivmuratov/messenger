# Tasks

## 1. apps/ui-storybook — mobile runner

- [x] 1.1 Добавить `RN_WEB_RESOLVE_EXTENSIONS` (`.web.js` + стандартные расширения Vite) в `resolve.extensions` и `optimizeDeps.esbuildOptions.resolveExtensions` в `.storybook-mobile/main.ts` — verify: `pnpm --filter ui-storybook dev:mobile` стартует, mobile story ThemeSwitcher показывает иконку
- [x] 1.2 Удалить `resolveId`-плагин `storybook-rn-codegen-native-component` и алиасы `react-native/Libraries/Utilities/codegenNativeComponent`, `react-native-web/Libraries/Utilities/codegenNativeComponent` — verify: в `.storybook-mobile/` нет упоминаний `codegenNativeComponent`
- [x] 1.3 Удалить `stubs/codegenNativeComponent.ts` — verify: файла нет, `pnpm --filter ui-storybook lint && pnpm --filter ui-storybook typecheck`

## 2. Интеграция

- [x] 2.1 Статическая mobile-сборка с web-входом `react-native-svg` — verify: `pnpm --filter ui-storybook build:mobile` завершается успешно
