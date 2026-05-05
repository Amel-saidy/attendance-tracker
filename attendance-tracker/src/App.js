import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, CssBaseline, 
  CircularProgress, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton,
  useMediaQuery, useTheme 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import UserProfile from './components/UserProfile';
import Attendance from './components/Attendance';
import API from './utils/api';
import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1a237e' },
    secondary: { main: '#c2185b' },
    background: { default: '#f4f5f7' },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const mTheme = useTheme();
  const isMobile = useMediaQuery(mTheme.breakpoints.down('md'));

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(data);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = user ? [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Attendance', path: '/attendance' },
    { label: 'Profile', path: '/profile' },
    ...(user.role === 'admin' ? [{ label: 'Admin', path: '/admin' }] : []),
  ] : [
    { label: 'Home', path: '/' },
    { label: 'Login', path: '/login' },
    { label: 'Register', path: '/register' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main' }}>
        Obentas Global
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={Link} to={item.path} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {user && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ textAlign: 'center', color: 'secondary.main' }}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.1)', bgcolor: 'white', color: 'text.primary' }}>
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'primary.main' }}>
               Obentas Global
            </Typography>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navItems.map((item) => (
                  <Button 
                    key={item.label} 
                    component={Link} 
                    to={item.path}
                    variant={item.label === 'Register' ? 'contained' : 'text'}
                  >
                    {item.label}
                  </Button>
                ))}
                {user && (
                  <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ ml: 1 }}>
                    Logout
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>

        <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 4, minHeight: '80vh', px: { xs: 2, sm: 3 } }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/attendance" element={user ? <Attendance /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
            <Route path="*" element={<Typography variant="h5" textAlign="center" sx={{ mt: 8 }}>404: Page not found</Typography>} />
          </Routes>
        </Container>

        <Box component="footer" sx={{ py: 4, backgroundColor: 'white', borderTop: '1px solid rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Attendance Tracker. Obentas Global Company.
          </Typography>
        </Box>
      </Router>
      <SpeedInsights />
    </ThemeProvider>
  );
}

export default App;
