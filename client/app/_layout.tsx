import { Stack, Redirect } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutContents />
    </AuthProvider>
  );
}

function LayoutContents() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner if you want
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="index"
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}