import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import Navbar from "@/components/Navbar";
import { useAuth, AuthProvider } from "@/context/AuthContext"; // Import BOTH
import { Redirect } from "expo-router"; // Import Redirect

export default function Index() {
  return (
    <AuthProvider>
      <ProtectedRoutes />
    </AuthProvider>
  );
}

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth(); // This will now work correctly

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Navbar />
      </PaperProvider>
    </SafeAreaProvider>
  );
}