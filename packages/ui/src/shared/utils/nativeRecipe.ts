import { StyleSheet } from "react-native";

import type { NativeStyle } from "./types";

type VariantGroups = Record<string, Record<string, NativeStyle>>;
type Resolve<T> = { [Key in keyof T]: T[Key] } & {};
type VariantSelection<Variants extends VariantGroups> = {
  [VariantGroup in keyof Variants]?: keyof Variants[VariantGroup];
};
interface RecipeConfig<Variants extends VariantGroups> {
  base?: NativeStyle;
  variants: Variants;
}
export type RuntimeFn<Variants extends VariantGroups> = (
  options: Resolve<VariantSelection<Variants>>
) => NativeStyle[];
export type RecipeVariants<Fn extends RuntimeFn<VariantGroups>> = Resolve<
  NonNullable<Parameters<Fn>[0]>
>;

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
export function nativeRecipe<Variants extends VariantGroups>({
  base,
  variants,
}: RecipeConfig<Variants>) {
  const compiled: Record<string, Record<string, NativeStyle>> = {};

  for (const [name, group] of Object.entries(variants)) {
    compiled[name] = StyleSheet.create(group);
  }

  const baseStyle = base ? StyleSheet.create({ base }).base : null;

  return (options: Resolve<VariantSelection<Variants>>) => {
    const styles: NativeStyle[] = [];

    if (baseStyle) styles.push(baseStyle);

    for (const [name, value] of Object.entries(options)) {
      if (!value) continue;

      const style = compiled[name]?.[value];

      if (style) styles.push(style);
    }

    return styles;
  };
}
