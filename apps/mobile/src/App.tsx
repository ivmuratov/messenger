import { Flex, ThemeProvider, ThemeSwitcher, Typography } from "ui";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Flex direction="column">
        <Typography>Hello World Mobile App!</Typography>
        <ThemeSwitcher />
      </Flex>
    </ThemeProvider>
  );
}
