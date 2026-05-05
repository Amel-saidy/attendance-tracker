import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Box, Paper, List, ListItem, ListItemText, Divider, Alert, Stack, CircularProgress } from '@mui/material';
import { checkIn, checkOut, getAttendanceHistory } from '../utils/api';
import QRCodeScanner from './QRCodeScanner';
import { motion, AnimatePresence } from 'framer-motion';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import HistoryIcon from '@mui/icons-material/History';

const MotionPaper = motion(Paper);

function Attendance() {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrMode, setQrMode] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await getAttendanceHistory();
      setAttendanceHistory(res.data.history);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      setError('Failed to load attendance history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleAttendanceAction = async (type) => {
    setError('');
    setSuccess('');
    try {
      const res = type === 'checkin' ? await checkIn() : await checkOut();
      setSuccess(res.data.message);
      fetchAttendance(); // Refresh history
      setQrMode(null);
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${type === 'checkin' ? 'check in' : 'check out'}.`);
    }
  };

  // Determine current status based on history
  const lastRecord = attendanceHistory[0];
  const isCheckedIn = lastRecord && !lastRecord.check_out;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <QrCodeScannerIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>
            Attendance
          </Typography>
        </Stack>

        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            mb: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
            Current Status
          </Typography>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mb: 3, 
              color: isCheckedIn ? 'success.main' : 'text.primary' 
            }}
          >
            {isCheckedIn ? 'Checked In' : 'Checked Out'}
          </Typography>

          <AnimatePresence>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          </AnimatePresence>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              disabled={isCheckedIn}
              onClick={() => setQrMode('checkin')}
              startIcon={<QrCodeScannerIcon />}
              sx={{ py: 1.5, px: 4 }}
            >
              Check In
            </Button>
            <Button
              variant="outlined"
              size="large"
              disabled={!isCheckedIn}
              onClick={() => setQrMode('checkout')}
              startIcon={<QrCodeScannerIcon />}
              sx={{ py: 1.5, px: 4 }}
            >
              Check Out
            </Button>
          </Stack>
        </MotionPaper>

        <AnimatePresence>
          {qrMode && (
            <MotionPaper
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              sx={{ p: 2, mb: 4, borderRadius: 4, overflow: 'hidden' }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
                Scanning for {qrMode === 'checkin' ? 'Check-In' : 'Check-Out'}...
              </Typography>
              <QRCodeScanner
                onScanSuccess={() => handleAttendanceAction(qrMode)}
              />
              <Button 
                fullWidth 
                variant="text" 
                onClick={() => setQrMode(null)} 
                sx={{ mt: 2 }}
              >
                Cancel Scan
              </Button>
            </MotionPaper>
          )}
        </AnimatePresence>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, mt: 6 }}>
          <HistoryIcon color="action" />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            History
          </Typography>
        </Stack>

        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 4, 
            border: '1px solid rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}
        >
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {attendanceHistory.length > 0 ? (
                attendanceHistory.map((record, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {new Date(record.check_in).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </Typography>
                        }
                        secondary={
                          <Stack direction="row" spacing={4} sx={{ mt: 1 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>CHECK IN</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{new Date(record.check_in).toLocaleTimeString()}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>CHECK OUT</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {record.check_out ? new Date(record.check_out).toLocaleTimeString() : '—'}
                              </Typography>
                            </Box>
                          </Stack>
                        }
                      />
                    </ListItem>
                    {index < attendanceHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No attendance records found.
                  </Typography>
                </Box>
              )}
            </List>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default Attendance;
