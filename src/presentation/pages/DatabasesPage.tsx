import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { api } from '../../infrastructure/services/api';
import type { Database, DatabaseResponse } from '../../domain/entities/Database';

export const DatabasesPage = () => {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const response = await api.getDatabases();
        setDatabases(response.data.databases);
        setError(null);
      } catch (err) {
        setError('Failed to fetch databases');
      }
    };

    fetchDatabases();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Databases
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Encoding</TableCell>
                <TableCell>Collate</TableCell>
                <TableCell>Ctype</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {databases.map((db) => (
                <TableRow key={db.name}>
                  <TableCell>{db.name}</TableCell>
                  <TableCell>{db.owner}</TableCell>
                  <TableCell>{db.encoding}</TableCell>
                  <TableCell>{db.collate}</TableCell>
                  <TableCell>{db.ctype}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}; 