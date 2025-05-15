import axios from 'axios';
import type { HealthCheck } from '../../domain/entities/HealthCheck';
import type { DatabaseResponse } from '../../domain/entities/Database';

const BASE_URL = 'https://demo-hackathon.onrender.com/api';

export const api = {
  async getHealthCheck(): Promise<HealthCheck> {
    const response = await axios.get<HealthCheck>(`${BASE_URL}/health`);
    return response.data;
  },

  async getDatabases(): Promise<DatabaseResponse> {
    const response = await axios.get<DatabaseResponse>(`${BASE_URL}/databases`);
    return response.data;
  }
}; 