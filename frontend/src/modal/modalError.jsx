import React from 'react'
import { Box, Button, Modal } from "@mui/material";




const ModalError = ({open, onClose, error }) => {
  return (
    <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="registration-failed-modal-title"
        aria-describedby="registration-failed-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        BackdropProps={{
          style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Ajustar opacidad del fondo
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.paper",
            p: 4,
            zIndex: 1500, // Ajustar z-index para que aparezca por encima del fondo
          }}
        >
          <h2 id="registration-failed-modal-title">${error}</h2>
          <Button onClick={onClose} color="secondary" variant="contained">
            Cerrar
          </Button>
        </Box>
        </Modal>
  )
}
export default ModalError;