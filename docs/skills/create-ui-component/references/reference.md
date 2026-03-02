# Styling Reference

## When to Use What

| Need                                        | Web                  | Mobile                     | Location                            |
| ------------------------------------------- | -------------------- | -------------------------- | ----------------------------------- |
| Simple component, no variants               | `style()`            | `StyleSheet.create()`      | `{Component}.css.ts` / `.styles.ts` |
| Component with variants (size, color, etc.) | `recipe()`           | `nativeRecipe()`           | `{Component}.css.ts` / `.styles.ts` |
| Map token values to styles                  | `styleVariants()`    | `nativeVariants()`         | Inline or separate file             |
| Spacing utilities (m, p, gap)               | `spacingSprinkles()` | `spacingNativeSprinkles()` | `@/sprinkles`                       |
| Theme-aware colors (light/dark)             | CSS vars (contract)  | `useThemedNativeStyles()`  | `@/themes`                          |
| Shared design values                        | tokens               | tokens                     | `tokens.ts`                         |

---

## Tokens — When to Extract

**Extract to `tokens.ts` when:**

- Value is shared between web and mobile
- Value represents design system scale (spacing, typography, colors)
- Value is used in multiple places within component
- Value might change across themes

**Keep inline when:**

- One-off structural value (e.g., `display: "flex"`)
- Platform-specific value that differs web vs mobile

```typescript
// tokens.ts — shared values
export const buttonToken = {
  borderRadius: 8,
  minHeight: 44,
} as const;

// Good: design system values in tokens
export const buttonSizeToken = {
  sm: { padding: 8, fontSize: 14 },
  md: { padding: 12, fontSize: 16 },
  lg: { padding: 16, fontSize: 18 },
} as const;
```

---

## Simple Styles — No Variants

**Web** — `style()` from `@vanilla-extract/css`:

```typescript
// web/{Component}.css.ts
import { style } from "@vanilla-extract/css";
import { componentToken } from "../tokens";

export const root = style({
  ...componentToken,
  display: "flex", // structural, not in tokens
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

## Recipe — Component with Variants

Use when component has props like `size`, `variant`, `color` that change styles.

**Tokens structure** — variants map:

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

**Web** — `recipe()` from `@vanilla-extract/recipes`:

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

**Mobile** — `nativeRecipe()` from `@/libs`:

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

## Variants — Map Token to Styles

Use when you need to transform a flat token into style objects. Useful for typography, colors.

**Web** — `styleVariants()` from `@vanilla-extract/css`:

```typescript
import { styleVariants } from "@vanilla-extract/css";
import { fontWeightToken } from "@/tokens";

export const fontWeightVariants = styleVariants(fontWeightToken, (value) => ({
  fontWeight: value,
}));

// Usage: fontWeightVariants.bold → className with fontWeight: 700
```

**Mobile** — `nativeVariants()` from `@/libs`:

```typescript
import { nativeVariants } from "@/libs";
import { fontWeightToken } from "@/tokens";

export const fontWeightVariants = nativeVariants(fontWeightToken, (value) => ({
  fontWeight: value,
}));

// Usage: fontWeightVariants.bold → { fontWeight: 700 }
```

---

## Sprinkles — Spacing Utilities

Use for reusable spacing props (`m`, `p`, `gap`, `mx`, `py`, etc.) that consumers pass to components.

**Web** — `spacingSprinkles()` from `@/sprinkles`:

```typescript
// web/{Component}.tsx
import clsx from "clsx";
import { spacingSprinkles } from "@/sprinkles";
import type { SpacingProps } from "@/types";

export const Box = ({ m, p, gap, children, ...props }: BoxProps & SpacingProps) => (
  <div className={clsx(boxStyles, spacingSprinkles({ m, p, gap }))}>{children}</div>
);
```

**Mobile** — `spacingNativeSprinkles()` from `@/sprinkles`:

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

## Types with Variants

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

## Themed Styles — Mobile

When mobile component needs theme-aware styles (colors that change with light/dark mode), use `useThemedNativeStyles` hook.

**Location:** `@/themes/ThemeProvider/mobile/useThemedNativeStyles`

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

**Available themed styles:**

- `primary` — primary background + foreground colors
- `secondary` — secondary background + foreground colors

**When to use:**

- Component needs background/text colors that adapt to theme
- Combine with static styles: `style={[staticStyles, { color: primary.color }]}`

**When NOT to use:**

- Static colors that don't change with theme — use tokens directly
- Layout-only styles (padding, flex) — use regular StyleSheet

---

## Global Tokens

For typography, colors, spacing — import from `@/tokens`:

```typescript
import { textSizeToken, fontWeightToken, spacingToken } from "@/tokens";
```

---

## Libs Summary

| Web (`@vanilla-extract/*`)                 | Mobile (`@/libs`)                                      | Purpose              |
| ------------------------------------------ | ------------------------------------------------------ | -------------------- |
| `style()`                                  | `StyleSheet.create()`                                  | Simple styles        |
| `recipe()`                                 | `nativeRecipe()`                                       | Variant-based styles |
| `styleVariants()`                          | `nativeVariants()`                                     | Token → style map    |
| `defineProperties()` + `createSprinkles()` | `defineNativeProperties()` + `createNativeSprinkles()` | Utility props        |

All mobile libs are in `packages/ui/src/libs/mobile/`.
