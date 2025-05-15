import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { api } from '../../infrastructure/services/api';
import type { HealthCheck } from '../../domain/entities/HealthCheck';

export const HealthCheckPage = () => {
  const [healthStatus, setHealthStatus] = useState<HealthCheck | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        const data = await api.getHealthCheck();
        setHealthStatus(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch health status');
      }
    };

    fetchHealthStatus();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Health Check Status
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : healthStatus ? (
          <Box>
            <Typography variant="h6">Status: {healthStatus.status}</Typography>
          </Box>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Paper>
    </Container>
  );
}; 