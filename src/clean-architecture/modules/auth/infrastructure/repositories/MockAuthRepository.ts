import { AuthRepository } from "../../domain/interfaces/AuthRepository";
import {
  User,
  UserCredentials,
  UserRegistration,
  InvalidCredentialsError,
  UserExistsError,
} from "../../domain/entities/User";

/**
 * Mock implementation of the AuthRepository
 * This implementation uses an in-memory array of users
 */
export class MockAuthRepository implements AuthRepository {
  // Mock user data
  private users: (UserRegistration & { id: string })[] = [
    {
      id: "1",
      email: "user@user.com",
      password: "user",
      firstName: "Demo",
      lastName: "User",
      role: "admin",
      position: "Manager",
    },
    {
      id: "2",
      email: "demo@example.com",
      password: "password123",
      firstName: "Demo",
      lastName: "User",
      role: "admin",
      position: "Manager",
    },
  ];

  /**
   * Authenticate a user with credentials
   * @param credentials User credentials (email, password)
   * @returns Authenticated user data
   * @throws InvalidCredentialsError if credentials are invalid
   */
  async login(credentials: UserCredentials): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundUser = this.users.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!foundUser) {
      throw new InvalidCredentialsError();
    }

    return {
      email: foundUser.email,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      position: foundUser.position,
    };
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns The newly created user
   * @throws UserExistsError if a user with the same email already exists
   */
  async register(userData: UserRegistration): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if email already exists
    if (this.users.some((user) => user.email === userData.email)) {
      throw new UserExistsError();
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
    };

    // Add to mock users
    this.users.push(newUser);

    return {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      position: newUser.position,
    };
  }

  /**
   * Validate if a token is valid
   * @param token Authentication token
   * @returns Whether the token is valid
   */
  async validateToken(token: string): Promise<boolean> {
    // Simple mock validation - just check if token exists
    return !!token;
  }
}
