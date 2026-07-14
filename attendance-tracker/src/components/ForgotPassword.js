import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = Request Code, 2 = Reset Password
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugCode, setDebugCode] = useState(''); // To display code for local tests
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage('A reset code has been generated. For testing/demo purposes, check your terminal console or copy the code below.');
      if (res.data.debugCode) {
        setDebugCode(res.data.debugCode);
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await API.post('/auth/reset-password', { email, code, newPassword });
      setMessage('Password reset successfully! Redirecting you to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={0} sx={{ p: 4, mt: 8, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {step === 1 ? 'Enter your email to request a reset code' : 'Enter the code and your new password'}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        {debugCode && (
          <Alert severity="warning" sx={{ mb: 2, fontWeight: 'bold' }}>
            Demo Code: {debugCode}
          </Alert>
        )}

        {step === 1 ? (
          <Box component="form" onSubmit={handleRequestCode}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleResetPassword}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Verification Code (6 digits)"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </Button>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Remember your password? <Link to="/login" style={{ color: '#1a237e', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default ForgotPassword;
