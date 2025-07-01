// import { useEffect, useState } from "react";
// import { ResponsiveLine } from "@nivo/line";
// import { getDatosSala } from "../../src/services/salaLimpia.services";
// import { tokens } from "../../src/theme";
// import { Box, useTheme, CircularProgress, Typography } from "@mui/material";
// import useFechaSeleccionada from "../../src/customHooks/parseFechaHook";
// import io from "socket.io-client";


// const socket = io(getUrlSocket());


// const LineChartSalaLimpia = () => {
//   const [lineData, setLineData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const { fechaSeleccionada } = useFechaSeleccionada(); // Solo obtener la fecha seleccionada

//     useEffect(() => {
//       // Escuchar notificaciones desde el backend
//       socket.on("newDataNotification", (data) => {
//         console.log("🚀 ~ newDataNotification ~ data", data);
//         fetchData();
//       });
  
//       // Limpiar el socket cuando el componente se desmonte
//       return () => socket.off("newDataNotification");
//     }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // const response = await getDatosSala("2025-02-21");
//         // console.log("🚀 ~ fetchData ~ response:", response)
//         const response = await getDatosSala(fechaSeleccionada);
//         const formattedData = transformData(response);
//         setLineData(formattedData);
//       } catch (error) {
//         console.error("Error al obtener los datos:", error);
//         setError("Error al cargar los datos.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (fechaSeleccionada) {
//       fetchData();
//     }
//   }, [fechaSeleccionada]); // Dependemos de fechaSeleccionada para hacer la llamada

//   const transformData = (data) => {
//     const temperaturaData = [];
//     const humedadData = [];
    
//     data.forEach((item) => {
//       const date = new Date(item.create_at); // Asumimos que `create_at` es un string ISO
//       temperaturaData.push({
//         x: date,
//         y: parseFloat(item.temp_interna),
//       });
//       humedadData.push({
//         x: date,
//         y: parseFloat(item.humedad_int),
//       });
//     });

//     return [
//       {
//         id: "Temperatura",
//         color: "hsl(150, 80%, 60%)",
//         data: temperaturaData,
//       },
//       {
//         id: "Humedad",
//         color: "hsl(0, 80%, 60%)",
//         data: humedadData,
//       },
//     ];
//   };

//   return (
//     <Box style={{ height: 250 }} id="LineChartSalaLimpia">
//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="100%">
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height="100%">
//           <Typography variant="h6" color="error">
//             {error}
//           </Typography>
//         </Box>
//       ) : (
//         <ResponsiveLine
//           data={lineData}
//           margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
//           xScale={{ type: "time" }} // Cambia la escala a "time"
//           yScale={{
//             type: "linear",
//             min: "auto",
//             max: "auto",
//             stacked: false,
//             reverse: false,
//           }}
//           axisLeft={{
//             legend: "Valores",
//             legendOffset: -40,
//             legendPosition: "middle",
//             tickColor: colors.primary[100],
//           }}
//           axisBottom={{
//             legend: "Tiempo",
//             legendOffset: 36,
//             legendPosition: "middle",
//             tickRotation: -45,
//             tickColor: colors.primary[100],
//             format: "%H:%M", // Formato de hora
//           }}
//           colors={{ scheme: "nivo" }}
//           pointSize={8} // Tamaño de los círculos
//           pointColor={{ theme: "background" }} // Color de los puntos
//           pointBorderWidth={2} // Ancho del borde de los círculos
//           pointBorderColor={{ from: "serieColor" }} // El borde será del color de la serie
//           pointLabelYOffset={-12}
//           useMesh={true}
//           legends={[
//             {
//               anchor: "top-right",
//               direction: "column",
//               justify: false,
//               translateX: 100,
//               translateY: 0,
//               itemsSpacing: 2,
//               itemDirection: "left-to-right",
//               itemWidth: 80,
//               itemHeight: 20,
//               itemOpacity: 0.75,
//               symbolSize: 12,
//               symbolShape: "circle",
//               symbolColor: "from:serieColor",
//               itemTextColor: colors.primary[100],
//             },
//           ]}
//           lineWidth={4}
//           theme={{
//             axis: {
//               ticks: {
//                 text: {
//                   fill: colors.primary[100],
//                 },
//               },
//               legend: {
//                 text: {
//                   fill: colors.primary[100],
//                 },
//               },
//             },
//             legends: {
//               text: {
//                 fill: colors.primary[100],
//               },
//             },
//           }}
//         />
//       )}
//     </Box>
//   );
// };

// export default LineChartSalaLimpia;

import { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { getDatosSala } from "../../src/services/salaLimpia.services";
import { tokens } from "../../src/theme";
import { Box, useTheme, CircularProgress, Typography } from "@mui/material";
import useFechaSeleccionada from "../../src/customHooks/parseFechaHook";
import io from "socket.io-client";
import getUrlSocket from '../utils/getUrlSocket';

const socket = io(getUrlSocket());

const LineChartSalaLimpia = () => {
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { fechaSeleccionada } = useFechaSeleccionada(); // Obtener la fecha seleccionada

  // Función para obtener los datos
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDatosSala(fechaSeleccionada);
      const formattedData = transformData(response);
      setLineData(formattedData);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setError("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Escuchar notificaciones desde el backend y actualizar los datos
    const handleNewData = () => {
      console.log("📡 Nueva notificación recibida desde el servidor.");
      fetchData();
    };

    socket.on("newDataNotification", handleNewData);

    return () => {
      socket.off("newDataNotification", handleNewData);
    };
  }, []); // Se ejecuta solo al montar el componente

  useEffect(() => {
    if (fechaSeleccionada) {
      fetchData();
    }
  }, [fechaSeleccionada]); // Se ejecuta cuando cambia la fecha seleccionada

  const transformData = (data) => {
    const temperaturaData = [];
    const humedadData = [];

    data.forEach((item) => {
      const date = new Date(item.create_at);
      temperaturaData.push({
        x: date,
        y: parseFloat(item.temp_interna),
      });
      humedadData.push({
        x: date,
        y: parseFloat(item.humedad_int),
      });
    });

    return [
      {
        id: "Temperatura",
        color: "hsl(150, 80%, 60%)",
        data: temperaturaData,
      },
      {
        id: "Humedad",
        color: "hsl(0, 80%, 60%)",
        data: humedadData,
      },
    ];
  };

  return (
    <Box style={{ height: 250 }} id="LineChartSalaLimpia">
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      ) : (
        <ResponsiveLine
          data={lineData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "time" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          axisLeft={{
            legend: "Valores",
            legendOffset: -40,
            legendPosition: "middle",
            tickColor: colors.primary[100],
          }}
          axisBottom={{
            legend: "Tiempo",
            legendOffset: 36,
            legendPosition: "middle",
            tickRotation: -45,
            tickColor: colors.primary[100],
            format: "%H:%M",
          }}
          colors={{ scheme: "nivo" }}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "top-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 2,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolColor: "from:serieColor",
              itemTextColor: colors.primary[100],
            },
          ]}
          lineWidth={4}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: colors.primary[100],
                },
              },
              legend: {
                text: {
                  fill: colors.primary[100],
                },
              },
            },
            legends: {
              text: {
                fill: colors.primary[100],
              },
            },
          }}
        />
      )}
    </Box>
  );
};

export default LineChartSalaLimpia;
