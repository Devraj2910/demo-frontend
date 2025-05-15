import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Demo App
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Health Check
          </Button>
          <Button color="inherit" component={Link} to="/databases">
            Databases
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 