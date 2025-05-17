import { Kudo, User } from '../domain/entities/Kudo';

export class KudosApiClient {
  private static instance: KudosApiClient;
  private baseUrl: string = 'https://demo-hackathon.onrender.com/api';
  private authToken: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwOGNkNjQ1Ni01MDJmLTRiOGYtODliMy1iNGM2ODQzMjYzZDQiLCJlbWFpbCI6ImRldnJhai5yYWpwdXRAYXZlc3RhdGVjaG5vbG9naWVzLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NzQ5ODQ5OSwiZXhwIjoxNzQ3NTAyMDk5fQ.VAKGODM8nYra6xQGr46UIaNP2cPqJokYGVJ3vVeFSqw';

  private constructor() {}

  public static getInstance(): KudosApiClient {
    if (!KudosApiClient.instance) {
      KudosApiClient.instance = new KudosApiClient();
    }
    return KudosApiClient.instance;
  }

  // Common headers for all requests
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    };
  }

  // Fetch all kudos
  public async getAllKudos(): Promise<Kudo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/cards`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error fetching kudos: ${response.statusText}`);
      }

      const jsonResponse = await response.json();

      // Handle the nested response structure
      if (jsonResponse.success && jsonResponse.data && Array.isArray(jsonResponse.data.cards)) {
        return jsonResponse.data.cards;
      } else if (Array.isArray(jsonResponse)) {
        return jsonResponse;
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Failed to fetch kudos:', error);
      throw error;
    }
  }

  // Search users by name
  public async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/search?term=${encodeURIComponent(searchTerm)}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error searching users: ${response.statusText}`);
      }

      const jsonResponse = await response.json();

      // Handle the nested response structure
      if (jsonResponse.success && jsonResponse.data && Array.isArray(jsonResponse.data.users)) {
        return jsonResponse.data.users;
      } else if (Array.isArray(jsonResponse)) {
        return jsonResponse;
      } else if (jsonResponse.success && Array.isArray(jsonResponse.data)) {
        return jsonResponse.data;
      }

      throw new Error('Unexpected API response format');
    } catch (error) {
      console.error('Failed to search users:', error);
      // Fallback mock users if API fails
      return [
        {
          id: '08cd6456-502f-4b8f-89b3-b4c6843263d4',
          email: 'devraj.rajput@avestatechnologies.com',
          firstName: 'DEVRAJ',
          lastName: null,
          fullName: 'DEVRAJ',
        },
        {
          id: '963a292c-160b-4d88-becf-12f90875caaf',
          email: 'adity.singh@avestatechnologies.com',
          firstName: null,
          lastName: null,
          fullName: 'Aditya Singh',
        },
      ].filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  // Create a new kudo
  public async createKudo(kudoData: Partial<Kudo>): Promise<Kudo> {
    try {
      const response = await fetch(`${this.baseUrl}/cards`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(kudoData),
      });

      if (!response.ok) {
        throw new Error(`Error creating kudo: ${response.statusText}`);
      }

      const jsonResponse = await response.json();

      // Handle the nested response structure
      if (jsonResponse.success && jsonResponse.data) {
        return jsonResponse.data;
      } else {
        return jsonResponse;
      }
    } catch (error) {
      console.error('Failed to create kudo:', error);
      throw error;
    }
  }
}
