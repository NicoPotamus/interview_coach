import { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Title, Text } from "react-native-paper";
import { registerUser } from "@/lib/api";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await registerUser(email, password);
      console.log("Registration successful", response);
      router.push("/login");
    } catch (err: any) {
      let errorMessage = "An unknown error occurred";
  
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null) {
        try {
          // Try to get error message from response data
          if ('response' in err && err.response?.data) {
            errorMessage = err.response.data.detail || err.response.data.message || JSON.stringify(err.response.data);
          } else {
            errorMessage = err.message || JSON.stringify(err);
          }
        } catch (e) {
          errorMessage = "Failed to parse error message";
        }
      }
  
      setError(errorMessage);
      console.error("registerError:", { originalError: err, parsedMessage: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4 justify-center">
      <View className="bg-white p-6 rounded-lg shadow-md">
        <Title className="text-center text-xl font-bold mb-6">
          Create Account
        </Title>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          className="mb-4"
          disabled={loading}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          className="mb-4"
          disabled={loading}
        />

        {error && (
          <Text 
            variant="bodyMedium" 
            className="text-red-500 text-center mb-4"
            style={{ fontSize: 14 }}
          >
            {typeof error === 'string' ? "Error: " + error : 'An error occurred during registration'}
          </Text>
        )}

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          className="mb-4"
        >
          Register
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/login")}
          disabled={loading}
          className="mt-2"
        >
          Already have an account? Login
        </Button>
      </View>
    </View>
  );
}