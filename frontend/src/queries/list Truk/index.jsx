// import React, { useState, useEffect } from "react";
// import { Box, useTheme, Typography, Alert } from "@mui/material";
// import { tokens } from "../../theme";
// import Header from "../../components/Header";
// import {
//   requestListTruckView,
//   updateTruckState,
// } from "../../services/trukSocket.services";
// import { getDatos } from "../../services/state.services";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
// import io from "socket.io-client";
// import { getDatosHangar } from "../../services/hangar.services";

// const SOCKET_URL = "http://192.168.88.69:4000"; // URL del servidor Socket.IO
// const socket = io(SOCKET_URL, {
//   withCredentials: true,
//   transports: ["websocket", "polling"],
//   query: {
//     token: localStorage.getItem("authToken"), // Pasar el token al conectarse
//   },
// });

// const Truks = () => {
//   const [data, setData] = useState([]);
//   const [UpdateData, setUpdateData] = useState({
//     id_hangar: undefined,
//     id_state: undefined,
//   });

//   const [userLevel, setUserLevel] = useState(null);
//   const [statesList, setStatesList] = useState([]);
//   const [stateMap, setStateMap] = useState({});
//   const [hangarList, setHangarList] = useState([]);
//   const [hangarMap, setHangarMap] = useState({});
//   const [error, setError] = useState(null); 
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const datos = await requestListTruckView();
//         if (datos) {
//           setData(datos);
//         }
//       } catch (error) {
//         console.error("Error al obtener datos del backend:", error);
//       }
//     };

//     const fetchDataState = async () => {
//       try {
//         const datos = await getDatos();
//         if (datos) {
//           setStatesList(datos);
//           const map = {};
//           datos.forEach((state) => {
//             map[state.id] = state.Descripcion;
//           });
//           setStateMap(map);
//         }
//       } catch (error) {
//         console.error("Error al obtener datos del backend:", error);
//       }
//     };

//     const fetchDataHangar = async () => {
//       try {
//         const datas = await getDatosHangar();
//         setHangarList(datas);
//         const map = {};
//         datas.forEach((hangar) => {
//           map[hangar.id] = hangar.Descripcion;
//         });
//         setHangarMap(map);
//       } catch (error) {
//         console.error("Error al obtener datos del backend:", error);
//       }
//     };

//     const level = localStorage.getItem("userLevel");
//     if (level) {
//       setUserLevel(parseInt(level));
//     }

//     // Fetch initial data
//     fetchData();
//     fetchDataState();
//     fetchDataHangar();

//     // Socket event listeners
//     socket.on("listTruckViewData", () => {
//       fetchData();  // Re-fetch data and rerender when new data is received
//     });

//     socket.on("truckStateUpdated", () => {
//       fetchData();  // Re-fetch data and rerender when a truck's state is updated
//     });

//     return () => {
//       socket.off("listTruckViewData");
//       socket.off("truckStateUpdated");
//     };
//   }, []);

//   const handleChange = async (event, index) => {
//     const newStateId = event.target.value;
//     const truckId = data[index].id;

//     const updatedData = {
//       id_state: newStateId,
//       id_hangar: UpdateData.id_hangar, // Mantener el valor actual de id_hangar
//     };

//     try {
//       await updateTruckState(truckId, updatedData);
//       // No need to manually update the state here, fetchData will be called automatically after the server emits the update event
//     } catch (error) {
//       console.error("Error al actualizar el estado del camión:", error);
//     }
//   };

//   const handleHangarChange = async (event, index) => {
//     const newHangarId = event.target.value;
//     const truckId = data[index].id;

//     // Verificar si Hangar 2 ya está ocupado
//     const isHangar2Occupied = data.some(
//       (camion, i) => camion.id_hangar === 2 && i !== index
//     );

//     if (newHangarId === 2 && isHangar2Occupied) {
//       // Si Hangar 2 está ocupado, mostrar advertencia
//       setError("Hangar 2 ya está ocupado por otro camión.");
//       return;
//     } else {
//       setError(null); // Limpiar cualquier advertencia anterior
//     }

//      // Verificar si Hangar 2 ya está ocupado
//      const isHangar1Occupied = data.some(
//       (camion, i) => camion.id_hangar === 1 && i !== index
//     );

//     if (newHangarId === 1 && isHangar1Occupied) {
//       // Si Hangar 2 está ocupado, mostrar advertencia
//       setError("Hangar 1 ya está ocupado por otro camión.");
//       return;
//     } else {
//       setError(null); // Limpiar cualquier advertencia anterior
//     }

