import { Flex, Page, ThemeProvider, ThemeSwitcher, Typography } from "ui";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Page>
        <Page.Header>
          <ThemeSwitcher />
        </Page.Header>
        <Page.Body>
          {Array.from({ length: 100 }).map((_, index) => (
            <Flex key={index}>
              <Typography>Hello</Typography>
              <Typography>Web App!</Typography>
            </Flex>
          ))}
        </Page.Body>
      </Page>
    </ThemeProvider>
  );
}
