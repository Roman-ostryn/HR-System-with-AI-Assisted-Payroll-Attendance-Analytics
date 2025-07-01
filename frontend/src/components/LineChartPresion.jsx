import { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";

// import { getDatosLog } from "../../src/services/autoClave.services";
import { tokens } from "../../src/theme";
import { Box, useTheme } from "@mui/material";
import { getAutoClavebyNumber} from "../../src/services/autoClave.services";

const LineChartPresion = ({selectedRecipe }) => {
  const [lineData, setLineData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  useEffect(() => {
    if (selectedRecipe) {
      const fetchData = async () => {
        try {
          // console.log("🚀 ~ fetchData ~ selectedRecipe:", selectedRecipe)
          const response = await getAutoClavebyNumber(selectedRecipe);
          // console.log("🚀 ~ fetchData ~ response:", response)
          const formattedData = transformData(response);
          setLineData(formattedData);
        } catch (error) {
          console.error("Error al obtener los datos:", error);
        }
      };  
      fetchData();
    }
  }, [selectedRecipe]);

  const transformData = (data) => {
    return [
      {
        id: "Presion",
        color: "hsl(0, 100.00%, 36.10%)",
        data: data.map((item) => {
          const [month, day, year] = item.fecha.split("/");
          const [hours, minutes, seconds] = item.hora.split(":");
          const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
          date.setUTCHours(date.getUTCHours() + 3);
          return { x: date, y: parseFloat(item.presion) };
        }),
      },
      {
        id: "SP Presion",
        color: "hsl(0, 100.00%, 36.10%)",
        data: data.map((item) => {
          const [month, day, year] = item.fecha.split("/");
          const [hours, minutes, seconds] = item.hora.split(":");
          const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
          date.setUTCHours(date.getUTCHours() + 3);
          return { x: date, y: parseFloat(item.spPresion) };
        }),
      },
    ];
  };
  

  return (
    <Box style={{ height: 250 }} id="LineChartPresion">
      <ResponsiveLine
        data={lineData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "time" }} // Cambia la escala a "time"
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
          format: "%H:%M", // Formato de hora (puedes cambiar esto según el formato de hora que quieras)
        }}
        // colors={{ scheme: "nivo" }}
        colors={['#0161a9', '#ff6105']}
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
    </Box>
  );
};

export default LineChartPresion;
