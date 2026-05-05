import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Container, Typography, Box } from '@mui/material';
import { logout } from '../utils/auth';
import API from '../utils/api';

function Dashboard() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;
        if (!userId) return;
        const res = await API.get(`/attendance/history?userId=${userId}`);
        setAttendance(res.data.history.map((record, index) => ({
          id: index + 1,
          checkIn: new Date(record.check_in).toLocaleString(),
          checkOut: record.check_out ? new Date(record.check_out).toLocaleString() : 'N/A',
        })));
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };
    fetchAttendance();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'checkIn', headerName: 'Check-In', width: 200 },
    { field: 'checkOut', headerName: 'Check-Out', width: 200 },
  ];

  return (
    <Container maxWidth="md">
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
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#1976d2', fontSize: { xs: '2rem', sm: '2.5rem' } }}>
          Dashboard
        </Typography>
        <DataGrid rows={attendance} columns={columns} pageSize={5} autoHeight />

        <button variant="contained" color='secondary' onClick={logout}>Logout</button>
      </Box>
    </Container>
  );
}

export default Dashboard;

