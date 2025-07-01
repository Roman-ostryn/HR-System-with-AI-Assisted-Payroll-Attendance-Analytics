import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import ModalSucces from '../modalSucces'; 
import ModalError from '../modalError'; 
import LoadingSpinner from "../../loadingSpinner";
// import { desactivar } from "../../services/interfoliacion.services";


const ModalEstasSeguro = ({ open, onClose, onAccept }) => {
  // const [problemaDescripcion, setProblemaDescripcion] = useState(null)
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const USER = localStorage.getItem('id');
 
  const handleCancelar = () => {
    onClose(); // Cerrar el modal
  };

  const handleAceptar = () => {
    onAccept(1);
    onClose(); // Cerrar el modal
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-problema-title"
      aria-describedby="modal-problema-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(3px)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.primary[400],
          padding: '30px',
          borderRadius: '10px',
          width: { xs: '90%', sm: '70%', md: '500px' },
          boxShadow: 24,
        }}
      >
        {isLoading && <LoadingSpinner />}
        
        {registrationSuccess && <ModalSucces open={registrationSuccess} onClose={() => setRegistrationSuccess(null)} />}
        {registrationSuccess === false && <ModalError open={!registrationSuccess} onClose={() => setRegistrationSuccess(null)} error="Error al guardar el registro" />}

        <Typography variant="h4" color={colors.grey[100]} sx={{ marginBottom: '20px' }}>
          Estas Seguro?
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Typography variant="body1" color={colors.redAccent[400]} sx={{ marginBottom: '10px' }}>
            {error}
          </Typography>
        ) : (
          <>
            <Box sx={{ marginTop: '1px' }}>
              {/* <Typography variant="body2" color={colors.grey[100]}>
                Imagen:
              </Typography> */}
              <img   
                src={`/assets/estasSeguroxd.jpg`}
                alt="Imagen Estas Seguro"
                style={{ width: '400px', height: '250px', objectFit: 'cover', borderRadius: '8px', marginLeft: '2%', marginTop: '10%' }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{
                  backgroundColor: "rgb(206, 220, 0)",
                  border: "none",
                  color: "black",
                  height: "5vh",
                  width: "8vw",
                  borderRadius: "20px",
                  cursor: "pointer",
                  marginRight: "1vw",

                  "&:hover": { backgroundColor: "#bac609" },
                }}
                onClick={handleAceptar}
              >
                Aceptar
              </Button>
              <Button
                type="submit"
                color="#ffffff"
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  border: "none",
                  color: "#ffffff",
                  height: "5vh",
                  width: "8vw",
                  borderRadius: "20px",
                  cursor: "pointer",
                  marginRight: "1vw",

                  "&:hover": { backgroundColor: "#910707" },
                }}
                onClick={handleCancelar}
              >
                Cancelar
              </Button>
            </Box>
            {submitting && <LoadingSpinner />}
          </>
        )}
      </Box>
    </Modal>
  );
};
export default ModalEstasSeguro;