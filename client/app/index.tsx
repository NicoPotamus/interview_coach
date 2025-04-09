import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import Navbar from "./components/navbar";

export default function Index() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Navbar />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
