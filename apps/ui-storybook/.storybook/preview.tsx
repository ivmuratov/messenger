import { type Preview } from "@storybook/react-vite";
import { ThemeProvider } from "@ui";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
