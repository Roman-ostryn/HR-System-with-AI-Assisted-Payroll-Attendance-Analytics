import React, { useEffect, useState } from 'react';
import { Modal, Box, FormControl, Select, MenuItem, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ModalProblemaSector = ({ open, onClose, registro, onUpdateRegistro, problemasOptions, estadoOptions, sectorName }) => {
  const [editableRegistro, setEditableRegistro] = useState({
    problema: [],
    cod: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();
  const colors = theme.palette; // Obtén el objeto de colores del tema

  useEffect(() => {
    if (open) {
      setEditableRegistro({
        ...registro,
        problema: Array.isArray(registro.problema) ? registro.problema : [],
      });
    } else {
      setEditableRegistro({
        problema: [],
        cod: ''
      });
    }
  }, [open, registro]);

  const handleChange = (field, value) => {
    setEditableRegistro({ ...editableRegistro, [field]: value });
  };

  const handleSave = () => {
    const dataToSave = {
      ...editableRegistro,
      problema: editableRegistro.problema,
    };
    onUpdateRegistro(dataToSave);
    setIsEditing(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-problema-sector-title"
      style={{ display: 'flex', alignItems: 'left', justifyContent: 'center', paddingTop: '0px' }}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.primary?.[600] || '#1976d2', // Color de fondo del modal
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
        <h1 style={{ color: colors.grey[100], textAlign: 'left' }}>{sectorName}: Reporte de Problema</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', marginLeft: '17px' }}>
          <p style={{ color: colors.grey[100], textAlign: 'left' }}>Estado del Problema:</p>
          <FormControl fullWidth sx={{ backgroundColor: colors.primary?.[500] || '#64b5f6' }}>
            <Select
              value={editableRegistro.estado_problema || ''}
              onChange={(e) => handleChange('estado_problema', e.target.value)}
              displayEmpty
              fullWidth
              sx={{ color: colors.grey[100] }}
              disabled={!isEditing}
            >
              {estadoOptions && estadoOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
          <p style={{ color: colors.grey[100], textAlign: 'left' }}>Descripción del problema:</p>
          <FormControl fullWidth sx={{ backgroundColor: colors.primary?.[500] || '#64b5f6' }}>
            <Select
              multiple
              value={editableRegistro.problema || []}
              onChange={(e) => handleChange('problema', e.target.value)}
              renderValue={(selected) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selected.map((value) => {
                    const problem = problemasOptions.find(option => option.id === value);
                    return (
                      <Chip key={value} label={problem ? problem.descripcion : 'Desconocido'} style={{ backgroundColor: colors.primary?.[400] || '#64b5f6', color: colors.grey[100] }} />
                    );
                  })}
                </div>
              )}
              fullWidth
              sx={{ color: colors.grey[100] }}
              disabled={!isEditing}
            >
              {problemasOptions && problemasOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <p style={{ color: colors.grey[100], textAlign: 'left', marginRight: '20px' }}>
            Producto: {registro.cod || 'Sin producto'}
          </p>
          <p style={{ color: colors.grey[100], textAlign: 'left' }}>
            Problema: {registro.problema ? registro.problema.join(', ') : 'Sin problema'}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={handleSave} style={{ backgroundColor: colors.greenAccent?.[400] || '#4caf50', color: colors.grey[100], border: 'none', borderRadius: '4px', padding: '10px 20px' }}>
            Guardar Cambios
          </button>
          <button onClick={onClose} style={{ backgroundColor: colors.redAccent?.[400] || '#f44336', color: colors.grey[100], border: 'none', borderRadius: '4px', padding: '10px 20px', marginLeft: '10px' }}>
            Cerrar
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalProblemaSector;
