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
      const response = await registerUser(email, password);
      console.log("Registration successful", response);
      Alert.alert("Success", "Registered!");
      router.push("/login");
    } catch (err: any) {
      let errorMessage = "An unknown error occurred";
  
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object") {
        try {
          errorMessage = JSON.stringify(err);
        } catch (e) {
          errorMessage = "Error parsing error message";
        }
      }
  
      Alert.alert("Registration Failed", errorMessage);
      console.error("registerError", errorMessage);
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