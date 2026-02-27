---
name: create-ui-component
description: Step-by-step guide for scaffolding a cross-platform UI component in packages/ui. Use when creating atoms, molecules, or organisms with both web and mobile implementations.
---

# Create UI Component

Scaffold a cross-platform UI component in `packages/ui/src/components/`.

## Subagents

Delegate when appropriate:

- **[researcher](../../agents/researcher.md)** — Explore existing components (Button, Flex, Typography) before scaffolding. Use to find patterns, token structure, and sprinkles usage.
- **[reviewer](../../agents/reviewer.md)** — Review code quality after implementation. Use for independent verification before marking complete.

## Steps

### 1. Gather Requirements

Ask the user:

- Component name (e.g., `Input`, `SearchBar`, `MessageBubble`)
- Atomic level: `atoms`, `molecules`, or `organisms`
- What props does it accept?
- **Any variants (size, color, state)?** → If yes, use recipe pattern (see [references/reference.md](references/reference.md))

### 2. Create Directory Structure

```
packages/ui/src/components/{level}/{ComponentName}/
├── types.ts
├── tokens.ts
├── index.ts
├── index.native.ts
├── web/
│   ├── {ComponentName}.tsx
│   ├── {ComponentName}.css.ts
│   └── index.ts
└── mobile/
    ├── {ComponentName}.tsx
    ├── {ComponentName}.styles.ts
    └── index.ts
```

### 3. Create Types (`types.ts`)

**Simple component** (no variants):

```typescript
import type { PropsWithChildren } from "react";

export type {ComponentName}BaseProps = PropsWithChildren;
```

**With variants** — define variant types and extend (see [references/reference.md](references/reference.md)).

### 4. Create Tokens (`tokens.ts`)

**Simple component**:

```typescript
export const {componentName}StyleToken = {
  // shared values: padding, borderRadius, backgroundColor, etc.
} as const;
```

**With variants** — use `{componentName}VariantsToken` with `VariantsTokenMap` (see [references/reference.md](references/reference.md)).

### 5. Create Web Implementation

**Simple component** — `web/{ComponentName}.tsx`:

```typescript
import type { ReactNode } from "react";
import type { {ComponentName}BaseProps } from "../types";
import { {componentName}Styles } from "./{ComponentName}.css";

export const {ComponentName} = ({ children, ...props }: {ComponentName}BaseProps): ReactNode => {
  return <div className={{componentName}Styles}>{children}</div>;
};
```

**`web/{ComponentName}.css.ts`** (simple):

```typescript
import { style } from "@vanilla-extract/css";
import { {componentName}StyleToken } from "../tokens";

export const {componentName}Styles = style({componentName}StyleToken);
```

**With variants** — use `recipe()` from `@vanilla-extract/recipes` (see [references/reference.md](references/reference.md)).

**`web/index.ts`**:

```typescript
export * from "./{ComponentName}";
```

### 6. Create Mobile Implementation

**Simple component** — `mobile/{ComponentName}.tsx`:

```typescript
import type { ReactNode } from "react";
import { View } from "react-native";
import type { {ComponentName}BaseProps } from "../types";
import { {componentName}Styles } from "./{ComponentName}.styles";

export const {ComponentName} = ({ children, ...props }: {ComponentName}BaseProps): ReactNode => {
  return <View style={{componentName}Styles.root}>{children}</View>;
};
```

**`mobile/{ComponentName}.styles.ts`** (simple):

```typescript
import { StyleSheet } from "react-native";
import { {componentName}StyleToken } from "../tokens";

export const {componentName}Styles = StyleSheet.create({
  root: {componentName}StyleToken,
});
```

**With variants** — use `nativeRecipe()` from `@/libs` (see [references/reference.md](references/reference.md)).

**`mobile/index.ts`**:

```typescript
export * from "./{ComponentName}";
```

### 7. Create Platform Entry Points

**`index.ts`** (web):

```typescript
export * from "./web";
```

**`index.native.ts`** (mobile):

```typescript
export * from "./mobile";
```

### 8. Register in Barrel Exports

Add to `packages/ui/src/components/{level}/index.ts`:

```typescript
export * from "./{ComponentName}";
```

Add to `packages/ui/src/components/{level}/index.native.ts`:

```typescript
export * from "./{ComponentName}/index.native";
```
