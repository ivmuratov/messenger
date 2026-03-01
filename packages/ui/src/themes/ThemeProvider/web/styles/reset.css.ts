import { globalStyle } from "@vanilla-extract/css";

import { resetLayer } from "./layers.css";

/**
 * Удаляет все стили из "User-Agent-Stylesheet", кроме свойства 'display'
 *
 * - Часть "symbol *" решает баг с SVG-спрайтами в Firefox
 * - Элемент "html" исключён, иначе баг в Chrome ломает CSS-свойство hyphens
 *   (https://github.com/elad2412/the-new-css-reset/issues/36)
 */
globalStyle("*:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *))", {
  "@layer": {
    [resetLayer]: {
      all: "unset",
      display: "revert",
    },
  },
});

/**
 * Предпочтительное значение border-box
 */
globalStyle("*, *::before, *::after", {
  "@layer": {
    [resetLayer]: {
      boxSizing: "border-box",
    },
  },
});

/**
 * Фикс увеличения размера шрифта в mobile Safari в ландшафтном режиме
 */
globalStyle("html", {
  "@layer": {
    [resetLayer]: {
      MozTextSizeAdjust: "none",
      WebkitTextSizeAdjust: "none",
      textSizeAdjust: "none",
    },
  },
});

/**
 * Восстанавливает курсор pointer для ссылок
 */
globalStyle("a, button", {
  "@layer": {
    [resetLayer]: {
      cursor: "pointer",
    },
  },
});

/**
 * Убирает маркеры и нумерацию списков
 */
globalStyle("ol, ul, menu, summary", {
  "@layer": {
    [resetLayer]: {
      listStyle: "none",
    },
  },
});

/**
 * Не позволяет изображениям выходить за границы контейнера
 */
globalStyle("img", {
  "@layer": {
    [resetLayer]: {
      maxInlineSize: "100%",
      maxBlockSize: "100%",
    },
  },
});

/**
 * Убирает отступы между ячейками таблицы
 */
globalStyle("table", {
  "@layer": {
    [resetLayer]: {
      borderCollapse: "collapse",
    },
  },
});

/**
 * Safari — исправление проблемы, когда user-select:none на <body>
 * блокирует работу текстовых полей ввода
 */
globalStyle("input, textarea", {
  "@layer": {
    [resetLayer]: {
      WebkitUserSelect: "auto",
    },
  },
});

/**
 * Восстанавливает свойство white-space для textarea в Safari
 */
globalStyle("textarea", {
  "@layer": {
    [resetLayer]: {
      whiteSpace: "revert",
    },
  },
});

/**
 * Минимальные стили для возможности кастомизации элемента meter
 */
globalStyle("meter", {
  "@layer": {
    [resetLayer]: {
      WebkitAppearance: "revert",
      appearance: "revert",
    },
  },
});

/**
 * Предформатированный текст — только для этой цели
 */
globalStyle(":where(pre)", {
  "@layer": {
    [resetLayer]: {
      all: "revert",
      boxSizing: "border-box",
    },
  },
});

/**
 * Сбрасывает стандартную прозрачность текста placeholder в полях ввода
 */
globalStyle("::placeholder", {
  "@layer": {
    [resetLayer]: {
      color: "unset",
    },
  },
});

/**
 * Исправляет работу атрибута hidden. display:revert возвращает к стилю элемента,
 * а не к атрибуту
 */
globalStyle(":where([hidden])", {
  "@layer": {
    [resetLayer]: {
      display: "none",
    },
  },
});

/**
 * Обход бага в браузерах на Chromium
 *
 * - Исправляет корректную работу атрибута contenteditable
 * - Webkit-user-select: auto добавлен для Safari при использовании
 *   user-select:none на обёртке
 */
globalStyle(':where([contenteditable]:not([contenteditable="false"]))', {
  "@layer": {
    [resetLayer]: {
      MozUserModify: "read-write",
      WebkitUserModify: "read-write",
      overflowWrap: "break-word",
      /* WebkitLineBreak: "after-white-space" */
      WebkitUserSelect: "auto",
    },
  },
});

/**
 * Восстанавливает возможность перетаскивания — работает только в Chromium и Safari
 */
globalStyle(':where([draggable="true"])', {
  "@layer": {
    [resetLayer]: {
      // @ts-expect-error: -webkit-user-drag — нестандартное свойство
      WebkitUserDrag: "element",
    },
  },
});

/**
 * Восстанавливает нативное поведение модального окна
 */
globalStyle(":where(dialog:modal)", {
  "@layer": {
    [resetLayer]: {
      all: "revert",
      boxSizing: "border-box",
    },
  },
});
