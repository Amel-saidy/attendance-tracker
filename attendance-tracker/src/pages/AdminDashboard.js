import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Paper, Stack, Chip, IconButton, Tooltip, Alert } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import API from '../utils/api';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  const fetchAllAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/attendance/admin/all');
      const flattenedRecords = res.data.records.map((r, i) => ({
        id: r.id || i,
        name: r.User?.name || 'N/A',
        email: r.User?.email || 'N/A',
        role: r.User?.role || 'user',
        checkIn: r.check_in ? new Date(r.check_in).toLocaleString() : 'N/A',
        checkOut: r.check_out ? new Date(r.check_out).toLocaleString() : '—',
        rawCheckIn: r.check_in,
        rawCheckOut: r.check_out,
      }));
      setRecords(flattenedRecords);
    } catch (error) {
      console.error('Error fetching admin records:', error);
      setError('Failed to fetch attendance records. Please check your permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Role', 'Check-In', 'Check-Out'];
    const rows = records.map((r) => [
      `"${r.name}"`,
      `"${r.email}"`,
      `"${r.role}"`,
      `"${r.checkIn}"`,
      `"${r.checkOut}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_report_${new Date().toLocaleDateString()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { field: 'name', headerName: 'Employee Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value.toUpperCase()} 
          color={params.value === 'admin' ? 'secondary' : 'default'} 
          size="small" 
          variant="outlined" 
        />
      )
    },
    { field: 'checkIn', headerName: 'Check-In', width: 160 },
    { field: 'checkOut', headerName: 'Check-Out', width: 160 },
  ];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ mt: { xs: 2, md: 4 }, mb: 8 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor employee attendance records
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-end' }}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={fetchAllAttendance} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />} 
              onClick={handleExport}
              disabled={records.length === 0}
              size="small"
              sx={{ py: 1 }}
            >
              Export CSV
            </Button>
          </Stack>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={0}
          sx={{ 
            height: { xs: 450, sm: 600 }, 
            width: '100%', 
            borderRadius: 4, 
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
          }}
        >
          <DataGrid
            rows={records}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700 },
              '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          />
        </MotionPaper>
      </Box>
    </Container>
  );
}

export default AdminDashboard;
