import React from 'react';
import QRCodeGenerator from './QRCodeGenerator';
import { Container, Box, Typography } from '@mui/material';

function UserProfile() {
  // Safely get the logged-in user from localStorage
  const userString = localStorage.getItem('user');
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch {
    user = null;
  }

  if (!user) {
    return <div>No user information found.</div>;
  }

  // Use user.image if available, else a default avatar
  const imageUrl = user.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'User');

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: { xs: 4, md: 8 },
          mb: { xs: 4, md: 8 },
          p: { xs: 2, sm: 4 },
          background: '#fff',
          borderRadius: 3,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {user && (
          <img
            src={imageUrl}
            alt="Profile"
            style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }}
          />
        )}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#1976d2', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          User Profile
        </Typography>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <h3>Your QR Code</h3>
        <QRCodeGenerator value={user.id ? user.id.toString() : ''} />
      </Box>
    </Container>
  );
}

export default UserProfile;