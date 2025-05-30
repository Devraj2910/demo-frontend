// User role types
export type UserRole = 'admin' | 'tech-lead' | 'user';

// Login credentials type
export type TLoginCredentials = {
  email: string;
  password: string;
};

// Team type
export type TTeam = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// Team response type
export type TTeamResponse = {
  success: boolean;
  data: TTeam[];
};

// Registration data type
export type TRegisterData = {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  team?: string;
};

// User type
export type TUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  team?: string;
};

// Authentication response type
export type TAuthResponse = {
  user: TUser;
  token?: string;
  status: number;
};

// API Auth Response (matches the actual API format)
export type TAPIAuthResponse = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  position?: string;
  token: string;
  expiresIn: number;
  success: boolean;
};

// Auth error type
export type TAuthError = {
  message: string;
  statusCode: number;
};
