import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { Box, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getDatosCantidad } from "../services/graficos.services";
import useFechaSeleccionada from "../customHooks/parseFechaHook";
import useMesseleccionada from "../customHooks/parseMesHook";



const PieChart = ({ fecha }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [values, setValues] = useState([]);
  const [total, setTotal] = useState([]);
  const [fechas, setfechas] = useState({
    fechaInicio:"",
    fechaFin:""
  });
  // const { fechaSeleccionada, setFechaSeleccionada } = useFechaSeleccionada();
  const { elVerdadero, setElVerdadero } = useMesseleccionada();
  
  useEffect(() => {
     // Aquí puedes actualizar los datos basados en la nueva fecha seleccionada
     // Ejemplo: hacer una nueva llamada a la API con la nueva fecha
   }, [elVerdadero]); 

  useEffect(() => {
    setfechas({
          fechaInicio: elVerdadero.fechaInicio,
          fechaFin: elVerdadero.fechaFin
    }) // Para verificar si la fecha está llegando correctamente
    // Actualizar el gráfico o hacer otras acciones basadas en la nueva fecha
  }, [fecha]);

  useEffect(() => {
    const fetchCantidad = async () => {
      try {
        const response = await getDatosCantidad(fecha);

        if (response.length > 0) {
          const data = response[0];

          const transformedData = [
            {
              id: "Tipo A",
              label: "Tipo A",
              value: parseInt(data.total_tipo_A, 10),
            },
            {
              id: "Tipo B",
              label: "Tipo B",
              value: parseInt(data.total_tipo_B, 10),
            },
            {
              id: "Tipo C",
              label: "Tipo C",
              value: parseInt(data.total_tipo_C, 10),
            },
          ];
          setTotal(data);
          setValues(transformedData);
        }
      } catch (error) {
        console.error('Error al obtener datos del backend:', error);
      }
    };

    fetchCantidad();
  }, [fecha]);

  return (
    <>
      <Box sx={{
        textAlign: "end",
        paddingRight: "15%",
        width: "100%",
        fontFamily: "sans-serif",
        alignContent: "flex-end !important"
      }}>
        <label style={{
          fontSize: "25px",
          padding: "5px"
        }}
        >Cantidad Producida: </label>

        <label style={{
          fontSize: "25px"
        }} >{total.cantidad_producida}</label>
      </Box>
      <ResponsivePie
        data={values}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[900],
              },
            },
            legend: {
              text: {
                fill: colors.grey[900],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[900],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[900],
              },
            },
          },
          labels: {
            text: {
              fontSize: 20, // Ajuste del tamaño de las etiquetas
              fill: colors.grey[100], // Color de las etiquetas
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
        }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={colors.grey[100]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={true}
        arcLabelsRadiusOffset={0.4}
        arcLabelsSkipAngle={7}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        arcLabels={({ datum }) => `${datum.value}`}
        colors={['#1dd53f', '#fcb800', 'rgb(248, 0, 50)']}
        tooltip={({ datum: { label, value, color } }) => (
          <div
            style={{
              padding: '12px',
              color,
              background: "#ffffff",
              border:"0.5px solid black"
            }}
          >
            <strong>
              {label} : {value}</strong>
          </div>
        )}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#ffffff",
                },
              },
            ],
          },
        ]}
      />
    </>

    
  );
};

export default PieChart;