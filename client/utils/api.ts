const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}