import { createThemeContract } from "@vanilla-extract/css";

export const theme = createThemeContract({
  bg: {
    default: null, // основной фон приложения
    subtle: null, // фон поверхностей/карточек
    strong: null, // «инвертированный»/контрастный фон (например, popover/tooltip)
  },
  fg: {
    default: null, // основной текст
    subtle: null, // вторичный/приглушённый текст
    strong: null, // максимально контрастный текст (часто для bg.strong)
  },
  border: {
    default: null,
    subtle: null,
    strong: null,
  },
});
