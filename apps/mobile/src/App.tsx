import { Text } from "react-native";
import { Button, Flex, ThemeProvider } from "ui";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Flex direction="column">
        <Text>Hello World Mobile App!</Text>
        <Button>Click me</Button>
      </Flex>
    </ThemeProvider>
  );
}
