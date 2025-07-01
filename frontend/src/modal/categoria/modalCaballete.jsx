import React, { useState, useEffect } from 'react';
  import { Box, Modal, Button, List, ListItem, ListItemText, InputBase, IconButton } from '@mui/material';
  import { DataGrid } from '@mui/x-data-grid'; // Asegúrate de instalar y usar @mui/x-data-grid
  import SearchIcon from '@mui/icons-material/Search';
  import { useTheme } from '@mui/material/styles'; // Importa useTheme desde MUI
  import { tokens } from '../../theme'; // Asegúrate de que tokens esté definido en tu tema
  import { getCaballete } from '../../services/caballete.services'; // Asegúrate de tener este servicio

  
  const ModalCaballete = ({ open, onClose, onSelect, serviceType }) => {
    const [productos, setProductos] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
      { field: "id", headerName: "ID", flex: 1 },
      { field: "codigo", headerName: "Codigo", flex: 1 },
      { field: "descripcion", headerName: "Descripcion", flex: 3 },
    ];

    
    useEffect(() => {
      // Obtener los salarios desde la base de datos
      const fetchProductos = async () => {
        
        try {
          const response = await getCaballete(serviceType); // Usa serviceType aquí
          setProductos(response);
          setFilteredData(response);
        } catch (error) {
          console.error('Error al obtener datos del backend:', error);
        }
      };

      fetchProductos();
    }, []);
    const handleSearchChange = (event) => {
      setSearchValue(event.target.value);
      
      const filtered = productos.filter((producto) =>
        producto.descripcion ? producto.descripcion.toLowerCase().includes(event.target.value.toLowerCase()) : false
      );
    
      setFilteredData(filtered);
    };
    
    
    const handleRowDoubleClick = (params) => {
      const selected = params.row; // Obtiene toda la fila
      onSelect(selected); // Envía los datos del usuario seleccionado
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
              <h1 id="owner-modal-title">Buscar Caballete</h1>
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

  export default ModalCaballete;
  // sx={{
  //   "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
  
  //   "& .MuiOutlinedInput-root": {
  //     color: `${colors.grey[100]} !important`,
  //   },
  //   "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
  //     border: "none",
  //     background: `${colors.primary[950]} !important`,
  //     borderBottom: `1px solid ${colors.grey[100]} !important`,
  //     zIndex: 1, // Aseguramos que el notchedOutline no cubra el label
  //   },
  //   "& .MuiInputBase-input": {
  //     padding: "12px",
  //     zIndex: 100,
  //     color: `${colors.grey[100]} !important`,
  //   },
  
  //   "& .MuiSvgIcon-root": {
  //     color: `${colors.grey[100]} !important`,
  //     zIndex: 10,
  //   },
  //   "& .MuiInputLabel-root": {
  //     zIndex: 200, // Aumentamos el z-index del label para que esté sobre el fondo
  //     color: `${colors.grey[100]} !important`,
  //   },
  
  //   "& .MuiOutlinedInput-input": {
  //     padding: "12px",
  //     zIndex: 100,
  //   },
  
  //   "& .MuiInputBase-inputAdornedEnd": {
  //     padding: "12px",
  //     zIndex: 100,
  //   },
  // }}