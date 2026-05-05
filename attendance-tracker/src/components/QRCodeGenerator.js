import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function QRCodeGenerator({ value }) {
  return (
    <div>
      <h2>Attendance QR Code</h2>
      <QRCodeCanvas
        value={value}
        size={200} // Larger QR code
        bgColor="#ffffff" // White background
        fgColor="#0000ff" // Blue QR code
        level="H" // High error correction
        includeMargin={true} // Include margin
      />
    </div>
  );
}

export default QRCodeGenerator;