type NullableTokens<T> = {
  [P in keyof T]: T[P] extends object ? NullableTokens<T[P]> : T[P] | null;
};
