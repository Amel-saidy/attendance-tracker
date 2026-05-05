import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import QrScanner from 'react-qr-scanner';

function QRCodeScanner({ onScanSuccess }) {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true); // Controls whether the scanner is active
  const [timeoutReached, setTimeoutReached] = useState(false); // Tracks if the timeout has been reached

  // Handle QR code scan
  const handleScan = (data) => {
    if (data) {
      setScanResult(data.text);
      onScanSuccess(data.text);
      setIsScanning(false); // Stop scanning after a successful scan
    }
  };

  // Handle scanner errors
  const handleError = (err) => {
    console.error('QR Scan Error:', err);
  };

  // Timeout after 15 seconds
  useEffect(() => {
    if (isScanning) {
      const timeoutId = setTimeout(() => {
        setIsScanning(false); // Stop scanning
        setTimeoutReached(true); // Set timeout state to true
      }, 15000); // 15 seconds

      // Cleanup the timeout when the component unmounts or scanning stops
      return () => clearTimeout(timeoutId);
    }
  }, [isScanning]);

  // Reset the scanner
  const handleScanAgain = () => {
    setScanResult(null);
    setIsScanning(true);
    setTimeoutReached(false);
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 4, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Scan QR Code for Attendance
      </Typography>

      {/* QR Scanner */}
      {isScanning ? (
        <Box sx={{ width: '100%', maxWidth: '400px', margin: '0 auto', mb: 3 }}>
          <QrScanner
            delay={300}
            onScan={handleScan}
            onError={handleError}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Box>
      ) : (
        <Typography sx={{ mt: 2, color: 'text.secondary', fontStyle: 'italic' }}>
          Scanner is inactive.
        </Typography>
      )}

      {/* Scan Result */}
      {scanResult && (
        <Typography sx={{ mt: 2, color: 'green', fontWeight: 'bold' }}>
          Successfully Scanned: {scanResult}
        </Typography>
      )}

      {/* Timeout Message */}
      {timeoutReached && !scanResult && (
        <Typography sx={{ mt: 2, color: 'error.main', fontWeight: 'bold' }}>
          Scan timed out. Please try again.
        </Typography>
      )}

      {/* Scan Again Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: '200px', fontWeight: 'bold' }}
        onClick={handleScanAgain}
      >
        Scan Again
      </Button>
    </Box>
  );
}

export default QRCodeScanner;