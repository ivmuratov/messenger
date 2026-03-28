import { StyleSheet } from "react-native";

import type { NativeStyle } from "./types";

/**
 * Создаёт предвычисленные стили из токенов.
 * Аналог styleVariants из @vanilla-extract/css.
 *
 * const fontWeightVariants = nativeVariants(fontWeightToken, (value) => ({ fontWeight: value }));
 */
export function nativeVariants<Token extends Record<string | number, NativeStyle>>(
  token: Token
): Record<keyof Token, NativeStyle>;
export function nativeVariants<
  Token extends Record<string | number, unknown>,
  Key extends keyof Token,
>(
  token: Token,
  mapData: (value: Token[Key], key: Key) => NativeStyle
): Record<keyof Token, NativeStyle>;

export function nativeVariants(
  token: Record<string | number, unknown>,
  mapData?: (value: unknown, key: string) => NativeStyle
) {
  const variants: Record<string, NativeStyle> = {};

  for (const key of Object.keys(token)) {
    variants[key] = mapData ? mapData(token[key], key) : (token[key] as NativeStyle);
  }

  return StyleSheet.create(variants);
}
