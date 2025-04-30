// Import core React and state management
import { useState } from "react";
import { View } from "react-native";

// Import UI components from React Native Paper
import { TextInput, Button, Title, Text } from "react-native-paper";

// API helper function to log in a user
import { loginUser } from "@/lib/api";

// Router hook from Expo Router for navigation
import { useRouter } from "expo-router";

// Auth context hook to handle global login state
import { useAuth } from "@/context/AuthContext";

// Define the Login screen component
export default function Login() {
  const router = useRouter();        // Used for screen navigation
  const { login } = useAuth();       // Auth context function to store token

  // State hooks for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for loading spinner and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to handle login logic
  const handleLogin = async () => {
    // Basic validation: both fields must be filled
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);  // Show loading spinner
    setError("");      // Clear previous error

    try {
      // Call the API to log in the user
      const { access_token } = await loginUser(email, password);

      // Store the token in context
      await login(access_token);

      // Navigate to the home page after successful login
      router.push("/");
    } catch (err: any) {
      // Default fallback error message
      let errorMessage = "An unknown error occurred";

      // Handle various error formats safely
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null) {
        try {
          // Check if response contains API error message
          if ('response' in err && err.response?.data) {
            errorMessage = err.response.data.detail || err.response.data.message || JSON.stringify(err.response.data);
          } else {
            errorMessage = err.message || JSON.stringify(err);
          }
        } catch (e) {
          errorMessage = "Failed to parse error message";
        }
      }

      // Display and log the error
      setError(errorMessage);
      console.error("loginError:", { originalError: err, parsedMessage: errorMessage });
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Return the UI structure for the login form
  return (
    <View className="flex-1 p-4 justify-center">
      <View className="bg-white p-6 rounded-lg shadow-md">
        {/* Title */}
        <Title className="text-center text-xl font-bold mb-6">
          Login
        </Title>

        {/* Email Input Field */}
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

        {/* Password Input Field */}
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          className="mb-4"
          disabled={loading}
        />

        {/* Error Message */}
        {error && (
          <Text 
            variant="bodyMedium" 
            className="text-red-500 text-center mb-4"
          >
            {String(error)}
          </Text>
        )}

        {/* Submit Login Button */}
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          className="mb-4"
        >
          Login
        </Button>

        {/* Link to Register Screen */}
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