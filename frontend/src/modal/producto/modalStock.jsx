  // // import React, { useState, useEffect } from 'react';
  // // import { Box, Modal, Button, List, ListItem, ListItemText } from '@mui/material';
  // // import { getSalarios } from '../../services/salarios.services'; // Asegúrate de tener este servicio
  // import React, { useState, useEffect } from 'react';
  // import { Box, Modal, Button, List, ListItem, ListItemText, InputBase, IconButton } from '@mui/material';
  // import { DataGrid } from '@mui/x-data-grid'; // Asegúrate de instalar y usar @mui/x-data-grid
  // import SearchIcon from '@mui/icons-material/Search';
  // import { useTheme } from '@mui/material/styles'; // Importa useTheme desde MUI
  // import { tokens } from '../../theme'; // Asegúrate de que tokens esté definido en tu tema
  // import { PostDatosOrdenProduccion, getUltimaOrden, getVerificarStock } from "../../services/ordenProduccion.services";



  // const ModalStock = ({ open, onClose, registro}) => {
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [registrationSuccess, setRegistrationSuccess] = useState(false);
  //   const [registrationError, setRegistrationError] = useState(false);
  //   const [error, setError] = useState("");
  //   const [ultimaOrden, setUltimaOrden] = useState(""); // Estado para almacenar la última orden  
  //   const [productos, setProductos] = useState([]);
  //   const [filteredData, setFilteredData] = useState([]);
  //   const [searchValue, setSearchValue] = useState("");
  //   const theme = useTheme();
  //   const colors = tokens(theme.palette.mode);

  //   const columns = [
  //     { field: "id", headerName: "ID", flex: 1 },
  //     { field: "cod", headerName: "Codigo", flex: 2 },
  //     { field: "cantidad", headerName: "Cantidad", flex: 1 },
  //     { field: "reservado", headerName: "Reservados", flex: 1 },
  //   ];

  //   const fetchUltimaOrden = async () => {
  //     try {
  //       const response = await getUltimaOrden(); // Llamada al servicio
  //       setUltimaOrden( response[0].orden + 1 || ""); // Actualiza el estado con la última orden
  //     } catch (err) {
  //       console.error("Error obteniendo la última orden", err);
  //     }
  //   };
  
  //   useEffect(() => {
  //     fetchUltimaOrden();
  //   }, []);

  //   const fetchProductos = async () => {
  //     try {
  //       const response = await getVerificarStock(registro.descripcion_producto);
  //       setProductos(response);

  //       setFilteredData(response);
  //     } catch (error) {
  //       console.error('Error al obtener datos del backend:', error);
  //     }
  //   };


  //   const handleSearchChange = (event) => {
  //     setSearchValue(event.target.value);
      
  //     const filtered = productos.filter((producto) =>
  //       producto.cod ? producto.cod.toLowerCase().includes(event.target.value.toLowerCase()) : false
  //     );
    
  //     setFilteredData(filtered);
  //   };
    

  //   const handleAceptar = async () => {
  //     const { orden = ultimaOrden, id_producto, cantidad } = registro;

  //     const valuesToSend = {
  //       orden,
  //       id_producto,
  //       cantidad,
  //     };

  //     try {
  //       await new Promise((resolve) => setTimeout(resolve, 2000));
  //       await PostDatosOrdenProduccion(valuesToSend);
  //       setRegistrationSuccess(true);
  //       setTimeout(() => {
  //         onClose();
  //       }, 3000);
  //       fetchProductos();
  //     } catch (error) {
  //       console.error("Error enviando datos", error);
  //       setRegistrationSuccess(false);
  //     } finally {
  //       setIsLoading(false);
  //       fetchUltimaOrden();
  //     }
  //   };
  
  //   const handleCancelar = () => {
  //     onClose(); // Cerrar el modal
  //   };


  //   return (
  //     <Modal
  //       open={open}
  //       onClose={onClose}
  //       aria-labelledby="modal-horario-title"
  //       aria-describedby="modal-horario-description"
  //       style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  //       BackdropProps={{
  //         style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Ajustar opacidad del fondo
  //       }}
  //     >
  //       <Box
  //         sx={{
  //           display: "flex",
  //           flexDirection: "column",
  //           alignItems: "center",
  //           justifyContent: "center",
  //           backgroundColor: colors.primary[600],
  //           paddingLeft: "10px",
  //           paddingTop: "5px",
  //           paddingRight: "10px",
  //           paddingBottom: "10px!important",
  //           zIndex: 1500,
  //         }}
  //       >
  //       {isLoading && <LoadingSpinner />}
  //       {registrationSuccess && <ModalSucces open={registrationSuccess} onClose={() => setRegistrationSuccess(null)} />}
  //       {registrationSuccess === false && <ModalError open={!registrationSuccess} onClose={() => setRegistrationSuccess(null)} error="Error al guardar el registro" />}

  //       <h1 style={{ color: colors.grey[100], textAlign: 'left' }}>Reporte</h1>

  //         <Box m="0px">
  //           <Box display="flex" justifyContent="space-between" p={2} >
  //             <h1 id="owner-modal-title">Stock insuficiente </h1>
  //             <Box
  //               display="flex"
  //               backgroundColor={colors.primary[400]}
  //               borderRadius="3px"
  //               height={"40%"}
  //               width={"40%"}
  //               marginTop={"3%"}
  //             >
  //               <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Buscar" value={searchValue} onChange={handleSearchChange} />
  //               <IconButton type="button" sx={{ p: 1 }}>
  //                 <SearchIcon />
  //               </IconButton>
  //             </Box>
  //           </Box>
  //           <Box m="10px 0" height="50vh" width="60vh" sx={{ "& .MuiDataGrid-root": { border: "none" }, "& .MuiDataGrid-cell": { borderBottom: "none" }, "& .name-column--cell": { color: colors.greenAccent[300] }, "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[900], borderBottom: "none" }, "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] }, "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[900] }, "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` }, }}
  //           >
  //             <DataGrid
  //               checkboxSelection
  //               rows={filteredData}
  //               columns={columns}
  //               // onRowClick={handleRowClick}
  //             />
  //           </Box>
  //         </Box>
  //         <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
  //             <Button
  //               variant="outlined"
  //               color="secondary"
  //               onClick={handleCancelar}
  //               sx={{ padding: '10px 20px', marginRight: '380px' }}
  //             >
  //               Cancelar
  //             </Button>
  //             <Button
  //               variant="outlined"
  //               color="secondary"
  //               onClick={handleAceptar}
  //               sx={{ padding: '10px 20px' }}
  //             >
  //               Aceptar
  //             </Button>
              
  //           </Box>
  //       </Box>
  //     </Modal>
  //   );
  // };

  // export default ModalStock;


  import React, { useState, useEffect } from 'react';
  import { Box, Modal, Button, List, ListItem, ListItemText, InputBase, IconButton } from '@mui/material';
  import { DataGrid } from '@mui/x-data-grid';
  import SearchIcon from '@mui/icons-material/Search';
  import { useTheme } from '@mui/material/styles';
  import LoadingSpinner from "../../loadingSpinner";
  import { tokens } from '../../theme';
  import ModalSucces from '../modalSucces';
  import ModalError from '../modalError';
  import { PostDatosOrdenProduccion, getUltimaOrden, getVerificarStock, PutActualizarReservas } from "../../services/ordenProduccion.services";
  
  const ModalStock = ({ open, onClose, registro }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(null);
    const [productos, setProductos] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [ultimaOrden, setUltimaOrden] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const User = localStorage.getItem("id");
  
    
    const columns = [
      { field: "id", headerName: "ID", flex: 1 },
      { field: "cod", headerName: "Codigo", flex: 2 },
      { field: "cantidad_entrada", headerName: "Cantidad", flex: 1 },
      { field: "reservado", headerName: "Reservados", flex: 1 },
    ];
  
    useEffect(() => {
      if (open) {
        setIsLoading(true);
        fetchUltimaOrden();
        fetchProductos().finally(() => setIsLoading(false));
      }
    }, [open]);
  
    const fetchUltimaOrden = async () => {
      try {
        const response = await getUltimaOrden();
        setUltimaOrden(response[0]?.orden + 1 || "");
      } catch (err) {
        console.error("Error obteniendo la última orden", err);
      }
    };
  
    const fetchProductos = async () => {
      try {
        const response = await getVerificarStock(registro.descripcion_producto);
        setProductos(response);
        setFilteredData(response);
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
      }
    };
  
    // const handleSearchChange = (event) => {
    //   setSearchValue(event.target.value);
    //   const filtered = productos.filter((producto) =>
    //     producto.cod ? producto.cod.toLowerCase().includes(event.target.value.toLowerCase()) : false
    //   );
    //   setFilteredData(filtered);
    // };
  
    const handleAceptar = async () => {
      setIsLoading(true);
      const { orden = ultimaOrden, id_producto, cantidad} = registro;
      const estado = 1;
      const valuesToSend = {
        orden,
        id_producto,
        cantidad,
        estado,
        // id_usuario: User,
      };
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await PostDatosOrdenProduccion(valuesToSend);

        productos.forEach(async (producto) => {
          const { cod } = producto; // Extrae el 'cod' de cada producto

          const cantidadActualizada = cantidad; // Usa la cantidad enviada en 'valuesToSend'
    
          // Llama a tu función para actualizar el stock
          // await PutActualizarReservas(cod, cantidadActualizada);
        });

        setRegistrationSuccess(true);
        setTimeout(() => {
          onClose();
        }, 3000);
        fetchProductos();
      } catch (error) {
        console.error("Error enviando datos", error);
        setRegistrationSuccess(false);
      } finally {
        setIsLoading(false);
        fetchUltimaOrden();
      }
    };
  
    const handleCancelar = () => {
      onClose();
    };
  
    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-stock-title"
        aria-describedby="modal-stock-description"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        BackdropProps={{
          style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.primary[600],
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '90%',
            boxSizing: 'border-box',
          }}
        >
          {/* Mostrar LoadingSpinner si isLoading es true */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
              <LoadingSpinner />
            </Box>
          ) : (
            <>
              {registrationSuccess && (
                <ModalSucces
                  open={registrationSuccess}
                  onClose={() => setRegistrationSuccess(null)}
                />
              )}
              {registrationSuccess === false && (
                <ModalError
                  open={!registrationSuccess}
                  onClose={() => setRegistrationSuccess(null)}
                  error="Error al guardar el registro"
                />
              )}
              <h2 style={{ color: colors.grey[100], marginBottom: '20px' }}>STOCK</h2>
{/*   
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <InputBase
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Buscar producto"
                  sx={{
                    backgroundColor: colors.primary[500],
                    borderRadius: '8px',
                    padding: '5px 10px',
                    flexGrow: 1,
                    marginRight: '10px',
                    color: colors.grey[100],
                  }}
                />
                <IconButton>
                  <SearchIcon style={{ color: colors.grey[100] }} />
                </IconButton>
              </Box>
   */}
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={filteredData}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  sx={{
                    backgroundColor: colors.primary[500],
                    color: colors.grey[100],
                    borderColor: colors.grey[100],
                  }}
                />
              </div>
  
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button variant="contained" color="success" onClick={handleAceptar}>
                  Aceptar
                </Button>
                <Button variant="outlined" color="error" onClick={handleCancelar}>
                  Cancelar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    );
  };
  
  export default ModalStock;
  