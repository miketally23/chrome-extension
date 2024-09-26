
import React from 'react';
import QRCode from 'react-qr-code';
import { TextP } from '../App-styles';
import { Box } from '@mui/material';

export const AddressQRCode = ({ targetAddress }) => {
  return (
    <Box sx={{
      display: 'flex',
      gap: '10px',
      width: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      marginTop: '20px'
    }}>
      <TextP
                sx={{
                  textAlign: "center",
                  lineHeight: 1.2,
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                Your address
              </TextP>
      <QRCode 
        value={targetAddress}  // Your address here
        size={180}          // Adjust size as needed
        level="M"           // Error correction level (L, M, Q, H)
        bgColor="#FFFFFF"   // Background color (white)
        fgColor="#000000"   // Foreground color (black)
      />
    </Box>
  );
};
