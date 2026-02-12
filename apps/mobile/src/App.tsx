import { Text } from "react-native";
import { Button, ThemeProvider } from "ui";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Text>Hello World Mobile App!</Text>
      <Button>Click me</Button>
    </ThemeProvider>
  );
}
