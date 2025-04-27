import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { loginUser } from "@/lib/api";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { access_token } = await loginUser(email, password);
      await login(access_token);
      Alert.alert("Success", "Logged in!");
      router.push("/");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.message ||
        JSON.stringify(err);

      Alert.alert("Login Failed", errorMessage);
      console.error("loginError", errorMessage);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput 
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Text>Password:</Text>
      <TextInput
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={{ borderWidth: 1, marginBottom: 20 }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}