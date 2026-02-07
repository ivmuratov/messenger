import { Text, View } from "react-native";
import { Button, ThemeProvider } from "ui";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <View>
        <Text>Hello World Mobile App!</Text>
        <Button>Click me</Button>
      </View>
    </ThemeProvider>
  );
}
