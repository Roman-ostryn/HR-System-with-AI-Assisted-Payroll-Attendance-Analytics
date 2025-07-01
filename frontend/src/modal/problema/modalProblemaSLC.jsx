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
      const ID =  registro?.datos?.id_registro || registro?.datos?.id_producto 
      
      if (ID) {        
        setIsLoading(true);
        try {
          const productoData = await getOneDatos(ID);
          

          setProducto(productoData.cod);
        } catch (error) {
          setError('Error al obtener el producto');
        } finally {
          setIsLoading(false);
        }
      }
    };


    const fetchProblemaDescripcion = async () => {
      const idProblema = registro?.datos.id_problema || registro?.datos.id_problemasalalimpia;
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

  const handleAceptar = async () => {
    setSubmitting(true);
    setRegistrationSuccess(null);
    try {
      const data = {
        entroproblema: registro.datos.entroproblema || "SI",
        id_problemacalandra: registro.datos.id_problemasalalimpia || problemaDescripcion,
        obs: producto,
        serie: registro.datos.serie || "A definir",
        producto: registro.datos.cod || producto,
        imagenes: registro.datos.imagenes,
        id_usuario: parseInt(USER),
      };

      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await PostReporteCalandraSK(data);
      setRegistrationSuccess(true);

      setTimeout(() => {
        onClose();
      }, 3500);
    } catch (error) {
      alert(`Error al enviar los datos: ${error.message}`);
      setRegistrationSuccess(false);
    }finally {
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
              Producto: <strong>{registro?.datos?.serie || producto }</strong>
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              Llegó así?: <strong>{registro?.datos?.entroproblema || "SI"}</strong>
            </Typography>
            <Typography variant="body1" color={colors.grey[100]}>
              Estado del Problema: <strong>{registro?.datos?.estado_problema}</strong>
            </Typography>

            <Typography variant="body1" color={colors.grey[100]}>
              Problema Detectado: <strong>{problemaDescripcion}</strong>
            </Typography>

            <Typography variant="body1" color={colors.grey[100]}>
              Observaciones: <strong>{registro?.datos?.obs || 'No disponible' }</strong>
            </Typography>

            {registro?.datos?.imagenes ? (
              <Box sx={{ marginTop: '20px' }}>
                <Typography variant="body2" color={colors.grey[100]}>
                  Imagen:
                </Typography>
                <img
                  src={`http://192.168.88.69:5003${registro.datos.imagenes}`}
                  alt="Imagen del problema"
                  style={{ width: '400px', height: '250px', objectFit: 'cover', borderRadius: '8px', marginLeft: '2%', marginTop: '10%' }}
                  // style={{
                  //   width: '100%',
                  //   height: 'auto',
                  //   maxWidth: '400px',
                  //   borderRadius: '8px',
                  //   objectFit: 'cover',
                  //   marginTop: '10px',
                  // }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color={colors.grey[100]} sx={{ marginTop: '20px' }}>
                No hay imágenes disponibles.
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <Button
                variant="outlined"
                color="secondary"
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
