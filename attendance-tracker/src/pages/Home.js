import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SecurityIcon from '@mui/icons-material/Security';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

function Home() {
  const features = [
    {
      title: 'QR Attendance',
      description: 'Quick and easy check-ins using secure QR code technology.',
      icon: <QrCodeScannerIcon sx={{ fontSize: 40, color: '#1a237e' }} />,
    },
    {
      title: 'Secure Access',
      description: 'Role-based access control and encrypted user data.',
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#c2185b' }} />,
    },
    {
      title: 'Real-time Stats',
      description: 'Instant reporting and tracking for administrators.',
      icon: <QueryStatsIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
    },
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)',
          color: 'white',
          pt: { xs: 8, md: 15 },
          pb: { xs: 12, md: 15 },
          borderRadius: { xs: 0, md: '0 0 100px 100px' },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }, mb: 2, lineHeight: 1.1 }}>
                  Modern Attendance <br />
                  <span style={{ color: '#ff4081' }}>Simplified.</span>
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 400, maxWidth: 600, mx: { xs: 'auto', md: 0 }, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
                  The most efficient way to track employee presence and manage workforce data at Obentas Global.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': { bgcolor: '#f0f0f0' },
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    size="large"
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': { borderColor: '#ff4081', color: '#ff4081' },
                    }}
                  >
                    Register
                  </Button>
                </Stack>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
               <MotionBox
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 sx={{ textAlign: 'center' }}
               >
                 <Box
                   component="img"
                   src="https://img.freepik.com/free-vector/modern-check-mark-design_1035-8968.jpg?t=st=1714900000&exp=1714903600&hmac=placeholder"
                   alt="Attendance"
                   sx={{ width: '100%', maxWidth: 400, filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.3))' }}
                   onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400/1a237e/ffffff?text=Attendance+Tracker' }}
                 />
               </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -8 }, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MotionPaper
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  height: '100%',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-10px)' },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </MotionPaper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 15 }, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
          Ready to track your presence?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: { xs: '1.1rem', md: '1.2rem' } }}>
          Join hundreds of employees at Obentas Global who use our platform daily.
        </Typography>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          size="large"
          sx={{ px: 6, py: 2, borderRadius: 50, width: { xs: '100%', sm: 'auto' } }}
        >
          Go to Dashboard
        </Button>
      </Container>
    </Box>
  );
}

export default Home;
