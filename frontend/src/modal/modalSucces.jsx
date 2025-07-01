import React from 'react';
import { Box, Button, Modal } from '@mui/material';

const ModalSuccess = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="registration-success-modal-title"
      aria-describedby="registration-success-modal-description"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, // Ajustar opacidad del fondo
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          p: 4,
          zIndex: 1500, // Ajustar z-index para que aparezca por encima del fondo
        }}
      >
        <h2 id="registration-success-modal-title">Registrado con éxito</h2>
        <Button onClick={onClose} color="secondary" variant="contained">
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalSuccess;
