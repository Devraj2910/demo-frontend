// Define the User entity in the domain layer
export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  position: string;
}

// Value objects related to User
export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  firstName: string;
  lastName: string;
  role: string;
  position: string;
}

// Domain errors
export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}

export class UserExistsError extends Error {
  constructor() {
    super("User with this email already exists");
    this.name = "UserExistsError";
  }
}
