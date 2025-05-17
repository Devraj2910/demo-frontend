// Real API implementations
// This file will be used when connecting to a real backend API

import { AuthAPI, User } from "./index";

// Configuration for API endpoints
const API_CONFIG = {
  baseUrl: "", // Empty for relative URLs
  endpoints: {
    login: "/api/auth/login",
    register: "/api/auth/register",
  },
};

/**
 * Real implementation of Auth API
 */
export class RealAuthAPI implements AuthAPI {
  async login(email: string, password: string): Promise<User> {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to login");
    }

    const data = await response.json();
    return {
      email: data.email || email,
      firstName: data.firstName || data.name || "User",
      lastName: data.lastName || "",
      role: data.role || "user",
      position: data.position || "",
    };
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
    position: string
  ): Promise<User> {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.register}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          role,
          position,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to register");
    }

    const data = await response.json();
    return {
      email: data.email || email,
      firstName: data.firstName || firstName,
      lastName: data.lastName || lastName,
      role: data.role || role,
      position: data.position || position,
    };
  }

  async validateToken(token: string): Promise<boolean> {
    // For this demo, we'll assume the token is valid if it exists
    return !!token;
  }
}
