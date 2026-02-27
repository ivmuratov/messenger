# Recipe & Variants Reference

Use when the component has variants (size, color, direction, etc.). Reference: `packages/ui/src/components/atoms/Flex/`.

## Types with Variants

```typescript
// types.ts
import type { PropsWithChildren } from "react";
import type { GapProps, SpacingProps } from "@/types";

export interface {ComponentName}Variants {
  direction?: "row" | "column";
  size?: "sm" | "md" | "lg";
  // ... variant keys matching token structure
}

export type {ComponentName}PropsBase = {ComponentName}Variants & SpacingProps & GapProps & PropsWithChildren;
```

## Tokens for Recipe

```typescript
// tokens.ts
import type { {ComponentName}Variants } from "./types";

export const {componentName}VariantsToken = {
  direction: {
    row: { flexDirection: "row" },
    column: { flexDirection: "column" },
  },
  size: {
    sm: { padding: 4, fontSize: 12 },
    md: { padding: 8, fontSize: 14 },
    lg: { padding: 12, fontSize: 16 },
  },
} as const satisfies VariantsTokenMap<{ComponentName}Variants>;
```

## Web — recipe()

```typescript
// web/{ComponentName}.css.ts
import { recipe } from "@vanilla-extract/recipes";
import { {componentName}VariantsToken } from "../tokens";

export const {componentName}Variants = recipe({
  base: { display: "flex" },
  variants: {componentName}VariantsToken,
});
```

```typescript
// web/{ComponentName}.tsx
import clsx from "clsx";
import { spacingSprinkles } from "@/sprinkles";
import { {componentName}Variants } from "./{ComponentName}.css";

export const {ComponentName} = ({ direction = "column", size = "md", children, ...spaceProps }) => (
  <div className={clsx({componentName}Variants({ direction, size }), spacingSprinkles(spaceProps))}>
    {children}
  </div>
);
```

## Mobile — nativeRecipe()

```typescript
// mobile/{ComponentName}.styles.ts
import { nativeRecipe } from "@/libs";
import { {componentName}VariantsToken } from "../tokens";

export const {componentName}Variants = nativeRecipe({
  variants: {componentName}VariantsToken,
});
```

```typescript
// mobile/{ComponentName}.tsx
import { View } from "react-native";
import { spacingNativeSprinkles } from "@/sprinkles";
import { {componentName}Variants } from "./{ComponentName}.styles";

export const {ComponentName} = ({ direction = "column", size = "md", children, ...spaceProps }) => (
  <View style={[{componentName}Variants({ direction, size }), ...spacingNativeSprinkles(spaceProps)]}>
    {children}
  </View>
);
```

## Global Tokens

For typography, colors, spacing — import from `@/tokens`:

```typescript
import { textSizeToken, fontWeightToken } from "@/tokens";
```
