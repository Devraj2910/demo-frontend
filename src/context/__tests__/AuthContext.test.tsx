import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../AuthContext";

// Mock the API module
jest.mock("../../api", () => {
  return {
    getAuthAPI: jest.fn(() => ({
      login: jest.fn(async (email, password) => {
        if (email === "demo@example.com" && password === "password123") {
          return {
            email: "demo@example.com",
            firstName: "Demo",
            lastName: "User",
            role: "admin",
            position: "Manager",
          };
        }
        throw new Error("Invalid credentials");
      }),
      register: jest.fn(
        async (email, password, firstName, lastName, role, position) => {
          if (email === "new@example.com") {
            return {
              email,
              firstName,
              lastName,
              role,
              position,
            };
          }
          throw new Error("User with this email already exists");
        }
      ),
      validateToken: jest.fn(async (token) => !!token),
    })),
    User: {},
  };
});

// Mock js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn().mockImplementation((name) => {
    if (name === "auth-token") return null; // Default to no token
  }),
  set: jest.fn(),
  remove: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// Test component to expose hooks for testing
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="user">{JSON.stringify(auth.user)}</div>
      <div data-testid="error">{auth.error}</div>
      <button onClick={() => auth.login("demo@example.com", "password123")}>
        Login
      </button>
      <button
        onClick={() =>
          auth.register(
            "new@example.com",
            "password123",
            "John",
            "Doe",
            "user",
            "Developer"
          )
        }
      >
        Register
      </button>
      <button onClick={auth.logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("login - successful", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    // Click login button
    const button = screen.getByText("Login");
    await act(async () => {
      await userEvent.click(button);
    });

    // Should update state with user
    await waitFor(() => {
      const userContent = screen.getByTestId("user").textContent!;
      const userData = JSON.parse(userContent);
      expect(userData.email).toBe("demo@example.com");
      expect(userData.firstName).toBe("Demo");
    });

    // Should store user in localStorage
    const savedUser = JSON.parse(localStorage.getItem("user")!);
    expect(savedUser.email).toBe("demo@example.com");
  });

  test("login - failure", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    // For login failure, we'll use auth directly with incorrect credentials
    const { result } = await act(async () => {
      const auth = useAuth();
      let result = { success: false, error: null };

      try {
        await auth.login("wrong@example.com", "wrongpassword");
        result.success = true;
      } catch (error: any) {
        result.error = error.message;
      }

      return { result };
    });

    // Should update error state
    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe(
        "Invalid credentials"
      );
    });
  });

  test("register - successful", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    // Click register button
    const button = screen.getByText("Register");
    await act(async () => {
      await userEvent.click(button);
    });

    // Should update state with new user after auto-login
    await waitFor(() => {
      const userContent = screen.getByTestId("user").textContent!;
      const userData = JSON.parse(userContent);
      expect(userData.email).toBe("new@example.com");
      expect(userData.firstName).toBe("John");
    });
  });

  test("logout", async () => {
    // Set user in localStorage
    const user = {
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "user",
      position: "Developer",
    };
    localStorage.setItem("user", JSON.stringify(user));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for user to be loaded from localStorage
    await waitFor(() => {
      const userContent = screen.getByTestId("user").textContent!;
      expect(JSON.parse(userContent).email).toBe("test@example.com");
    });

    // Click logout
    const button = screen.getByText("Logout");
    await act(async () => {
      await userEvent.click(button);
    });

    // Should clear user state
    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("null");
    });

    // Should clear localStorage
    expect(localStorage.getItem("user")).toBeNull();
  });
});
