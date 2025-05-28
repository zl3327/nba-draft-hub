import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';

const AppHeader = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }} component={RouterLink} to="/">
          <SportsBasketballIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dallas Mavericks Draft Center
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader; 