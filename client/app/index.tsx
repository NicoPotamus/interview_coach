import { registerRootComponent } from "expo";
import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import Navbar from "./components/Navbar";

function Index() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Navbar />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

// Register the root component
registerRootComponent(Index);

export default Index;