// ModalOpcion.jsx
import React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';

const ModalOpcion = ({ open, onClose, onSelect }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'absolute', // Usa posición absoluta para centrar
          top: '50%', // Centrar verticalmente
          left: '50%', // Centrar horizontalmente
          transform: 'translate(-50%, -50%)', // Ajusta la posición para centrar
          borderRadius: 2, // Añade bordes redondeados
          width: { xs: '90%', sm: '400px' }, // Ancho responsivo
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          ¿Llego con Problemas?
        </Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              onSelect("Sí");
              onClose();
            }}
          >
            Sí
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onSelect("No");
              onClose();
            }}
            sx={{ ml: 2 }}
          >
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalOpcion;