// Import the base API URL from a shared config file
import { API_URL } from "@/constants/config";

/**
 * Registers a new user with the backend.
 * Sends a POST request with email and password as JSON payload.
 * Throws an error if the registration fails.
 */
export async function registerUser(email: string, password: string) {
  const payload = { email, password }; // Data to send to the backend

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Ensure the server knows it's JSON
    },
    body: JSON.stringify(payload), // Convert payload to JSON string
  });

  const data = await res.json(); // Parse response JSON

  // If the response is not OK (status code not in 200–299), throw an error
  if (!res.ok) {
    throw new Error(data.detail || "Registration failed");
  }

  return data; // Return response data if successful
}

/**
 * Logs in a user with email and password.
 * Sends a POST request and expects a JWT token in response.
 * Throws an error if login fails.
 */
export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // JSON payload header
    },
    body: JSON.stringify({ email, password }), // Convert credentials to JSON string
  });

  // If login fails, parse and throw an error message from the backend
  if (!response.ok) {
    const err = await response.json(); // Parse error response
    throw new Error(err.detail || "Login failed");
  }

  return response.json(); // Return parsed token or user info
}