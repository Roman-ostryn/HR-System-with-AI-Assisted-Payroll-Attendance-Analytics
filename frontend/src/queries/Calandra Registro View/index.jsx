import { Box, useTheme, Button } from "@mui/material";
import Header from "../../components/Header";
import { useState, useEffect, useRef, useContext} from "react";
import {  getDatoReporte, getDatoReporteDia } from "../../services/graficos.services";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import "jspdf-autotable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "../../css/styles.css"
import useFechaSeleccionada from "../../customHooks/parseFechaHook";


const CalandraRegistroView = () => {
  const [data, setData] = useState([]);
  const [dataC, setDataC] = useState([]);
  const [startDate, setStartDate] = useState(dayjs()); // Iniciar con null
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const chartRef = useRef();
  const secondChartRef = useRef();
  const { fechaSeleccionada, setFechaSeleccionada } = useFechaSeleccionada();
  const [fechas, setfechas] = useState({
    fecha:""
  });

  let horario = parseInt(localStorage.getItem('turno'))
 
  const columns = [
    { field: "id_producto", headerName: "ID Producto", flex: 1 },
    { field: "tipo_vidrio", headerName: "Tipo de Vidrio", flex: 2 },
    { field: "total_cantidad", headerName: "Cantidad", flex: 1 },
    { field: "turno", headerName: "Turno", flex: 1 },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      renderCell: (params) =>
        params.value ? format(new Date(params.value), "dd/MM/yyyy") : "",
    },
  ];


  useEffect(() => {
    if (startDate) {
      const formattedDate = dayjs(startDate).format("DD/MM/YYYY");  // Formatear la fecha correctamente
      setFechaSeleccionada(startDate);  // Pasar la fecha formateada al hook personalizado
    }
  }, [startDate]);
  
  

useEffect(() => {
  const fetchData = async () => {
    const response = await getDatoReporteDia(fechaSeleccionada);
    const groupedData = groupAndSummarizeData(response);

    // Verifica el valor de 'horario' y filtra los datos correspondientes al turno
    let filtrado;
    if (horario === 3) {
      filtrado = groupedData.filter(item => item.turno === "Primer Turno");
    } else if (horario === 4) {
      filtrado = groupedData.filter(item => item.turno === "Segundo Turno");
    } else {
      filtrado = groupedData; // Si no hay un valor válido, muestra todos los registros
    }

    setData(filtrado);
  };

  // Llamamos a fetchData inmediatamente al cargar el componente
  fetchData();

  // Luego, creamos un intervalo que ejecuta fetchData cada 60 segundos (60000 milisegundos)
  const intervalId = setInterval(fetchData, 60000);

  // Limpiamos el intervalo cuando el componente se desmonta o cambia fechaSeleccionada o horario
  return () => clearInterval(intervalId);

}, [fechaSeleccionada, horario]);

  const groupAndSummarizeData = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      const turno =
        item.id_horario === 3
          ? "Primer Turno"
          : item.id_horario === 4
          ? "Segundo Turno"
          : "Turno Desconocido";
      const key = `${item.id_producto}-${turno}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          id_producto: item.id_producto,
          tipo_vidrio: item.cod,
          total_cantidad: 0,
          turno: turno,
          fecha: item.fecha,
        };
      }
      groupedData[key].total_cantidad += parseInt(item.total_cantidad, 10) || 0;
    });
    return Object.values(groupedData);
  };



  const calcularTotalProducido = () => {
    return data.reduce((acc, curr) => acc + curr.total_cantidad, 0);
  };

  const calcularTotalDefectos = () => {
    return dataC.reduce((acc, curr) => acc + (parseInt(curr.total_cantidad, 10) || 0), 0);
  };
  return (
    <Box m="20px">

      <Box sx={{
        display:"flex",
        justifyContent:"space-between",
        paddingRight:"50px"
      }}>
      <Header title="Producción del Día" subtitle="Clasificación de Laminados" />

      <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Filtrar Por Fecha"
                value={startDate}
                  onChange={(newValue) => setStartDate(dayjs(newValue))}  // Asegurarse de que newValue se pase correctamente como un objeto de dayjs
                  format="DD/MM/YYYY"
              />
              {/* <DatePicker
                label="Fecha de Fin"
                value={endDate}
                onChange={(newValue) => setEndDate(dayjs(newValue))}
                format="DD/MM/YYYY"
              /> */}
            </DemoContainer>
          </LocalizationProvider>
        </Box>
   
      
      </Box>
      <Box
        m="10px"
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "100%",
          width: "100%",
          margin: "0",
          // boxSizing: "border-box",
        }}
      >
        
      </Box>
      <Box
          sx={{
            fontFamily: "sans-serif",
            fontSize: "20px",
            marginTop: "10px",
            zIndex: 100,


          }}
        >
          Total Producido: {calcularTotalProducido()}
        </Box>
      <Box
        m="30px 5px 5px 10px"
        height="77vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[900],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[900],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          getRowId={(row) => `${row.id_producto}-${row.turno}`}
          columns={columns}
          disableMultipleSelection
        />

        
        <Box sx={{ paddingRight: "2%", paddingTop: "0.5%", paddingBottom:"3%" }}>
          <div className="wrap">
          {/* <Button className="button-animation" type="submit" color="secondary" variant="contained" onClick={handleGenerate}>
            Informar Problema
          </Button> */}
          </div>
        </Box>
      </Box> 


    </Box>
    
  );
  
};

export default CalandraRegistroView;

