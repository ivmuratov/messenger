---
name: create-ui-component
description: Пошаговое руководство по созданию кросс-платформенного UI-компонента в packages/ui. Используйте при создании atoms, molecules или layouts с реализацией для web и mobile.
---

# Создание UI-компонента

Создание кросс-платформенного UI-компонента в `packages/ui/src/components/`.

## Субагенты

Делегируй при необходимости:

- **[researcher](../../agents/researcher.md)** — Исследуй существующие компоненты перед созданием. Используй для поиска паттернов, структуры токенов и использования sprinkles.
- **[reviewer](../../agents/reviewer.md)** — Проверь качество кода после реализации. Используй для независимой проверки перед завершением.

## Шаги

### 1. Собери требования

Спроси у пользователя:

- Имя компонента (например, `Input`, `SearchBar`, `MessageBubble`)
- Атомарный уровень: `atoms`, `molecules` или `organisms`
- Какие пропсы принимает?
- **Есть ли варианты (size, color, state)?** → Если да, используй паттерн recipe

Смотри [references/reference.md](references/reference.md) для паттернов стилизации (когда использовать recipe vs style, tokens, sprinkles).

### 2. Создай структуру директорий

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

### 3. Создай типы (`types.ts`)

**Простой компонент** (без вариантов):

```typescript
import type { PropsWithChildren } from "react";

export type {ComponentName}BaseProps = PropsWithChildren;
```

**С вариантами** — определи типы вариантов и расширь (смотри [references/reference.md](references/reference.md)).

### 4. Создай токены (`tokens.ts`)

Выноси в токены, когда: значение общее для web/mobile, представляет шкалу дизайн-системы, или используется в нескольких местах.

**Простой компонент**:

```typescript
export const {componentName}StylesToken = {
  // общие значения: padding, borderRadius, backgroundColor и т.д.
} as const;
```

**С вариантами** — используй `{componentName}VariantsToken` с `VariantsTokenMap`.

Смотри [references/reference.md](references/reference.md) → "Токены — когда выносить".

### 5. Создай веб-реализацию

**Простой компонент** — `web/{ComponentName}.tsx`:

```typescript
import type { ReactNode } from "react";
import type { {ComponentName}BaseProps } from "../types";
import { {componentName}Styles } from "./{ComponentName}.css";

export const {ComponentName} = ({ children }: {ComponentName}BaseProps): ReactNode => {
  return <div className={{componentName}Styles}>{children}</div>;
};
```

**`web/{ComponentName}.css.ts`** (простой):

```typescript
import { style } from "@vanilla-extract/css";
import { {componentName}StylesToken } from "../tokens";

export const {componentName}Styles = style({componentName}StylesToken);
```

**С вариантами** — используй `recipe()` из `@vanilla-extract/recipes`.

**Со spacing-пропсами** — комбинируй с `spacingSprinkles()` из `@/sprinkles`.

Смотри [references/reference.md](references/reference.md) → таблица "Когда что использовать".

**`web/index.ts`**:

```typescript
export * from "./{ComponentName}";
```

### 6. Создай мобильную реализацию

**Простой компонент** — `mobile/{ComponentName}.tsx`:

```typescript
import type { ReactNode } from "react";
import { View } from "react-native";
import type { {ComponentName}BaseProps } from "../types";
import { {componentName}Styles } from "./{ComponentName}.styles";

export const {ComponentName} = ({ children, }: {ComponentName}BaseProps): ReactNode => {
  return <View style={{componentName}Styles.{componentName}}>{children}</View>;
};
```

**`mobile/{ComponentName}.styles.ts`** (простой):

```typescript
import { StyleSheet } from "react-native";
import { {componentName}StylesToken } from "../tokens";

export const {componentName}Styles = StyleSheet.create({
  componentName: {componentName}StylesToken,
});
```

**С вариантами** — используй `nativeRecipe()` из `@/libs`.

**Со spacing-пропсами** — комбинируй с `spacingNativeSprinkles()` из `@/sprinkles`.

Все утилиты стилизации для mobile: `@/libs` (`nativeRecipe`, `nativeVariants`, `defineNativeProperties`, `createNativeSprinkles`).

**`mobile/index.ts`**:

```typescript
export * from "./{ComponentName}";
```

### 7. Создай платформенные entry points

**`index.ts`** (web):

```typescript
export * from "./web";
```

**`index.native.ts`** (mobile):

```typescript
export * from "./mobile";
```

### 8. Зарегистрируй в barrel-экспортах

Добавь в `packages/ui/src/components/{level}/index.ts`:

```typescript
export * from "./{ComponentName}";
```

Добавь в `packages/ui/src/components/{level}/index.native.ts`:

```typescript
export * from "./{ComponentName}/index.native";
```