//     const updatedData = {
//       id_hangar: newHangarId,
//       id_state: data[index].id_state, // Mantener el valor actual de id_state
//     };

//     try {
//       await updateTruckState(truckId, updatedData);
//     } catch (error) {
//       console.error("Error al actualizar el hangar del camión:", error);
//     }
//   };

//   const getEstadoColor = (estado) => {
//     switch (estado) {
//       case "Entrada Autorizada":
//         return "#02ff39";
//       case "En Proceso":
//         return "#ffee04";
//       case "Carga":
//         return "#00ff5e";
//       case "Descarga":
//         return "#ff0000";
//       case "Desencarpar":
//         return "#f96d02";
//       case "Liberado Para Salida":
//         return "#0fec0f";
//         case "En Espera":
//           return "#f32307";
//       default:
//         return "#ffffff";
//     }
//   };

//   return (
//     <Box m="20px">
//       <Box display="flex" justifyContent="space-between" p={0}>
//         <Header title="Lista de Camiones" subtitle="Ingreso de Camiones" />
//       </Box>

//       <Box
//         m="40px 0 0 0"
//         height="75vh"
//         backgroundColor={colors.primary[400]}
//         p="20px"
//         borderRadius="8px"
//       >
//         {error && (
//           <Alert severity="warning" sx={{ marginBottom: "20px" }}>
//             {error}
//           </Alert>
//         )}
//         <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
//           {data && data.length > 0 ? (
//             data.map((camion, index) => (
//               <Box
//                 key={index}
//                 backgroundColor={colors.blueAccent[900]}
//                 p="20px"
//                 borderRadius="8px"
//                 boxShadow="0 0 10px rgba(255, 255, 255, 0.1)"
//               >
//                 <Box
//                   display={"flex"}
//                   marginTop={"5px"}
//                   alignItems="center"
//                   marginBottom={"15px"}
//                 >
//                   <Typography
//                     variant="h3"
//                     fontWeight="bold"
//                     color={colors.primary}
//                     mr={2}
//                   >
//                     Lugar:
//                   </Typography>

//                   <FormControl fullWidth>
//                     <InputLabel
//                       id={`hangar-select-label-${index}`}
//                       sx={{ marginLeft: "-3%", color: colors.primary[100] }}
//                     >
//                       Lugar Asignado
//                     </InputLabel>
//                     <Select
//                       labelId={`hangar-select-label-${index}`}
//                       id={`hangar-select-${index}`}
//                       value={camion.id_hangar || ''}
//                       label="Hangar" 
//                       onChange={(event) => handleHangarChange(event, index)}
//                       sx={{ marginLeft: "-3%", color: colors.primary[100] }}
//                     >
//                       {hangarList &&
//                         hangarList.length > 0 &&
//                         hangarList.map((hangar) => (
//                           <MenuItem key={hangar.id} value={hangar.id}>
//                             {hangar.descripcion}
//                           </MenuItem>
//                         ))}
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 <Typography
//                   variant="h3"
//                   fontWeight="bold"
//                   marginBottom={"20px"}
//                 >
//                   Camión: {camion.chapa}
//                 </Typography>

//                 <Box display={"flex"} marginTop={"5px"} alignItems="center">
//                   <Typography
//                     variant="h3"
//                     fontWeight="bold"
//                     color={getEstadoColor(camion.estado)}
//                     mr={2}
//                   >
//                     Estado:
//                   </Typography>

//                   <FormControl fullWidth>
//                     <InputLabel
//                       id={`estado-select-label-${index}`}
//                       sx={{ marginLeft: "-3%" }}
//                     >
//                       Estado
//                     </InputLabel>
//                     <Select
//                       labelId={`estado-select-label-${index}`}
//                       id={`estado-select-${index}`}
//                       value={camion.id_state || ''}
//                       label="Estado"
//                       onChange={(event) => handleChange(event, index)}
//                       sx={{ marginLeft: "-3%" }}
//                     >
//                       {statesList &&
//                         statesList.length > 0 &&
//                         statesList.map((stateItem) => (
//                           <MenuItem key={stateItem.id} value={stateItem.id}>
//                             {stateItem.Descripcion}
//                           </MenuItem>
//                         ))}
//                     </Select>
//                   </FormControl>
//                 </Box>
//               </Box>
//             ))
//           ) : (
//             <Typography>No hay datos disponibles</Typography>
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Truks;
