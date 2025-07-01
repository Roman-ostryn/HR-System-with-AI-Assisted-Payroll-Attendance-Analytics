// import React, { useState, useEffect } from 'react';
//   import { Box, Modal, Button, List, ListItem, ListItemText, InputBase, IconButton, useMediaQuery } from '@mui/material';
//   import { DataGrid } from '@mui/x-data-grid'; // Asegúrate de instalar y usar @mui/x-data-grid
//   import SearchIcon from '@mui/icons-material/Search';
//   import { useTheme } from '@mui/material/styles'; // Importa useTheme desde MUI
//   import { tokens } from '../../theme'; // Asegúrate de que tokens esté definido en tu tema
//   import { getCaballete } from '../../services/caballete.services'; // Asegúrate de tener este servicio
  
//   const ModalCaballete = ({ open, onClose, onSelect, serviceType }) => {
//     const [productos, setProductos] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [searchValue, setSearchValue] = useState("");
//     const theme = useTheme();
//     const colors = tokens(theme.palette.mode);
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//     const columns = [
//       { field: "id", headerName: "ID", flex: 1 },
//       { field: "codigo", headerName: "Codigo", flex: 1 },
//       { field: "descripcion", headerName: "Descripcion", flex: 3 },
//     ];
    
//     useEffect(() => {
//       const fetchProductos = async () => {
        
//         try {
//           const response = await getCaballete(serviceType); // Usa serviceType aquí
//           setProductos(response);
//           setFilteredData(response);
//         } catch (error) {
//           console.error('Error al obtener datos del backend:', error);
//         }
//       };
      
//       fetchProductos();
//     }, []);
//     const handleSearchChange = (event) => {
//       setSearchValue(event.target.value);
      
//       const filtered = productos.filter((producto) =>
//         producto.descripcion ? producto.descripcion.toLowerCase().includes(event.target.value.toLowerCase()) : false
//       );
    
//       setFilteredData(filtered);
//     };
    
    
//     const handleRowClick = (params) => {
//       const selected = params.row; // Obtiene toda la fila
//       onSelect(selected); // Envía los datos del usuario seleccionado
//       onClose(); // Cierra el modal
//     };
    
//     return (
//       <Modal
//         open={open}
//         onClose={onClose}
//         fullScreen={isMobile} 
//         aria-labelledby="modal-horario-title"
//         aria-describedby="modal-horario-description"
//         style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//         BackdropProps={{
//           style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Ajustar opacidad del fondo
//         }}
//       >
//         <Box
//           sx={{
//             width: isMobile ? "100%" : "80%",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: colors.primary[600],
//             paddingLeft: "10px",
//             paddingTop: "5px",
//             paddingRight: "10px",
//             paddingBottom: "10px!important",
//             zIndex: 1500,
//           }}
//         >
//           <Box m="0px">
//             <Box display="flex" justifyContent="space-between" p={2} >
//               <h1 id="owner-modal-title">Buscar Caballete</h1>
//               <Box
//                 display="flex"
//                 backgroundColor={colors.primary[400]}
//                 borderRadius="3px"
//                 height={"40%"}
//                 width={"40%"}
//                 marginTop={"3%"}
//               >
//                 <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Buscar" value={searchValue} onChange={handleSearchChange} />
//                 <IconButton type="button" sx={{ p: 1 }}>
//                   <SearchIcon />
//                 </IconButton>
//               </Box>
//             </Box>
//             <Box m="10px 0" width="100%" height={isMobile ? "60vh" : "70vh"} sx={{ "& .MuiDataGrid-root": { border: "none" }, "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[900], borderBottom: "none" } }}
//             >
//               <DataGrid
//                 checkboxSelection
//                 rows={filteredData}
//                 columns={columns}
//                 onRowClick={handleRowClick}
//                 height={isMobile ? "60vh" : "70vh"}
//               />
//             </Box>
//           </Box>
//           {/* <Button onClick={handleRowDoubleClick} color="secondary" variant="contained" style={{ marginTop: "10px" }}>
//             Seleccionar
//           </Button> */}
//         </Box>
//       </Modal>
//     );
//   };
  
//   export default ModalCaballete;



import React, { useState, useEffect } from 'react';
import { Box, Modal, Button, InputBase, IconButton, useMediaQuery } from '@mui/material';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "codigo", headerName: "Codigo", flex: 1 },
    { field: "descripcion", headerName: "Descripcion", flex: 3 },
  ];

  useEffect(() => {
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
  }, [serviceType]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    const filtered = productos.filter((producto) =>
      producto.descripcion ? producto.descripcion.toLowerCase().includes(event.target.value.toLowerCase()) : false
    );
    setFilteredData(filtered);
  };

  const handleRowClick = (params) => {
    const selected = params.row; // Obtiene toda la fila
    onSelect(selected); // Envía los datos del usuario seleccionado
    onClose(); // Cierra el modal
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      // Hace que el modal ocupe toda la pantalla en dispositivos móviles
      aria-labelledby="modal-caballete-title"
      aria-describedby="modal-caballete-description"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        // display: "flex",
        // alignItems: isMobile ? "stretch" : "center",
        // justifyContent: isMobile ? "stretch" : "center",
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
          width: isMobile ? "100%" : "80%",
          height: "80vh",
          overflow: "auto",
        }}
      >
        <Box m="0px" width="100%">
          <Box display="flex" justifyContent="space-between" p={2}>
            <h1 id="modal-caballete-title">Buscar Caballete</h1>
            <Box
              display="flex"
              backgroundColor={colors.primary[400]}
              borderRadius="3px"
              height="40px"
              width="40%"
              marginTop="3%"
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

          {/* Data Grid */}
          <Box m="10px 0" width="100%" height={isMobile ? "60vh" : "70vh"} sx={{ "& .MuiDataGrid-root": { border: "none" }, "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[900], borderBottom: "none" } }}>
            <DataGrid
              checkboxSelection
              rows={filteredData}
              columns={columns}
              onRowClick={handleRowClick}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCaballete;
