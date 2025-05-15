import { Box, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} Demo App. All rights reserved.
      </Typography>
    </Box>
  );
}; 