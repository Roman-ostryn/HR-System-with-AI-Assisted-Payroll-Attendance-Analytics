import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import { getOneProblemaCalandra } from '../../services/reporteCalandra.services';
import { PostReporteCalandra, PostReporteCalandraSK} from '../../services/reporteCalandra.services';
import { getOneDatos } from '../../services/productos.services';
import ModalSucces from '../modalSucces'; 
import ModalError from '../modalError'; 
import LoadingSpinner from "../../loadingSpinner";

const ModalProblema = ({ open, onClose, registro }) => {
  const [problemaDescripcion, setProblemaDescripcion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const USER = localStorage.getItem('id');
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      const ID =  registro.cod_paquete
      if (ID && !isNaN(ID)) {        
        setIsLoading(true);
        try {
          const productoData = await getOneDatos(ID);
          setProducto(productoData.cod_paquete);
        } catch (error) {
          setError('Error al obtener el producto');
        } finally {
          setIsLoading(false);
        }
      }else if(typeof ID == 'string') {
        setProducto(ID || 'Descripción no disponible');
        setLoading(false);
      }
    };

    const fetchProblemaDescripcion = async () => {
      const idProblema = registro?.problema || registro?.problemasalalimpia;
      // Verificar si el id_problemasalalimpia es un número válido
      if (idProblema && !isNaN(idProblema)) {
        // Si es un número, llama al servicio
        try {
          const problemaData = await getOneProblemaCalandra(idProblema);
          setProblemaDescripcion(problemaData.descripcion || 'Descripción no disponible');
        } catch (error) {
          console.error('Error al obtener la descripción del problema:', error); // Registrar el error
          setError('Error al obtener la descripción del problema');
        } finally {
          setLoading(false);
        }
      } else if (typeof idProblema === 'string') {
        // Si es un string, se asigna directamente a setProblemaDescripcion
        setProblemaDescripcion(idProblema || 'Descripción no disponible');
        setLoading(false);
      } else {

        // Si no hay id válido
        setLoading(false);
        setError('No se proporcionó un ID de problema válido.');
      }
    };
    

    
    if (open) {
      setLoading(true);
      fetchProducto();
      fetchProblemaDescripcion();
    }
  }, [open, registro]);

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

        {loading ? (
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
              Producto: <strong>{ producto }</strong>
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              Serie: <strong>{registro?.serie }</strong>
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              Llegó así?: <strong>{registro?.entroproblema || "SI"}</strong>
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              Estado del Problema: <strong>{registro?.estado_paquete || registro?.estado_problema}</strong>
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              Problema Detectado: <strong>{problemaDescripcion}</strong>
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              Observaciones: <strong>{registro?.obs || 'No disponible' }</strong>
            </Typography>

            {registro?.imagen ? (
              <Box sx={{ marginTop: '20px' }}>
                <Typography variant="body2" color={colors.grey[100]}>
                  Imagen:
                </Typography>
                <img   
                  src={`http://192.168.88.69:5003${registro.imagen}`}
                  // src={`data:image/jpeg;base64,${registro.imagen}`}
                  alt="Imagen del problema"
                  style={{ width: '400px', height: '250px', objectFit: 'cover', borderRadius: '8px', marginLeft: '2%', marginTop: '10%' }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color={colors.grey[100]} sx={{ marginTop: '20px' }}>
                No hay imágenes disponibles.
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              {/* <Button
                variant="outlined"
                color="secondary"
                onClick={handleAceptar}
                sx={{ padding: '10px 20px' }}
              >
                Aceptar
              </Button> */}
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