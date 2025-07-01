
import React, { useEffect, useState } from 'react';
import { Modal, Box, Select, MenuItem, FormControl, Chip, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import LoadingSpinner from "../../loadingSpinner";
import { getProblemaCalandra } from '../../services/reporteCalandra.services';
import { UpdateReporteSalaLimpiaSK } from '../../services/reporteSalaLimpia.services';
import ModalSucces from '../modalSucces'; 
import ModalError from '../modalError'; 
import io from 'socket.io-client';
import  getUrlSocket from '../../utils/getUrlSocket';


const socket = io(getUrlSocket(), {
  transports: ['websocket', 'polling']
});

const ModalProblemaLavadora = ({ open, onClose, registro }) => {
  // if(registro!= null){
  // }
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [editableRegistro, setEditableRegistro] = useState({
    problema: [],
    obs: '',
    imagenes: '',
  });
  const [problemasCalandra, setProblemasCalandra] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const USER = localStorage.getItem('id');


  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetchProblemas();
    }
    if (registro) {

      const estado_problema1 = registro.estado_problema
      const problemasArray = Array.isArray(registro.problema) 
        ? registro.problema 
        : registro.problema.includes(',')
        ? registro.problema.split(',').map(item => item.trim())
        : [registro.problema.trim()];
      
      setEditableRegistro({
        ...registro,
        problema: problemasArray,
        estado_problema: estado_problema1,
        obs: registro.obs || '',
      });
    } else {
      setEditableRegistro({
        problema: [],
        obs: '',
        imagenes: '',
        estado_problema: '',
      });
    }
  }, [open, registro]);
  
  

  const fetchProblemas = async () => {

    try {
      const response = await getProblemaCalandra();
      setProblemasCalandra(response);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al obtener problemas de Calandra:', error);
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setEditableRegistro({ ...editableRegistro, [field]: value });
  };
  
  const handleProblemasChange = (event) => {
    const { target: { value } } = event;
    setEditableRegistro({ ...editableRegistro, problema: value });
  };
  

  // const handleProblemasChange = (event) => {
  //   const { target: { value } } = event;
  //   const selectedDescripciones = value.map((id) => {
  //     const problema = problemasCalandra.find(p => p.id === id);
  //     return problema ? problema.descripcion : '';
  //   }).filter(desc => desc);
  //   setEditableRegistro({ ...editableRegistro, problema: selectedDescripciones });
  // };

  const handleSave = async () => {
    setSubmitting(true);
    setRegistrationSuccess(null);

    try {
      const nuevoRegistro = {
        id_problema: editableRegistro.problema.join(', '),
        obs: editableRegistro.obs,
        imagenes: editableRegistro.imagenes || '',
        estado_problema: editableRegistro.estado_problema,
        id_producto: editableRegistro.id,
        id_usuario: parseInt(USER),

      };
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      await UpdateReporteSalaLimpiaSK(registro.id, nuevoRegistro);

      // await PostReporteSalaLimpiaSK(nuevoRegistro);
      setRegistrationSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
      fetchProblemas();
      
    } catch (error) {
      console.error('Error guardando el registro:', error);
      setRegistrationSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  const estadoProblemaOptions = ['PENDIENTE', 'EN PROCESO', 'RESUELTO', 'SOLUCIONADO'];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-problema-lavadora-title"
      aria-describedby="modal-problema-lavadora-description"
      style={{ display: 'flex', alignItems: 'left', justifyContent: 'center', paddingTop: '0px' }}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.primary[600],
          padding: "20px",
          zIndex: 1500,
          borderRadius: "8px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: '95%',
          paddingLeft: '20px',
          boxSizing: "border-box",
        }}
      >
        
        {isLoading && <LoadingSpinner />}
        
        {registrationSuccess && <ModalSucces open={registrationSuccess} onClose={() => setRegistrationSuccess(null)} />}
        {registrationSuccess === false && <ModalError open={!registrationSuccess} onClose={() => setRegistrationSuccess(null)} error="Error al guardar el registro" />}

        <h1 style={{ color: colors.grey[100], textAlign: 'left' }}>Reporte</h1>

        {!isLoading && (
          <>
            {/* <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', marginLeft: '17px' }}>
              <p style={{ color: colors.grey[100], textAlign: 'left' }}>Estado del Problema:</p>
              <FormControl fullWidth sx={{ backgroundColor: colors.primary[500] }}>
                <Select
                  value={editableRegistro.estado_problema || ''}
                  onChange={(e) => handleChange('estado_problema', e.target.value)}
                  displayEmpty
                  fullWidth
                  sx={{ color: colors.grey[100] }}
                >
                  {estadoProblemaOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div> */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', marginLeft: '17px' }}>
              <p style={{ color: colors.grey[100], textAlign: 'left' }}>Estado del Problema:</p>
              <FormControl fullWidth sx={{ backgroundColor: colors.primary[500] }}>
              <Select
                value={editableRegistro.estado_problema || ''} // Asegúrate de que esto tenga el valor correcto
                onChange={(e) => handleChange('estado_problema', e.target.value)}
                displayEmpty
                fullWidth
                sx={{ color: colors.grey[100] }}
              >
                <MenuItem value="">
                  <em>Seleccione un estado</em> {/* Mensaje por defecto */}
                </MenuItem>
                {estadoProblemaOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>

              </FormControl>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
              <p style={{ color: colors.grey[100], textAlign: 'left' }}>Descripción del problema:</p>
              <FormControl fullWidth sx={{ backgroundColor: colors.primary[500] }}>
                {/* <Select
                  multiple
                  value={editableRegistro.problema}
                  onChange={handleProblemasChange}
                  renderValue={(selected) => (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {selected.map((id) => {
                        const problema = problemasCalandra.find(p => p.id === id);
                        return problema ? (
                          <Chip key={id} label={problema.descripcion} style={{ backgroundColor: colors.primary[400], color: colors.grey[100] }} />
                        ) : null;
                      })}
                    </div>
                  )}
                  fullWidth
                  sx={{ color: colors.grey[100] }}
                >
                  {problemasCalandra.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.descripcion}
                    </MenuItem>
                  ))}
                </Select>
                */}
                <Select
                  multiple
                  value={editableRegistro.problema}
                  onChange={handleProblemasChange}
                  renderValue={(selected) => (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {selected.map((descripcion) => (
                        <Chip key={descripcion} label={descripcion} style={{ backgroundColor: colors.primary[400], color: colors.grey[100] }} />
                      ))}
                    </div>
                  )}
                >
                  {problemasCalandra.map((option) => (
                    <MenuItem key={option.id} value={option.descripcion}>
                      {option.descripcion}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>
            </div>

            {editableRegistro?.imagenes ? (
              <div>
                <img
                  src={`http://192.168.88.69:5003${editableRegistro.imagenes}`}
                  alt="Imagen del problema"
                  style={{ width: '400px', height: '250px', objectFit: 'cover', borderRadius: '8px', marginLeft: '12.5%', marginTop: '5%' }}
                />
              </div>
            ) : (
              <p style={{ color: colors.grey[100], textAlign: 'left' }}>No hay imágenes disponibles</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button onClick={handleSave} style={{ padding: '10px 20px', backgroundColor: colors.primary[700], color: colors.grey[100], border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Guardar Cambios
              </button>
            </div>

            {submitting && <LoadingSpinner />}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ModalProblemaLavadora;
