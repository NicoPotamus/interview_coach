import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { registerUser } from "@/lib/api";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const { access_token } = await registerUser(email, password);
      await SecureStore.setItemAsync("token", access_token);
      
      // Add this line:
      const savedToken = await SecureStore.getItemAsync("token");
      console.log("Saved token:", savedToken);
  
      Alert.alert("Success", "Account created!");
      router.push("/login"); // or dashboard route
    } catch (err: any) {
      Alert.alert("Registration Failed", err.message);
      console.error("Registration error:", err);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Text>Password:</Text>
      <TextInput
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}