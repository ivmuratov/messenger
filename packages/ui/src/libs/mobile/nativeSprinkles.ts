import { StyleSheet, type ViewStyle } from "react-native";
// TODO: Доработать типизацию
type StyleValue = string | number;

/** Токены: { sm: 8, md: 16, ... } */
type TokenValues<Scale extends string = string> = Record<Scale, StyleValue>;

/** Конфиг properties: CSS-свойство → токены */
type PropertiesConfig = {
  [Property in keyof ViewStyle]?: TokenValues;
};

/** Конфиг shorthands: шорткат → массив CSS-свойств */
type ShorthandsConfig<Properties extends PropertiesConfig> = Record<
  string,
  ReadonlyArray<keyof Properties>
>;

/** Полный конфиг для defineProperties */
interface DefinePropertiesConfig<
  Properties extends PropertiesConfig,
  Shorthands extends ShorthandsConfig<Properties>,
> {
  properties: Properties;
  shorthands?: Shorthands;
}

/** Извлекаем scale-ключи из токенов */
type ExtractScales<Properties extends PropertiesConfig> =
  Properties[keyof Properties] extends TokenValues<infer S> ? S : string;

/** Стили для одного свойства */
type PropertyStyles<Scale extends string> = Record<Scale, ViewStyle>;

/** Результат defineProperties */
interface DefinedProperties<
  Properties extends PropertiesConfig,
  Shorthands extends ShorthandsConfig<Properties>,
> {
  styles: { [P in keyof Properties]: PropertyStyles<ExtractScales<Properties>> };
  shorthands: Shorthands;
}

/** Пропсы sprinkles: прямые свойства + шорткаты */
type SprinklesProps<
  Properties extends PropertiesConfig,
  Shorthands extends ShorthandsConfig<Properties>,
> = {
  [P in keyof Properties]?: ExtractScales<Properties>;
} & {
  [S in keyof Shorthands]?: ExtractScales<Properties>;
};

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
  Properties extends PropertiesConfig,
  Shorthands extends ShorthandsConfig<Properties> = Record<string, never>,
>(
  config: DefinePropertiesConfig<Properties, Shorthands>
): DefinedProperties<Properties, Shorthands> {
  const { properties, shorthands = {} as Shorthands } = config;

  type Scales = ExtractScales<Properties>;
  type Styles = DefinedProperties<Properties, Shorthands>["styles"];

  const styles = {} as Styles;

  for (const propName in properties) {
    const tokenValues = properties[propName];
    const scaleStyles: Record<string, ViewStyle> = {};

    for (const scale in tokenValues) {
      const value = tokenValues[scale];
      if (!value) continue;

      scaleStyles[scale] = { [propName]: value };
    }

    styles[propName] = StyleSheet.create(scaleStyles) as PropertyStyles<Scales>;
  }

  return { styles, shorthands };
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
export function createNativeSprinkles<
  Properties extends PropertiesConfig,
  Shorthands extends ShorthandsConfig<Properties>,
>(properties: DefinedProperties<Properties, Shorthands>) {
  const { styles, shorthands } = properties;
  const propertyNames = Object.keys(styles);
  const shorthandEntries = Object.entries(shorthands) as Array<[string, ReadonlyArray<string>]>;

  type Props = SprinklesProps<Properties, Shorthands>;
  type Scale = ExtractScales<Properties>;

  return function sprinkles(props: Props): ViewStyle[] {
    const result: ViewStyle[] = [];

    // Прямые свойства (marginTop, gap, ...)
    for (const propName of propertyNames) {
      const scale = props[propName as keyof Props] as Scale | undefined;
      if (!scale) continue;

      const style = styles[propName as keyof Properties]?.[scale];
      if (!style) continue;

      result.push(style);
    }

    // Шорткаты (m, mx, ...)
    for (const [shorthandName, mappedProps] of shorthandEntries) {
      const scale = props[shorthandName as keyof Props] as Scale | undefined;
      if (!scale) continue;

      for (const propName of mappedProps) {
        const style = styles[propName as keyof Properties]?.[scale];
        if (!style) continue;

        result.push(style);
      }
    }

    return result;
  };
}
