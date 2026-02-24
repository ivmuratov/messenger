import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";

type NativeStyle = ViewStyle | TextStyle;

/** Конфиг вариантов: имя варианта → Record<значение, стиль> */
export type VariantsConfig = Record<string, Record<string, NativeStyle>>;

/** Опции выбора вариантов: для каждого имени — опциональное значение */
export type VariantOptions<Variants extends VariantsConfig> = {
  [K in keyof Variants]?: keyof Variants[K];
};

export interface RecipeConfig<Variants extends VariantsConfig> {
  base?: NativeStyle;
  variants: Variants;
}

/**
 * Создаёт функцию для получения массива стилей по выбранным вариантам.
 * Аналог recipe из @vanilla-extract/recipes.
 *
 * @example
 * const flexVariants = nativeRecipe({
 *   base: { display: "flex" },
 *   variants: flexVariantsToken,
 * });
 *
 * // В компоненте:
 * <View style={flexVariants({ direction: "row", justifyContent: "center" })} />
 */
export function nativeRecipe<Variants extends VariantsConfig>({
  base,
  variants,
}: RecipeConfig<Variants>): (options: VariantOptions<Variants>) => NativeStyle[] {
  const variantNames = Object.keys(variants) as (keyof Variants)[];

  const compiledVariants = {} as Record<keyof Variants, Record<string, NativeStyle>>;

  for (const variantName of variantNames) {
    compiledVariants[variantName] = StyleSheet.create(
      variants[variantName] as Record<string, NativeStyle>
    );
  }

  const baseStyle = base ? StyleSheet.create({ base }).base : null;

  return function getStyles(options: VariantOptions<Variants>): NativeStyle[] {
    const result: NativeStyle[] = [];

    if (baseStyle) {
      result.push(baseStyle);
    }

    for (const variantName of variantNames) {
      const value = options[variantName];

      if (!value) continue;

      const variantStyles = compiledVariants[variantName];
      const style = variantStyles?.[value as string];

      if (!style) continue;

      result.push(style);
    }

    return result;
  };
}
