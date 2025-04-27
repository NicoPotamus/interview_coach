import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          setToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error loading token from AsyncStorage", error);
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Always end loading no matter what
      }
    };

    loadToken();
  }, []);

  const login = async (newToken: string) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      setToken(newToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error saving token during login", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error removing token during logout", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};