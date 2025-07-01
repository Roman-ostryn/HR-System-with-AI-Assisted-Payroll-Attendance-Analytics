// import { ResponsiveLine } from "@nivo/line";
// import { useTheme } from "@mui/material";
// import { tokens } from "../theme";
// import { mockLineData as data } from "../data/mockData";

// const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   return (
//     <ResponsiveLine
//       data={data}
//       theme={{
//         axis: {
//           domain: {
//             line: {
//               stroke: colors.grey[100],
//             },
//           },
//           legend: {
//             text: {
//               fill: colors.grey[100],
//             },
//           },
//           ticks: {
//             line: {
//               stroke: colors.grey[100],
//               strokeWidth: 1,
//             },
//             text: {
//               fill: colors.grey[100],
//             },
//           },
//         },
//         legends: {
//           text: {
//             fill: colors.grey[100],
//           },
//         },
//         tooltip: {
//           container: {
//             color: colors.primary[500],
//           },
//         },
//       }}
//       colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
//       margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
//       xScale={{ type: "point" }}
//       yScale={{
//         type: "linear",
//         min: "auto",
//         max: "auto",
//         stacked: true,
//         reverse: false,
//       }}
//       yFormat=" >-.2f"
//       curve="catmullRom"
//       axisTop={null}
//       axisRight={null}
//       axisBottom={{
//         orient: "bottom",
//         tickSize: 0,
//         tickPadding: 5,
//         tickRotation: 0,
//         legend: isDashboard ? undefined : "transportation", // added
//         legendOffset: 36,
//         legendPosition: "middle",
//       }}
//       axisLeft={{
//         orient: "left",
//         tickValues: 5, // added
//         tickSize: 3,
//         tickPadding: 5,
//         tickRotation: 0,
//         legend: isDashboard ? undefined : "count", // added
//         legendOffset: -40,
//         legendPosition: "middle",
//       }}
//       enableGridX={false}
//       enableGridY={false}
//       pointSize={8}
//       pointColor={{ theme: "background" }}
//       pointBorderWidth={2}
//       pointBorderColor={{ from: "serieColor" }}
//       pointLabelYOffset={-12}
//       useMesh={true}
//       legends={[
//         {
//           anchor: "bottom-right",
//           direction: "column",
//           justify: false,
//           translateX: 100,
//           translateY: 0,
//           itemsSpacing: 0,
//           itemDirection: "left-to-right",
//           itemWidth: 80,
//           itemHeight: 20,
//           itemOpacity: 0.75,
//           symbolSize: 12,
//           symbolShape: "circle",
//           symbolBorderColor: "rgba(0, 0, 0, .5)",
//           effects: [
//             {
//               on: "hover",
//               style: {
//                 itemBackground: "rgba(0, 0, 0, .03)",
//                 itemOpacity: 1,
//               },
//             },
//           ],
//         },
//       ]}
//     />
//   );
// };

// export default LineChart;


import { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { getAutoClavebyNumber } from "../../src/services/autoClave.services";
import { tokens } from "../../src/theme";
import { Box, useTheme } from "@mui/material";

const LineChart = ({ selectedRecipe }) => {
  const [lineData, setLineData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedRecipe) {
        try {
          const response = await getAutoClavebyNumber(selectedRecipe);
          const formattedData = transformData(response);
          // Asegúrate de que se establezca un nuevo array para forzar el renderizado
          setLineData([...formattedData]);
        } catch (error) {
          console.error("Error al obtener los datos:", error);
        }
      } else {
        // Restablecer lineData si no hay selectedRecipe
        setLineData([]);
      }
    };
    fetchData();
  }, [selectedRecipe]);

  const transformData = (data) => {
    return [
      {
        id: "Temperatura",
        color: "hsl(0, 100.00%, 36.10%)",
        data: data.map((item) => {
          const [month, day, year] = item.fecha.split("/");
          const [hours, minutes, seconds] = item.hora.split(":");
          const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
          date.setUTCHours(date.getUTCHours() + 3);
          return { x: date, y: parseFloat(item.temperatura) };
        }),
      },
      {
        id: "SP Temperatura",
        color: "rgb(206, 220, 0)",
        data: data.map((item) => {
          const [month, day, year] = item.fecha.split("/");
          const [hours, minutes, seconds] = item.hora.split(":");
          const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
          date.setUTCHours(date.getUTCHours() + 3);
          return { x: date, y: parseFloat(item.spTemperatura) };
        }),
      },
    ];
  };

  return (
    <Box style={{ height: 250 }} id="lineChart">
      <ResponsiveLine
        data={lineData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "time" }}
        yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
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
        colors={['rgb(206, 220, 0)', '#ff6105']}
        pointSize={0}
        pointColor={{ theme: "background" }}
        pointBorderWidth={0}
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
            itemOpacity: 1,
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
              text: { fill: colors.primary[100] },
            },
            legend: {
              text: { fill: colors.primary[100] },
            },
          },
          legends: {
            text: { fill: colors.primary[100] },
          },
          grid: {
            line: {
              stroke: colors.primary[200],
            },
          },
        }}
      />
    </Box>
  );
};

export default LineChart;
