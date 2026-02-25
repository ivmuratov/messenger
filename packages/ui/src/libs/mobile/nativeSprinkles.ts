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
 *
 * @example
 * const spacingSprinkles = createNativeSprinkles(spacingProperties);
 *
 * // В компоненте:
 * <View style={spacingSprinkles({ m: "sm", gap: "md" })} />
 */
export function createNativeSprinkles<P extends PropertiesConfig, S extends ShorthandsConfig<P>>(
  defined: DefinedProperties<P, S>
) {
  const styles: Record<string, Record<string, ViewStyle>> = defined.styles;
  const shorthandMap: Record<string, readonly string[]> = defined.shorthands;

  return (props: SprinklesProps<P, S>): ViewStyle[] => {
    const result: ViewStyle[] = [];

    for (const [name, value] of Object.entries(props)) {
      if (typeof value !== "string") continue;

      const mapped = shorthandMap[name];

      if (mapped) {
        for (const propName of mapped) {
          const style = styles[propName]?.[value];
          if (style) result.push(style);
        }
      } else {
        const style = styles[name]?.[value];
        if (style) result.push(style);
      }
    }

    return result;
  };
}
