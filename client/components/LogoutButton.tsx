import { Button } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login"); // Force back to login page
  };

  return (
    <Button title="Logout" onPress={handleLogout} />
  );
}