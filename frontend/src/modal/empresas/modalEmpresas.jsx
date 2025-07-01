  // import React, { useState, useEffect } from 'react';
  // import { Box, Modal, Button, List, ListItem, ListItemText } from '@mui/material';
  // import { getSalarios } from '../../services/salarios.services'; // Asegúrate de tener este servicio
  import React, { useState, useEffect } from 'react';
  import { Box, Modal, Button, List, ListItem, ListItemText, InputBase, IconButton } from '@mui/material';
  import { DataGrid } from '@mui/x-data-grid'; // Asegúrate de instalar y usar @mui/x-data-grid
  import SearchIcon from '@mui/icons-material/Search';
  import { useTheme } from '@mui/material/styles'; // Importa useTheme desde MUI
  import { tokens } from '../../theme'; // Asegúrate de que tokens esté definido en tu tema
  import { getDatosEmpresas } from '../../services/empresas.services'; // Asegúrate de tener este servicio

  const ModalEmpresas = ({ open, onClose, onSelectEmpresa }) => {
    const [horarios, setHorarios] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
      { field: "id", headerName: "ID", flex: 1 },
      {
        field: "nombre",
        headerName: "Nombre",
        flex: 1,
        cellClassName: "name-column--cell",
      },
     
    ];
    useEffect(() => {
      // Obtener los salarios desde la base de datos
      const fetchHorarios = async () => {
        try {
          const response = await getDatosEmpresas();
          setHorarios(response);
          setFilteredData(response);
        } catch (error) {
          console.error('Error al obtener datos del backend:', error);
        }
      };

      fetchHorarios();
    }, []);
    const handleSearchChange = (event) => {
      setSearchValue(event.target.value);
      // Filtrar los datos en función del valor de búsqueda
      const filtered = horarios.filter((horario) =>
        horario.descripcion.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredData(filtered);
    };
    
    
    const handleRowClick = (params) => {
      onSelectEmpresa(params.row); // Envía el salario seleccionado
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
          style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Ajustar opacidad del fondo
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary[600],
            paddingLeft: "10px",
            paddingTop: "5px",
            paddingRight: "10px",
            paddingBottom: "10px!important",
            zIndex: 1500,
          }}
        >
          <Box m="0px">
            <Box display="flex" justifyContent="space-between" p={2} >
              <h1 id="owner-modal-title">Buscar Horario</h1>
              <Box
                display="flex"
                backgroundColor={colors.primary[400]}
                borderRadius="3px"
                height={"40%"}
                width={"40%"}
                marginTop={"3%"}
              >
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Buscar" value={searchValue} onChange={handleSearchChange} />
                <IconButton type="button" sx={{ p: 1 }}>
                  <SearchIcon />
                </IconButton>
              </Box>
            </Box>
            <Box m="10px 0" height="70vh" width="80vh" sx={{ "& .MuiDataGrid-root": { border: "none" }, "& .MuiDataGrid-cell": { borderBottom: "none" }, "& .name-column--cell": { color: colors.greenAccent[300] }, "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[900], borderBottom: "none" }, "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] }, "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[900] }, "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` }, }}
            >
              <DataGrid
                checkboxSelection
                rows={filteredData}
                columns={columns}
                onRowClick={handleRowClick}
              />
            </Box>
          </Box>
          {/* <Button onClick={handleRowDoubleClick} color="secondary" variant="contained" style={{ marginTop: "10px" }}>
            Seleccionar
          </Button> */}
        </Box>
      </Modal>
    );
  };

  export default ModalEmpresas;