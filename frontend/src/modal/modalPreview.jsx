import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

const ModalPreview = ({ open, onClose, data }) => {
  const etiquetas = data.trim().split('^XZ').filter(Boolean).map((etiqueta, index) => (
    <Box
      key={index}
      sx={{
        width: '10cm',
        height: '5cm',
        bgcolor: 'white',
        border: '1px solid black',
        marginBottom: '10px',
        padding: '10px',
        position: 'relative',
      }}
    >
      {etiqueta.split('\n').map((line, idx) => {
        const match = line.match(/\^FO(\d+),(\d+)\^A0N,\d+,\d+\^FD(.+)\^FS/);
        const qrMatch = line.match(/\^FO(\d+),(\d+)\^BQN,\d+,\d+\^FDQA,(.+)\^FS/);
        if (match) {
          const [, x, y, text] = match;
          return (
            <Typography
              key={idx}
              sx={{
                position: 'absolute',
                left: `${x / 8}px`,
                top: `${y / 8}px`,
                fontSize: '16px',
                color: 'black',
              }}
            >
              {text}
            </Typography>
          );
        } else if (qrMatch) {
          const [, x, y, qrData] = qrMatch;
          return (
            <img
              key={idx}
              src={qrData}
              alt="QR Code"
              style={{
                position: 'absolute',
                left: `${x / 8}px`,
                top: `${y / 8}px`,
                width: '110px',
                height: '110px',
              }}
            />
          );
        }
        return null;
      })}
    </Box>
  ));

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'auto',
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Vista Previa de la Etiqueta
        </Typography>
        <Box sx={{ mt: 2 }}>
          {etiquetas}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalPreview;
