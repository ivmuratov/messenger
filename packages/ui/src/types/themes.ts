export type Theme = "light" | "dark";

export interface ThemeContract {
  background: {
    // основной фон приложения
    default: string;
    // фон поверхностей/карточек
    subtle: string;
    // «инвертированный»/контрастный фон (например, popover/tooltip)
    strong: string;
  };
  foreground: {
    // основной текст
    default: string;
    // вторичный/приглушённый текст
    subtle: string;
    // максимально контрастный текст (часто для bg.strong)
    strong: string;
  };
  border: {
    default: string;
    subtle: string;
    strong: string;
  };
}
