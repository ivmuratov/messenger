import { StyleSheet, type ViewStyle } from "react-native";

type StyleValue = string | number;

type Resolve<T> = { [K in keyof T]: T[K] } & {};

type PropertiesConfig = {
  [P in keyof ViewStyle]?: Record<string, StyleValue>;
};

type ShorthandsConfig<P extends PropertiesConfig> = Record<string, ReadonlyArray<keyof P & string>>;

type ScalesOf<P extends PropertiesConfig> =
  P[keyof P] extends Record<infer S, StyleValue> ? S & string : string;

type SprinklesProps<P extends PropertiesConfig, S extends ShorthandsConfig<P>> = Resolve<{
  [K in keyof P | keyof S]?: ScalesOf<P>;
}>;

interface DefinedProperties<P extends PropertiesConfig, S extends ShorthandsConfig<P>> {
  styles: { [Prop in keyof P]: Record<string, ViewStyle> };
  shorthands: S;
}

type AnyDefinedProperties = DefinedProperties<any, any>;

type ChildNativeSprinklesProps<D> =
  D extends DefinedProperties<infer P, infer S> ? SprinklesProps<P, S> : never;

type NativeSprinklesProps<Args extends ReadonlyArray<any>> = Args extends [infer L, ...infer R]
  ? ChildNativeSprinklesProps<L> & NativeSprinklesProps<R>
  : {};

/**
 * Создаёт предвычисленные стили из конфига токенов.
 * Аналог defineProperties из @vanilla-extract/sprinkles.
 *
 * @example
 * const spacingProperties = defineNativeProperties({
 *   properties: {
 *     marginTop: spacingToken,
 *     marginLeft: spacingToken,
 *     gap: spacingToken,
 *   },
 *   shorthands: {
 *     m: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
 *     mx: ["marginLeft", "marginRight"],
 *   },
 * });
 */
export function defineNativeProperties<
  P extends PropertiesConfig,
  S extends ShorthandsConfig<P> = Record<string, never>,
>({ properties, shorthands }: { properties: P; shorthands?: S }): DefinedProperties<P, S> {
  const styles: Record<string, Record<string, ViewStyle>> = {};

  for (const [propName, tokenValues] of Object.entries(properties)) {
    if (!tokenValues) continue;

    const scaleStyles: Record<string, ViewStyle> = {};

    for (const [scale, value] of Object.entries(tokenValues)) {
      scaleStyles[scale] = { [propName]: value };
    }

    styles[propName] = StyleSheet.create(scaleStyles);
  }

  return { styles, shorthands } as DefinedProperties<P, S>;
}

/**
 * Создаёт функцию для получения массива стилей по пропсам.
 * Аналог createSprinkles из vanilla-extract/sprinkles.
 * Принимает один или несколько результатов defineNativeProperties.
 *
 * @example
 * const spacingSprinkles = createNativeSprinkles(marginProperties, paddingProperties, gapProperties);
 *
 * // В компоненте:
 * <View style={spacingSprinkles({ m: "sm", gap: "md" })} />
 */
export const createNativeSprinkles = <Args extends ReadonlyArray<AnyDefinedProperties>>(
  ...args: Args
): ((props: Resolve<NativeSprinklesProps<Args>>) => ViewStyle[]) => {
  const allStyles: Record<string, Record<string, ViewStyle>> = {};
  const allShorthands: Record<string, readonly string[]> = {};

  for (const def of args) {
    Object.assign(allStyles, def.styles);
    if (def.shorthands) Object.assign(allShorthands, def.shorthands);
  }

  return (props) => {
    const result: ViewStyle[] = [];

    for (const [name, value] of Object.entries(props)) {
      if (typeof value !== "string") continue;

      const mapped = allShorthands[name];

      if (mapped) {
        for (const propName of mapped) {
          const style = allStyles[propName]?.[value];
          if (style) result.push(style);
        }
      } else {
        const style = allStyles[name]?.[value];
        if (style) result.push(style);
      }
    }

    return result;
  };
};
