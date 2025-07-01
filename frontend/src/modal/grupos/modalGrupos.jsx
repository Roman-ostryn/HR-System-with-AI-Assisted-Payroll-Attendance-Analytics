  // import React, { useState, useEffect } from 'react';
  // import { Box, Modal, Button, List, ListItem, ListItemText } from '@mui/material';
  // import { getSalarios } from '../../services/salarios.services'; // Asegúrate de tener este servicio
  import React, { useState, useEffect } from 'react';
  import { Box, Modal, Button, List, ListItem, ListItemText, InputBase, IconButton } from '@mui/material';
  import { DataGrid } from '@mui/x-data-grid'; // Asegúrate de instalar y usar @mui/x-data-grid
  import SearchIcon from '@mui/icons-material/Search';
  import { useTheme } from '@mui/material/styles'; // Importa useTheme desde MUI
  import { tokens } from '../../theme'; // Asegúrate de que tokens esté definido en tu tema
  import { getDatosGrupos } from '../../services/grupos.services'; // Asegúrate de tener este servicio

  const ModalGrupo = ({ open, onClose, onSelectGrupo }) => {
    const [grupos, setGrupos] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
      { field: "id", headerName: "ID", flex: 1 },
      {
        field: "descripcion",
        headerName: "Descripcion",
        flex: 1,
        cellClassName: "name-column--cell",
      },
      {
        field: "monto",
        headerName: "Monto",
        flex: 1,
        cellClassName: "name-column--cell",
      },
      // {
      //   field: "chapa",
      //   headerName: "Chapa",
      //   flex: 1,
      //   cellClassName: "name-column--cell",
      // },
    ];
    useEffect(() => {
      // Obtener los salarios desde la base de datos
      const fetchGrupos = async () => {
        try {
          const response = await getDatosGrupos();
          setGrupos(response);
          setFilteredData(response);
        } catch (error) {
          console.error('Error al obtener datos del backend:', error);
        }
      };

      fetchGrupos();
    }, []);
    const handleSearchChange = (event) => {
      setSearchValue(event.target.value);
      // Filtrar los datos en función del valor de búsqueda
      const filtered = grupos.filter((grupos) =>
        grupos.descripcion.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredData(filtered);
    };
    
    
    const handleRowDoubleClick = (params) => {
      const { id, descripcion, monto } = params.row;
      // Puedes seleccionar el salario directamente en lugar de usar handleSearchChange
      onSelectGrupo({ id, descripcion, monto }); // Envía el salario seleccionado
      onClose(); // Cierra el modal
    };

    

    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-grupo-title"
        aria-describedby="modal-grupo-description"
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
              <h1 id="owner-modal-title">Buscar Grupos</h1>
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
                onRowDoubleClick={handleRowDoubleClick}
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

  export default ModalGrupo;