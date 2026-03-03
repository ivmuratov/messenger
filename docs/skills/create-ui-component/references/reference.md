# Справочник по стилизации

## Когда что использовать

| Задача                                      | Web                  | Mobile                     | Расположение                        |
| ------------------------------------------- | -------------------- | -------------------------- | ----------------------------------- |
| Простой компонент, без вариантов            | `style()`            | `StyleSheet.create()`      | `{Component}.css.ts` / `.styles.ts` |
| Компонент с вариантами (size, color и т.д.) | `recipe()`           | `nativeRecipe()`           | `{Component}.css.ts` / `.styles.ts` |
| Маппинг токен-значений в стили              | `styleVariants()`    | `nativeVariants()`         | Inline или отдельный файл           |
| Spacing-утилиты (m, p, gap)                 | `spacingSprinkles()` | `spacingNativeSprinkles()` | `@/sprinkles`                       |
| Тема-aware цвета (light/dark)               | CSS vars (contract)  | `useThemedNativeStyles()`  | `@/themes`                          |
| Общие дизайн-значения                       | tokens               | tokens                     | `tokens.ts`                         |

---

## Токены — когда выносить

**Выноси в `tokens.ts`, когда:**

- Значение общее для web и mobile
- Значение представляет шкалу дизайн-системы (spacing, typography, colors)
- Значение используется в нескольких местах компонента
- Значение может меняться в зависимости от темы

**Оставляй inline, когда:**

- Одноразовое структурное значение (например, `display: "flex"`)
- Платформо-специфичное значение, отличающееся для web и mobile

```typescript
// tokens.ts — общие значения
export const buttonToken = {
  borderRadius: 8,
  minHeight: 44,
} as const;

// Хорошо: значения дизайн-системы в токенах
export const buttonSizeToken = {
  sm: { padding: 8, fontSize: 14 },
  md: { padding: 12, fontSize: 16 },
  lg: { padding: 16, fontSize: 18 },
} as const;
```

---

## Простые стили — без вариантов

**Web** — `style()` из `@vanilla-extract/css`:

```typescript
// web/{Component}.css.ts
import { style } from "@vanilla-extract/css";
import { componentToken } from "../tokens";

export const componentStyles = style({
  ...componentToken,
  display: "flex", // структурное, не в токенах
});
```

**Mobile** — `StyleSheet.create()`:

```typescript
// mobile/{Component}.styles.ts
import { StyleSheet } from "react-native";
import { componentToken } from "../tokens";

export const styles = StyleSheet.create({
  root: componentToken,
});
```

---

## Recipe — компонент с вариантами

Используй, когда компонент имеет пропсы типа `size`, `variant`, `color`, меняющие стили.

**Структура токенов** — карта вариантов:

```typescript
// tokens.ts
import type { ButtonVariants } from "./types";
import type { VariantsTokenMap } from "@/types";

export const buttonVariantsToken = {
  size: {
    sm: { padding: 8, fontSize: 14 },
    md: { padding: 12, fontSize: 16 },
    lg: { padding: 16, fontSize: 18 },
  },
  variant: {
    primary: { backgroundColor: "blue" },
    secondary: { backgroundColor: "gray" },
  },
} as const satisfies VariantsTokenMap<ButtonVariants>;
```

**Web** — `recipe()` из `@vanilla-extract/recipes`:

```typescript
// web/{Component}.css.ts
import { recipe } from "@vanilla-extract/recipes";
import { buttonVariantsToken } from "../tokens";

export const buttonRecipe = recipe({
  base: { display: "inline-flex", cursor: "pointer" },
  variants: buttonVariantsToken,
});
```

```typescript
// web/{Component}.tsx
import { buttonRecipe } from "./{Component}.css";

export const Button = ({ size = "md", variant = "primary", children }) => (
  <button className={buttonRecipe({ size, variant })}>{children}</button>
);
```

**Mobile** — `nativeRecipe()` из `@/libs`:

```typescript
// mobile/{Component}.styles.ts
import { nativeRecipe } from "@/libs";
import { buttonVariantsToken } from "../tokens";

export const buttonRecipe = nativeRecipe({
  base: { alignItems: "center", justifyContent: "center" },
  variants: buttonVariantsToken,
});
```

```typescript
// mobile/{Component}.tsx
import { Pressable } from "react-native";
import { buttonRecipe } from "./{Component}.styles";

export const Button = ({ size = "md", variant = "primary", children }) => (
  <Pressable style={buttonRecipe({ size, variant })}>{children}</Pressable>
);
```

