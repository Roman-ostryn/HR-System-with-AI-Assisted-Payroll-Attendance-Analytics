// import React, { useState, useEffect } from 'react';
// import io from "socket.io-client";
// import { requestListTruckView } from '../../services/trukSocket.services';
// import { Box, Typography } from "@mui/material";

// const SOCKET_URL = "http://192.168.88.69:4000";
// const socket = io(SOCKET_URL, {
//   withCredentials: true,
//   transports: ["websocket", "polling"],
//   query: {
//     token: localStorage.getItem("authToken"),
//   },
// });

// const Porteria = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState(null);

//   const fetchData = async () => {
//     try {
//       const datos = await requestListTruckView();
//       if (datos) {
//         setData(datos);
//         const filtered = datos.find((item) => item.id_state === 1);
//         setFilteredData(filtered ? { ...filtered } : null);
//       }
//     } catch (error) {
//       console.error("Error al obtener datos del backend:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();

//     socket.on("listTruckViewData", (hangarData) => {
//       if (hangarData && hangarData.length > 0) {
//         setData(hangarData);
//         const filtered = hangarData.find((item) => item.id_state === 1);
//         setFilteredData(filtered ? { ...filtered } : null);
//       }
//     });

//     socket.on("truckStateUpdated", (updatedTruck) => {
//       // Verifica que updatedTruck no sea null o indefinido y que id_state y estado existan
//       if (
//         updatedTruck && 
//         updatedTruck.id !== null && 
//         updatedTruck.id_state !== undefined &&
//         updatedTruck.estado
//       ) {
//         setData((prevData) =>
//           prevData.map((truck) =>
//             truck.id === updatedTruck.id ? updatedTruck : truck
//           )
//         );
//         if (updatedTruck.id_state === 1) {
//           setFilteredData({ ...updatedTruck });
//         }
//       } else {
//         // console.warn("El objeto actualizado es nulo o indefinido, o faltan datos clave:", updatedTruck);
//         fetchData();
//       }
//     });

//     return () => {
//       socket.off("listTruckViewData");
//       socket.off("truckStateUpdated");
//     };
//   }, []);


//   const getEstadoColor = (estado) => {
//     switch (estado) {
//       case "Entrada Autorizada":
//         return "#02ff39";
//       case "En Proceso":
//         return "#ffee04";
//       case "Carga":
//         return "#00ff5e";
//       case "Descarga":
//         return "#ff9100";
//       case "Desencarpar":
//         return "#f96d02";
//       case "Liberado para Salida":
//         return "#0fec0f";
//       case "En Espera":
//         return "#f32307";
//       default:
//         return "#ffffff";
//     }
//   };

//   return (
//     <Box sx={{
//       background: "#1f2a40",
//       height: "95vh",
//       width: "97%",
//       padding: "5vh 5vw",
//       marginTop: "3vh",
//       marginLeft: "3vw",
//       boxShadow: "0 0 5px 0px #000000",
//       borderRadius: "10px",
//       boxSizing: "border-box"
//     }}>
//       <Box sx={{
//         fontSize: "2vw",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center"
//       }}>
//         <h1 style={{
//           fontSize: "10vw",
//           marginTop: "-2vh",
//           backgroundColor:"#fc7711",
//           border: "2px solid black",
//           textShadow:"2px 2px 2px black"
//         }}>Porteria</h1>

//         <Box>
//           <img className='logo'
//             style={{
//               width: "600px", // Mantener el tamaño fijo
//               height: "250px", // Mantener el tamaño fijo
//               margin:"0",
//               marginTop: "-12vh",
//               marginRight: "2vw",
//               border: "2px solid black",
//             }}
//             src="../../assets/dracena.png" alt="logo" />
//         </Box>
//       </Box>
      
//       {filteredData ? (
//         <Box>
//           <Typography variant="h1" sx={{ fontSize: "10vw", marginTop: "-12vh", fontWeight: "700" ,textShadow:"2px 2px 2px black" }}>
//             Camión: {filteredData.chapa}
//           </Typography>

//           <Box sx={{ marginTop: "10vh" }}>
//             <Typography variant="h1" sx={{ fontSize: "10vw", marginTop: "-15vh", fontWeight: "700" ,textShadow:"2px 2px 2px black",color: getEstadoColor(filteredData.estado) }}>
//               Estado: {filteredData.estado}
//             </Typography>
//           </Box>
//         </Box>
//       ) : (
//         <Typography variant="h1" sx={{ fontSize: "9.5vw", marginTop: "-5vh", fontWeight: "700" , textShadow:"2px 2px 2px black"}}>
//           No hay camiones Para Ingreso
//         </Typography>
//       )}
//     </Box>
//   );
// }

// export default Porteria;
