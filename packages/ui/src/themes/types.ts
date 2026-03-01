export type Theme = "light" | "dark";

export interface ThemeContract {
  background: {
    // основной фон приложения
    primary: string;
    // фон поверхностей/карточек
    secondary: string;
  };
  foreground: {
    // основной текст
    primary: string;
    // вторичный/приглушённый текст
    secondary: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
}
