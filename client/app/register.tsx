// Import React and hooks
import { useState } from "react";

// Import UI components
import { View } from "react-native";
import { TextInput, Button, Title, Text } from "react-native-paper";

// Import API call to register the user
import { registerUser } from "@/lib/api";

// Import navigation hook from Expo Router
import { useRouter } from "expo-router";

// Optional: SecureStore if needed for future token storage (currently unused)
import * as SecureStore from "expo-secure-store";

// Define the Register screen component
export default function Register() {
  const router = useRouter();  // Used for navigation after registration

  // Form state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to handle the registration process
  const handleRegister = async () => {
    // Validate that both fields are filled
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);  // Start loading indicator
    setError("");      // Clear previous errors

    try {
      // Call the API to register the user
      const response = await registerUser(email, password);
      console.log("Registration successful", response);

      // Navigate to login screen after successful registration
      router.push("/login");
    } catch (err: any) {
      // Initialize a default error message
      let errorMessage = "An unknown error occurred";

      // Attempt to safely extract message from various error types
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

      // Set the error message in state and log it
      setError(errorMessage);
      console.error("registerError:", { originalError: err, parsedMessage: errorMessage });
    } finally {
      // Stop loading whether success or failure
      setLoading(false);
    }
  };

  // Return the registration UI
  return (
    <View className="flex-1 p-4 justify-center">
      <View className="bg-white p-6 rounded-lg shadow-md">
        {/* Page title */}
        <Title className="text-center text-xl font-bold mb-6">
          Create Account
        </Title>

        {/* Email input field */}
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

        {/* Password input field */}
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          className="mb-4"
          disabled={loading}
        />

        {/* Error message display */}
        {error && (
          <Text 
            variant="bodyMedium" 
            className="text-red-500 text-center mb-4"
            style={{ fontSize: 14 }}
          >
            {typeof error === 'string' ? "Error: " + error : 'An error occurred during registration'}
          </Text>
        )}

        {/* Submit registration button */}
        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          className="mb-4"
        >
          Register
        </Button>

        {/* Link to login screen */}
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