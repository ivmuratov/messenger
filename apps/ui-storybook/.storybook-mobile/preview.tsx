import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { type Decorator, type Preview } from "@storybook/react-vite";
import { ThemeProvider } from "@ui";

type StorybookTheme = "light" | "dark";

const withThemeProvider: Decorator = (Story, { globals }) => {
  const theme = (globals.theme ?? "light") as StorybookTheme;

  return (
    <ThemeProvider defaultTheme={theme} key={theme}>
      <Story />
    </ThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    a11y: {
      test: "todo",
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      attributeName: "data-theme",
      parentSelector: "html",
    }),
    withThemeProvider,
  ],
};

export default preview;
