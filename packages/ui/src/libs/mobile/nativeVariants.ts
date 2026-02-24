import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";

/** Стиль для View или Text */
export type StyleLike = ViewStyle | TextStyle;

/**
 * Создаёт предвычисленные стили из токенов.
 * Аналог styleVariants из @vanilla-extract/css.
 *
 * const fontWeightVariants = nativeVariants(fontWeightToken, (value) => ({ fontWeight: value }));
 */
export function nativeVariants<Key extends string>(
  tokens: Record<Key, StyleLike>
): Record<Key, StyleLike>;

export function nativeVariants<Key extends string, Value>(
  tokens: Record<Key, Value>,
  mapFn: (value: Value, key: Key) => StyleLike
): Record<Key, StyleLike>;

export function nativeVariants<Key extends string, Value>(
  tokens: Record<Key, Value>,
  mapFn?: (value: Value, key: Key) => StyleLike
): Record<Key, StyleLike> {
  const result = {} as Record<string, StyleLike>;

  for (const key of Object.keys(tokens) as Key[]) {
    const value = tokens[key];
    result[key] = mapFn ? mapFn(value, key) : (value as StyleLike);
  }

  return StyleSheet.create(result) as Record<Key, StyleLike>;
}
