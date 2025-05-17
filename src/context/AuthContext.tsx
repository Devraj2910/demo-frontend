"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getAuthAPI, User } from "../api";
import Cookies from "js-cookie";

// Get the API implementation
const authAPI = getAuthAPI();

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
    position: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        const authToken = Cookies.get("auth-token");

        if (savedUser && authToken) {
          setUser(JSON.parse(savedUser));
        } else if (savedUser && !authToken) {
          // User data exists but token is missing - restore the token
          Cookies.set("auth-token", "authenticated-token-value", {
            expires: 7,
          });
          setUser(JSON.parse(savedUser));
        } else if (!savedUser && authToken) {
          // Token exists but user data is missing - clear token to maintain consistency
          Cookies.remove("auth-token");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Clear potentially corrupted data
        localStorage.removeItem("user");
        Cookies.remove("auth-token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Use the API service instead of direct implementation
      const userData = await authAPI.login(email, password);

      // Save user data to localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Set auth token in cookie for middleware
      Cookies.set("auth-token", "authenticated-token-value", { expires: 7 }); // Expires in 7 days

      // Navigate to dashboard
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
    position: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Use the API service instead of direct implementation
      const userData = await authAPI.register(
        email,
        password,
        firstName,
        lastName,
        role,
        position
      );

      // Save user data to localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Set auth token in cookie for middleware
      Cookies.set("auth-token", "authenticated-token-value", { expires: 7 }); // Expires in 7 days

      // Navigate to dashboard
      router.push("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to register");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    Cookies.remove("auth-token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
