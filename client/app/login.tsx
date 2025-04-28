import { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Title, Text } from "react-native-paper";
import { loginUser } from "@/lib/api";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { access_token } = await loginUser(email, password);
      await login(access_token);
      router.push("/");
    } catch (err: any) {
      let errorMessage = "An unknown error occurred";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null) {
        try {
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
      console.error("loginError:", { originalError: err, parsedMessage: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4 justify-center">
      <View className="bg-white p-6 rounded-lg shadow-md">
        <Title className="text-center text-xl font-bold mb-6">
          Login
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
          >
            {String(error)}
          </Text>
        )}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          className="mb-4"
        >
          Login
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/register")}
          disabled={loading}
          className="mt-2"
        >
          Don't have an account? Register
        </Button>
      </View>
    </View>
  );
}