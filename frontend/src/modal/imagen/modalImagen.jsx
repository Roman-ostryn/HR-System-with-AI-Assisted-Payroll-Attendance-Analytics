import React, { useEffect } from 'react';
import { Modal, Box } from '@mui/material';

const ModalImage = ({ open, onClose, imageSrc }) => {

 useEffect(() => {
      if (imageSrc) {
        // setIdRetallo(id);
        // Puedes usar el id para hacer llamadas al backend o manejar lógica adicional
      }
    }, [imageSrc]);


  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-image-title"
      aria-describedby="modal-image-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={imageSrc}
          alt="Imagen"
          style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '10px' }}
        />
      </Box>
    </Modal>
  );
};

export default ModalImage;
