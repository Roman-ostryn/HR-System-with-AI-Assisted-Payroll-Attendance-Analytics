import React, { useState, useEffect } from 'react';
import { Box, Modal, InputBase, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // Asegúrate de instalar y usar @mui/x-data-grid
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles'; // Importa useTheme desde MUI
import { tokens } from '../../theme'; // Asegúrate de que tokens esté definido en tu tema
import { getProblemaDescarga } from '../../services/reporteDescarga.services'; // Asegúrate de tener este servicio

const ModalProblemaDescarga = ({ open, onClose, onSelect }) => {
  const [problemasDescarga, setProblemasDescarga] = useState([]); // Aquí está definida 'problemasDescarga'
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState(""); // Definir el estado para el valor de búsqueda
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "Descripcion", headerName: "Descripción", flex: 1 },
    // { field: "codigo_paquete", headerName: "Código Paquete", flex: 1 }
  ];

  // useEffect para cargar los datos al montar el componente
  useEffect(() => {
    const fetchProblemas = async () => {
      try {
        const response = await getProblemaDescarga();
        setProblemasDescarga(response); // Actualizar los datos recibidos
        setFilteredData(response); // Establecer datos filtrados iniciales
      } catch (error) {
        console.error('Error al obtener problemas de descarga:', error);
      }
    };
    fetchProblemas();
  }, []);

  // Función para manejar la búsqueda
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    const filtered = problemasDescarga.filter((problema) =>
      problema.descripcion.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredData(filtered); // Actualiza los datos filtrados
  };

  // Función para manejar el doble clic en una fila
  const handleRowDoubleClick = (params) => {
    const selected = params.row; // Obtiene toda la fila seleccionada
    onSelect(selected); // Envía los datos del problema seleccionado
    onClose(); // Cierra el modal
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-horario-title"
      aria-describedby="modal-horario-description"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" } // Ajustar opacidad del fondo
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary[600],
          padding: "10px",
          zIndex: 1500,
        }}
      >
        <Box m="0px">
          <Box display="flex" justifyContent="space-between" p={2}>
            <h1 id="owner-modal-title">Buscar Problema de Descarga</h1>
            <Box
              display="flex"
              backgroundColor={colors.primary[400]}
              borderRadius="3px"
              height={"40%"}
              width={"40%"}
              marginTop={"3%"}
            >
              <InputBase
                sx={{ ml: 2, flex: 1 }}
                placeholder="Buscar"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <IconButton type="button" sx={{ p: 1 }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>
          <Box
            m="10px 0"
            height="70vh"
            width="80vh"
            sx={{
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-cell": { borderBottom: "none" },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[900],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[900],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
            }}
          >
            <DataGrid
              rows={filteredData}
              columns={columns}
              onRowDoubleClick={handleRowDoubleClick}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalProblemaDescarga;