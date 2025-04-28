import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen"; // <- import it!
import { PaperProvider } from "react-native-paper";

export default function HomeScreen() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />; // <- cleaner loading
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <PaperProvider>
      <Navbar />
    </PaperProvider>
  );
}