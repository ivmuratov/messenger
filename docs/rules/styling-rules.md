---
description: Соглашения по стилизации компонентов в packages/ui
globs: "**/*.styles.ts", "**/*.css.ts"
alwaysApply: false
---

# Соглашения по стилизации

## Стилизация React Native

### Паттерн файлов

Мобильные стили находятся в `{Component}/mobile/{Component}.styles.ts`.

### Импорт токенов

Всегда импортируй общие токены из `../tokens` — никогда не хардкодь значения.

```typescript
import { StyleSheet } from "react-native";
import { componentToken } from "../tokens";

export const styles = StyleSheet.create({
  root: componentToken,
});
```

### Правила

- Один `.styles.ts` на компонент — именуй `{Component}.styles.ts`
- Используй `StyleSheet.create()` — никогда inline-стили
- Делись дизайн-значениями через `tokens.ts` (те же токены, что и для web)
- Используй spacingNativeSprinkles из @/sprinkles для spacing-утилит
- Никогда не импортируй из `react-native-web` или любого веб-специфичного пакета
- Предпочитай `flexbox` layout — избегай absolute positioning когда возможно

## Веб-стилизация

### Паттерн файлов

Веб-стили находятся в `{Component}/web/{Component}.css.ts`.

### Импорт токенов

Всегда импортируй общие токены из `../tokens` — никогда не хардкодь значения.

```typescript
import { style } from "@vanilla-extract/css";
import { componentToken } from "../tokens";

export const component = style(componentToken);
```

### Sprinkles

Используй sprinkles для spacing/layout утилит в `packages/ui/src/shared/sprinkles/(web|mobile)/`.

### Правила

- Один `.css.ts` на компонент — именуй `{Component}.css.ts`
- Используй `style()` для компонент-специфичных стилей
- Используй `recipe()` для стилей с вариантами (size, variant пропсы)
- Импортируй theme contract vars через `@vanilla-extract/css` — никогда raw CSS-переменные
- Держи токены платформо-агностичными в `tokens.ts`, потребляй в `.css.ts`
- Экспортируй ссылки на стили, никогда raw CSS-строки
