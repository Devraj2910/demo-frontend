export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
}

export interface Kudo {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdFor: string;
  createdAt: string;
  updatedAt: string;
  creator: User;
  recipient: User;
  category?: string; // Optional for backward compatibility
}
