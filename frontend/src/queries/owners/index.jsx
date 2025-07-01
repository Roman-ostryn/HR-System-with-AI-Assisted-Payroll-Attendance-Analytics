// import React, { useState } from "react";
// import { Box, Button, InputBase, IconButton } from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import SearchIcon from "@mui/icons-material/Search";
// import ModalEditClients from "../../modal/owner/modalEditClients";
// import ModalDialogo from "../../modal/modalDialogo";
// import Header from "../../components/Header";
// import { getDatos } from "../../services/owner.services";
// import useTheme from "@mui/material/styles/useTheme";
// import { tokens } from "../../theme";
// import { useEffect } from "react";

// const OwnerQuery = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchValue, setSearchValue] = useState("");
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [modalEditClient, setModalEditClient] = useState(false);
//   const [modalDialogo, setModalDialogo] = useState(false);
//   const [selectedRowIds, setSelectedRowIds] = useState([]);
//   const [activeButton, setActiveButton] = useState(false);
//   const [forceRerender, setForceRerender] = useState(false);

//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   const columns = [
//     { field: "id", headerName: "ID" },
//     { field: "nombre", headerName: "NOMBRE", flex: 1 },
//     { field: "apellido", headerName: "APELLIDO", flex: 1 },
//     { field: "direccion", headerName: "DIRECCION", flex: 1 },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const datos = await getDatos();
//         setData(datos);
//         setFilteredData(datos);
//       } catch (error) {
//         console.error("Error al obtener datos del backend:", error);
//       }
//     };

//     fetchData();
//   }, []); // Dependencia vacía para que se ejecute solo una vez al montar el componente
//   // <- Agregar filteredData como dependencia

//   const handleSearchChange = (event) => {
//     const { value } = event.target;
//     setSearchValue(value);
//     const filtered = data.filter((item) =>
//       item.nombre.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredData(filtered);
//   };

//   const handleRowSelection = (newSelection) => {
//     if (newSelection.length === 0) {
//       setSelectedClient(null);
//       setSelectedRowIds([]);
//       setActiveButton(false);
//     } else {
//       const selectedRowId = newSelection[newSelection.length - 1];
//       setSelectedRowIds([selectedRowId]);
//       const selectedRow = data.find((row) => row.id === selectedRowId);
//       setSelectedClient(selectedRow.id);
//       setActiveButton(true);
//     }
//   };


//   return (
//     <Box m="20px">
//       <Box display="flex" justifyContent="space-between" p={0}>
//         <Header
//           title="CONSULTA DE PROPIETARIOS"
//           subtitle="Consulta de Propietarios"
//         />
//         <Box display="flex" alignItems="center">
//           <Button
//             disabled={!activeButton}
//             onClick={() => setModalEditClient(true)}
//             color="secondary"
//             variant="contained"
//           >
//             Editar
//           </Button>

//           <Button
//             disabled={!activeButton}
//             // backgroundColor={colors.primary[800]}
//             onClick={() => setModalDialogo(true)}
//             color="secondary"
//             variant="contained"
//             sx={{
//               backgroundColor: "#e41811",
//               color: "#ffffff ",
//               marginLeft: "10px",
//             }}
//           >
//             Eliminar
//           </Button>

//           <Box
//             display="flex"
//             backgroundColor={colors.primary[400]}
//             borderRadius="3px"
//             height={"40%"}
//             width={"60%"}
//             ml={1}
//           >
//             <InputBase
//               sx={{ ml: 2, flex: 1 }}
//               placeholder="Buscar"
//               value={searchValue}
//               onChange={handleSearchChange}
//             />
//             <IconButton type="button" sx={{ p: 1 }}>
//               <SearchIcon />
//             </IconButton>
//           </Box>
//         </Box>
//       </Box>
//       <Box
//         m="40px 0 0 0"
//         height="75vh"
//         sx={{
//           "& .MuiDataGrid-root": {
//             border: "none",
//           },
//           "& .MuiDataGrid-cell": {
//             borderBottom: "none",
//           },
//           "& .name-column--cell": {
//             color: colors.greenAccent[300],
//           },
//           "& .MuiDataGrid-columnHeaders": {
//             backgroundColor: colors.blueAccent[900],
//             borderBottom: "none",
//           },
//           "& .MuiDataGrid-virtualScroller": {
//             backgroundColor: colors.primary[400],
//           },
//           "& .MuiDataGrid-footerContainer": {
//             borderTop: "none",
//             backgroundColor: colors.blueAccent[900],
//           },
//           "& .MuiCheckbox-root": {
//             color: `${colors.greenAccent[200]} !important`,
//           },
//           "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
//             color: `${colors.grey[100]} !important`,
//           },

//           "& .MuiButton-root.css-s8qyrg-MuiButtonBase-root:hover": {
//             backgroundColor: `${colors.grey[800]} !important`,
//           },
//         }}
//       >
//         <DataGrid
//           checkboxSelection
//           rows={filteredData}
//           columns={columns}
//           components={{ Toolbar: GridToolbar }}
//           onSelectionModelChange={handleRowSelection}
//           selectionModel={selectedRowIds}
//           disableMultipleSelection={true}
//         />
//       </Box>
//       <ModalEditClients
//         open={modalEditClient}
//         onClose={() => setModalEditClient(false)}
//         onSelectClient={selectedClient}
//       />
//       <ModalDialogo
//         open={modalDialogo}
//         onClose={() => setModalDialogo(false)}
//         onSelectClient={selectedClient}
//       />
//     </Box>
//   );
// };

// export default OwnerQuery;
