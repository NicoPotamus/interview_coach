import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { loginUser } from "@/lib/api";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { access_token } = await loginUser(email, password);
      await SecureStore.setItemAsync("token", access_token);
      Alert.alert("Success", "Logged in!");
      router.push("/"); // Redirect to home or dashboard
    } catch (err: any) {
      Alert.alert("Login Failed", err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput autoCapitalize="none" onChangeText={setEmail} value={email} style={{ borderWidth: 1 }} />
      <Text>Password:</Text>
      <TextInput secureTextEntry onChangeText={setPassword} value={password} style={{ borderWidth: 1 }} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}