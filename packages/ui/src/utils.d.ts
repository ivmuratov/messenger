type NullableTokens<T> = {
  [P in keyof T]: T[P] extends object ? NullableTokens<T[P]> : T[P] | null;
};

type VariantsTokenMap<Variants extends { [Key in keyof Variants]?: string }> = {
  [VariantKey in keyof Variants]-?: Record<
    NonNullable<Variants[VariantKey]>,
    Record<string, string>
  >;
};

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition(): void;
}

interface Document {
  startViewTransition(callback: () => void | Promise<void>): ViewTransition;
}
