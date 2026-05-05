import React from 'react';

function BackgroundWrapper({ children }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}

export default BackgroundWrapper;