import React from "react";
import { ActivityIndicator, View, StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface LoadingScreenProps {
  message?: string; // <- optional message
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ee" />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});