---

## Variants — маппинг токена в стили

Используй, когда нужно трансформировать плоский токен в объекты стилей. Полезно для типографики, цветов.

**Web** — `styleVariants()` из `@vanilla-extract/css`:

```typescript
import { styleVariants } from "@vanilla-extract/css";
import { fontWeightToken } from "@/tokens";

export const fontWeightVariants = styleVariants(fontWeightToken, (value) => ({
  fontWeight: value,
}));

// Использование: fontWeightVariants.bold → className с fontWeight: 700
```

**Mobile** — `nativeVariants()` из `@/libs`:

```typescript
import { nativeVariants } from "@/libs";
import { fontWeightToken } from "@/tokens";

export const fontWeightVariants = nativeVariants(fontWeightToken, (value) => ({
  fontWeight: value,
}));

// Использование: fontWeightVariants.bold → { fontWeight: 700 }
```

---

## Sprinkles — Spacing-утилиты

Используй для переиспользуемых spacing-пропсов (`m`, `p`, `gap`, `mx`, `py` и т.д.), которые потребители передают в компоненты.

**Web** — `spacingSprinkles()` из `@/sprinkles`:

```typescript
// web/{Component}.tsx
import clsx from "clsx";
import { spacingSprinkles } from "@/sprinkles";
import type { SpacingProps } from "@/types";

export const Box = ({ m, p, gap, children, ...props }: BoxProps & SpacingProps) => (
  <div className={clsx(boxStyles, spacingSprinkles({ m, p, gap }))}>{children}</div>
);
```

**Mobile** — `spacingNativeSprinkles()` из `@/sprinkles`:

```typescript
// mobile/{Component}.tsx
import { View } from "react-native";
import { spacingNativeSprinkles } from "@/sprinkles";
import type { SpacingProps } from "@/types";

export const Box = ({ m, p, gap, children, ...props }: BoxProps & SpacingProps) => (
  <View style={[boxStyles.root, ...spacingNativeSprinkles({ m, p, gap })]}>{children}</View>
);
```

---

## Типы с вариантами

```typescript
// types.ts
import type { PropsWithChildren } from "react";
import type { GapProps, SpacingProps } from "@/types";

export interface ButtonVariants {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
}

export type ButtonPropsBase = ButtonVariants & SpacingProps & GapProps & PropsWithChildren;
```

---

## Темизированные стили — Mobile

Когда мобильному компоненту нужны тема-aware стили (цвета, меняющиеся с light/dark mode), используй хук `useThemedNativeStyles`.

**Расположение:** `@/themes/ThemeProvider/mobile/useThemedNativeStyles`

```typescript
// mobile/{Component}.tsx
import { View, Text } from "react-native";
import { useThemedNativeStyles } from "@/themes";

export const Card = ({ children }) => {
  const { primary } = useThemedNativeStyles();

  return (
    <View style={[cardStyles.card, { backgroundColor: primary.backgroundColor }]}>
      <Text style={{ color: primary.color }}>{children}</Text>
    </View>
  );
};
```

**Доступные темизированные стили:**

- `primary` — primary background + foreground цвета
- `secondary` — secondary background + foreground цвета

**Когда использовать:**

- Компоненту нужны фоновые/текстовые цвета, адаптирующиеся к теме
- Комбинируй со статическими стилями: `style={[staticStyles, { color: primary.color }]}`

**Когда НЕ использовать:**

- Статические цвета, не меняющиеся с темой — используй токены напрямую
- Layout-only стили (padding, flex) — используй обычный StyleSheet

---

## Глобальные токены

Для типографики, цветов, spacing — импортируй из `@/tokens`:

```typescript
import { textSizeToken, fontWeightToken, spacingToken } from "@/tokens";
```

---

## Сводка библиотек

| Web (`@vanilla-extract/*`)                 | Mobile (`@/libs`)                                      | Назначение           |
| ------------------------------------------ | ------------------------------------------------------ | -------------------- |
| `style()`                                  | `StyleSheet.create()`                                  | Простые стили        |
| `recipe()`                                 | `nativeRecipe()`                                       | Стили с вариантами   |
| `styleVariants()`                          | `nativeVariants()`                                     | Токен → карта стилей |
| `defineProperties()` + `createSprinkles()` | `defineNativeProperties()` + `createNativeSprinkles()` | Utility-пропсы       |

Все mobile-библиотеки находятся в `packages/ui/src/libs/mobile/`.
