
import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme'; 
import { getOneDatos } from '../../services/productos.services';
import { getOneProblemaCalandra } from '../../services/reporteCalandra.services';
import { PostReporteSalaLimpiaSK } from '../../services/reporteSalaLimpia.services'; 
import io from 'socket.io-client';
import ModalSucces from '../modalSucces'; 
import ModalError from '../modalError'; 
import LoadingSpinner from "../../loadingSpinner";
import  getUrlSocket from '../../utils/getUrlSocket';


const socket = io(getUrlSocket(), {
  transports: ['websocket', 'polling']
});

const ModalProblema = ({ open, onClose, registro }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [producto, setProducto] = useState(null);
  const [problemaDescripcion, setProblemaDescripcion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchProducto = async () => {
      if (registro?.datos?.id_producto && !isNaN(registro.datos.id_producto)) {
        setIsLoading(true);
        try {
          const productoData = await getOneDatos(registro.datos.id_producto);
          setProducto(productoData);
        } catch (error) {
          setError('Error al obtener el producto');
        } finally {
          setIsLoading(false);
        }
      }
    };



    if (open) {
      fetchProducto();
      // fetchProblemaDescripcion();
    }
  }, [open, registro]);

  if (!registro || !registro.datos) {
    return null; // O puedes manejar un estado de carga
  }

  const handleAceptar = async () => {
        setSubmitting(true);
        setRegistrationSuccess(null);
        try {
          const data = {
            entroproblema: registro?.datos?.problemaanterior,
            id_problemasalalimpia: registro?.datos?.id_problema,
            obs: registro.datos.obs,
            imagenes: registro.datos.imagenes,
            estado_problema: registro.datos.estado_problema,
            id_usuario: registro.datos.id_usuario,
            id_registro: registro?.datos?.id_producto,
            turno: "a definir",
            serie: registro?.datos?.cod,
          };
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const response = await PostReporteSalaLimpiaSK(data);
          setRegistrationSuccess(true);
          
          setTimeout(() => {
            onClose();
          }, 4000);
        } catch (error) {
          console.error('Error guardando el registro:', error);
          setRegistrationSuccess(false);
        } finally {
          setSubmitting(false);
        }
      };
    
      const handleCancelar = () => {
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
          Reporte de Problemas
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Typography variant="body1" color={colors.redAccent[400]} sx={{ marginBottom: '20px' }}>
            {error}
          </Typography>
        ) : (
          <>
            
            <Typography variant="body1" color={colors.grey[100]}>
              Código Producto: <strong>{producto?.cod || 'No disponible'}</strong>
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              ID Reporte: <strong>{registro.datos.id_producto}</strong>
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              Estado del Problema: <strong>{registro.datos.estado_problema}</strong>
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              Descripción del Problema: <strong>{registro.datos.id_problema || 'Descripción no disponible'}</strong>
            </Typography>

            {registro.datos.imagenes ? (
              <Box sx={{ marginTop: '20px' }}>
                <Typography variant="body2" color={colors.grey[100]}>
                  Imagen:
                </Typography>
                <img
                  src={`http://192.168.88.69:5003${registro.datos.imagenes}`}
                  alt="Imagen del problema"
                  style={{ width: '400px', height: '250px', objectFit: 'cover', borderRadius: '8px', marginTop: '10%' }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color={colors.grey[100]} sx={{ marginTop: '20px' }}>
                No hay imágenes disponibles.
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAceptar}
                sx={{ padding: '10px 20px' }}
              >
                Aceptar
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancelar}
                sx={{ padding: '10px 20px' }}
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

export default ModalProblema;
