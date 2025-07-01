
import React, { useEffect, useState } from 'react';
import { Modal, Box, Select, MenuItem, FormControl, Chip, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import LoadingSpinner from "../../loadingSpinner";
import { getProblemaCalandra } from '../../services/reporteCalandra.services';
import { updateRegistro } from '../../services/reporteSalaLimpia.services';
import ModalSucces from '../modalSucces';
import ModalError from '../modalError';
import io from 'socket.io-client';
import getUrlSocket from '../../utils/getUrlSocket';
import getApiBaseUrl from '../../utils/getApiBaseUrl';

const socket = io(getUrlSocket(), {
  transports: ['websocket', 'polling']
});

const ModalEditSalaL = ({ open, onClose, registro }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [editableRegistro, setEditableRegistro] = useState({
    problema: [],
    obs: '',
    imagenes: '',
  });
  const [problemasArray, setProblemasArray] = useState([]);
  const [problemasCalandra, setProblemasCalandra] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const USER = localStorage.getItem('id');
  const TURNO = localStorage.getItem('turno');

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetchProblemas();
    }
    if (registro && registro.descripcion_problema) {
      const problemasArray = registro.descripcion_problema
        .split(',')
        .map((item) => item.trim()); // Eliminamos espacios en cada problema
      
      setEditableRegistro({
        ...registro,
        problema: problemasArray, // Guardamos como array en problema
        obs: registro.obs || '',
        estado_problema: registro.estado || '', 
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

  const handleSave = async () => {
    setSubmitting(true);
    setRegistrationSuccess(null);

    try {
      const nuevoRegistro = {
        id_problemasalalimpia: editableRegistro.problema.join(', '),
        obs: editableRegistro.obs,
        imagenes: editableRegistro.imagenes || '',
        estado_problema: editableRegistro.estado_problema,
        id_registro: editableRegistro.id,
        id_usuario: parseInt(USER),
        turno: TURNO || editableRegistro.turno,
      };

      await updateRegistro(registro.id, nuevoRegistro);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', marginLeft: '17px' }}>
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
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
              <p style={{ color: colors.grey[100], textAlign: 'left' }}>Descripción del problema:</p>
              <FormControl fullWidth sx={{ backgroundColor: colors.primary[500] }}>
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
                  sx={{ color: colors.grey[100] }}
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
                
                  src={`${getApiBaseUrl()}/${editableRegistro.imagenes}`}
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

export default ModalEditSalaL;
