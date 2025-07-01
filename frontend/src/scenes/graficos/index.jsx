import { Box, useTheme, Button } from "@mui/material";
import Header from "../../components/Header";
import ProduccionPie from "../../components/ProduccionPie";
import PieChart from "../../components/PieChart";
import { useState, useEffect, useRef, useContext} from "react";
import { getDatoClasificacion, getDatoInterfoleacion, getDatoReporte } from "../../services/graficos.services";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "../../css/styles.css"
import useFechaSeleccionada from "../../customHooks/parseFechaHook";
import useMesSeleccionada from "../../customHooks/parseMesHook";
import ModalCharge from "../../modal/modalCharge";


const Graficos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataC, setDataC] = useState([]);
  const [dataInterfoleacion, setDataInterfoleacion] = useState([]);
  const [startDate, setStartDate] = useState(dayjs()); // Iniciar con null
  const [endDate, setEndDate] = useState(dayjs()); // Iniciar con null
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const chartRef = useRef();
  const secondChartRef = useRef();
  const { fechaSeleccionada, setFechaSeleccionada } = useFechaSeleccionada();
  // const { fechaInicio, setFechaInicio } = useMesSeleccionada();
  // const { fechaFin, setFechaFin } = useMesSeleccionada();
  // const [elVerdadero, setElVerdadero] = useMesSeleccionada();
  const {
    fechaInicio, 
    setFechaInicio,
    fechaFin,
    setFechaFin,
    elVerdadero
} = useMesSeleccionada();


  const [fechas, setfechas] = useState({
    fecha:""
  });
  const fechasxd = {
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
  }

  const columns = [
    { field: "id_producto", headerName: "ID Producto", flex: 1 },
    { field: "tipo_vidrio", headerName: "Tipo de Vidrio", flex: 2 },
    { field: "total_cantidad", headerName: "Cantidad", flex: 1 },
    { field: "turno", headerName: "Turno", flex: 1 },
    // {
    //   field: "fecha",
    //   headerName: "Fecha",
    //   flex: 1,
    //   renderCell: (params) =>
    //     params.value ? format(new Date(params.value), "dd/MM/yyyy") : "",
    // },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      // renderCell: (params) =>
      //   params.value ? format(new Date(params.value), "dd/MM/yyyy") : "",
    },
  ];

  const columnsC = [
    { field: "id_producto", headerName: "ID Producto", flex: 1 },
    { field: "cod", headerName: "Tipo de Vidrio", flex: 2 },
    { field: "serie", headerName: "Serie", flex: 1 },
    { field: "total_cantidad", headerName: "Cantidad", flex: 1 },
    { field: "clasificacion", headerName: "Clasificacion", flex: 1 },
    { field: "obs", headerName: "Defecto", flex: 1 },
    { field: "motivo", headerName: "Motivo", flex: 1 },
    { field: "turnos", headerName: "Turno", flex: 1 },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      renderCell: (params) =>
        params.value ? format(new Date(params.value), "dd/MM/yyyy") : "",
    },
  ];

  const columnsI = [
    { field: "id_producto", headerName: "ID Producto", flex: 1 },
    { field: "cod", headerName: "Tipo de Vidrio", flex: 2 },
    // { field: "serie", headerName: "Serie", flex: 1 },
    { field: "cantidad", headerName: "Cantidad", flex: 1 },
    { field: "clasificacion", headerName: "Clasificacion", flex: 1 },
    { field: "obs", headerName: "Defecto", flex: 1 },
    { field: "motivo", headerName: "Motivo", flex: 1 },
    { field: "turno", headerName: "Turno", flex: 1 },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      // renderCell: (params) =>
      //   params.value ? format(new Date(params.value), "dd/MM/yyyy") : "",
    },
  ];

  // useEffect(() => {
  //   if (startDate) {
  //     const formattedDate = dayjs(startDate).format("DD/MM/YYYY");  // Formatear la fecha correctamente
  //     setFechaSeleccionada(startDate);  // Pasar la fecha formateada al hook personalizado
  //   }

  //   if (endDate) {
  //     const formattedEndDate = dayjs(endDate).format("DD/MM/YYYY");  // Formatear la fecha correctamente
  //     setFechaSeleccionada(endDate);  // Pasar la fecha formateada al hook personalizado
  //   }
  // }, [startDate, endDate]); // Dependencias para el efecto


  useEffect(() => {
    if (startDate) {
      const formattedStartDate = dayjs(startDate).format("DD/MM/YYYY");
      setFechaInicio(dayjs(startDate)); // Pasamos dayjs directamente, no la fecha formateada
    }
  
    if (endDate) {
      const formattedEndDate = dayjs(endDate).format("DD/MM/YYYY");
      setFechaFin(dayjs(endDate)); // Igual que arriba
    }
  }, [startDate, endDate]);
  
  
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await getDatoReporte(elVerdadero);
      //  console.log("response", response);
      const groupedData = groupAndSummarizeData(response);
      // console.log("groupedData", groupedData);
      setData(groupedData);
    };
    fetchData();
  }, [elVerdadero]);

  
  useEffect(() => {
    const fetchDataInterfoleacion = async () => {
      const response = await getDatoInterfoleacion(elVerdadero);
      // console.log("response interfoliacion", response);

      const groupedData = groupAndSumInterfoliacion(response);
      // console.log("groupedData", groupedData);
       setDataInterfoleacion(groupedData);
    };
    fetchDataInterfoleacion();
  }, [elVerdadero]);


  useEffect(() => {
    const fetchData = async () => {
      const response = await getDatoClasificacion(elVerdadero);
      // const groupedData = groupAndSummarizeData(response);
      setDataC(response);
    };
    fetchData();
  }, [elVerdadero]);



  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
    });
  };

  const groupAndSumInterfoliacion = (data) => {
    const groupData = {};
  
    data.forEach((item) => {
      // Incluimos la fecha formateada en la clave de agrupación
      const key = `${item.id_producto}-${item.clasificacion}-${item.fecha}`;
  
      if (!groupData[key]) {
        groupData[key] = {
          id_producto: item.id_producto,
          clasificacion: item.clasificacion,
          cod: item.cod,
          cantidad: 0,
          fecha: item.fecha, // usamos la fecha formateada
          obs: item.obs,
          turno: item.turno,
          motivo: item.motivo
        };
      }
  
      groupData[key].cantidad += parseInt(item.cantidad, 10) || 0;
    });
  
    // Devolvemos los valores agrupados en forma de array
    return Object.values(groupData);
  };
  



  const groupAndSummarizeData = (data) => {
    const groupedData = {};
  
    data.forEach((item) => {
      const turno =
        item.id_horario === 3
          ? "Primer Turno"
          : item.id_horario === 4
          ? "Segundo Turno"
          : "Turno Desconocido";
  
      const fechaFormateada = new Date(item.fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
  
      const key = `${item.id_producto}-${turno}-${fechaFormateada}`;
  
      if (!groupedData[key]) {
        groupedData[key] = {
          id_producto: item.id_producto,
          tipo_vidrio: item.cod,
          total_cantidad: 0,
          turno: turno,
          fecha: fechaFormateada,
        };
      }
  
      // Sumar la cantidad de cada producto
      groupedData[key].total_cantidad += parseInt(item.total_cantidad || item.cantidad || 1, 10);
    });
  
    // Convertimos a array y ordenamos por fecha
    return Object.values(groupedData).sort((a, b) => {
      const dateA = a.fecha.split('/').reverse().join('-');
      const dateB = b.fecha.split('/').reverse().join('-');
      return new Date(dateA) - new Date(dateB);
    });
  };
  


  const calcularTotalProducido = () => {
    return data.reduce((acc, curr) => acc + curr.total_cantidad, 0);
  };

  const calcularTotalDefectos = () => {
    return dataC.reduce((acc, curr) => acc + (parseInt(curr.total_cantidad, 10) || 0), 0);
  };

  const calcularTotalInterfoliados = () => {
    return dataInterfoleacion.reduce((acc, curr) => acc + (parseInt(curr.cantidad, 10) || 0), 0);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Crear un nuevo documento PDF
    const pdf = new jsPDF("portrait", "pt", "a4");

    // Cargar el logo
    const logo = await loadImage('../assets/dracenaC.png');
    const logoWidth = 200;
    const logoHeight = 80;
    const spacing = 90;
    const paddingBottom = 30;
    const paddingTop = 30;

    // Agregar logo y título principal
    pdf.addImage(logo, 'PNG', 10, 10, logoWidth, logoHeight);
    pdf.setFontSize(20);
    pdf.text("Reportes de Producción", 10 + logoWidth + spacing, 30 + paddingTop);

    // Capturar el gráfico sin leyenda
    const chartCanvas = await html2canvas(chartRef.current, {
        useCORS: true,
        scale: 2,
        x: 0,
        y: 60,
        width: chartRef.current.offsetWidth,
        height: chartRef.current.offsetHeight,
    });
    const chartImage = chartCanvas.toDataURL("image/png");

    const secondChartCanvas = await html2canvas(secondChartRef.current, {
        useCORS: true,
        scale: 2,
        x: 0,
        y: 60,
        width: secondChartRef.current.offsetWidth,
        height: secondChartRef.current.offsetHeight,
    });
    const secondChartImage = secondChartCanvas.toDataURL("image/png");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const chartImageWidth = pdfWidth / 2 - 5;
    const chartImageHeight = (chartCanvas.height / chartCanvas.width) * chartImageWidth;

    pdf.addImage(chartImage, "PNG", 10, 100, chartImageWidth, chartImageHeight);
    pdf.addImage(secondChartImage, "PNG", pdfWidth / 2 + 10, 100, chartImageWidth, chartImageHeight);

    const producedTitleY = 100 + chartImageHeight + 40;

    // Agregar título "Laminados Producidos"
    pdf.setFontSize(14);
    pdf.text("Laminados Producidos", 40, producedTitleY);

    const tableData = data.map((row) => [
      row.tipo_vidrio,
      row.total_cantidad,
      row.turno,
      // row.fecha ? format(new Date(row.fecha), "dd/MM/yyyy") : "",
      row.fecha,

    ]);
    const tableColumns = ["Tipo de Vidrio", "Cantidad", "Turno", "Fecha"];
    const tableOptions = {
      startY: producedTitleY + 15,
      styles: {
        cellPadding: 3,
        fontSize: 11,
        overflow: 'linebreak',
        align: 'center',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 250 },
        1: { cellWidth: 70 },
        2: { cellWidth: 70 },
        3: { cellWidth: 130 },
      },
    };
    pdf.autoTable({
      head: [tableColumns],
      body: tableData,
      ...tableOptions,
    });

    const totalProducido = calcularTotalProducido();
    const totalProduccionY = pdf.lastAutoTable.finalY + 30;
    pdf.setFontSize(14);
    pdf.text(`Total Producción: ${totalProducido}`, 40, totalProduccionY);

    if (dataC.length > 0) {
    // Agregar título "Productos Defectuosos"
    const defectuososTitleY = totalProduccionY + 40;
    pdf.setFontSize(14);
    pdf.text("Productos Defectuosos", 40, defectuososTitleY);

    const defectuososData = dataC.map((row) => [
      row.cod,
      row.serie,
      row.clasificacion,
      row.obs,
      row.motivo,
      row.turnos,
    ]);
    const defectuososColumns = ["Tipo de Vidrio", "Serie", "Tipo", "Defecto", "Motivo", "Turno"];
    const defectuososOptions = {
      startY: defectuososTitleY + 15,
      styles: {
        cellPadding: 3,
        fontSize: 10,
        overflow: 'linebreak',
        align: 'center',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 150 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60 },
        3: { cellWidth: 80 },
        4: { cellWidth: 100 },
        5: { cellWidth: 90 },
      },
    };
    pdf.autoTable({
      head: [defectuososColumns],
      body: defectuososData,
      ...defectuososOptions,
    });
  }

    const totalDefectuosos = calcularTotalDefectos();
    const totalDefectuososY = pdf.lastAutoTable.finalY + 50;
    pdf.setFontSize(14);
    pdf.text(`Total Defectuosos: ${totalDefectuosos}`, 40, totalDefectuososY);

   

    if (dataC.length > 1) {

        pdf.addPage();
   
 // **Nueva sección: Agregar título "Cantidad Interfoliada"**
  const interfoliadaTitleY = totalDefectuososY - 650;
  pdf.setFontSize(14);


    pdf.text("Productos Interfoliados", 40, interfoliadaTitleY);

    // Generar tabla de "Cantidad Interfoliada"
    const interfoliadaData = dataInterfoleacion.map((row) => [
      row.cod,
      row.cantidad,
      row.clasificacion,
      row.obs,
      // row.motivo,
      row.turno,
      // row.create_at ? format(new Date(row.create_at), "dd/MM/yyyy") : "",
      row.fecha,
    ]);
    const interfoliadaColumns = ["Tipo de Vidrio", "Cantidad", "Clasificación", "Defecto", "Turno", "Fecha"];
    const interfoliadaOptions = {
      startY: interfoliadaTitleY + 15,
      styles: {
        cellPadding: 3,
        fontSize: 10,
        overflow: 'linebreak',
        align: 'center',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 150 },
        1: { cellWidth: 60 },
        2: { cellWidth: 70 },
        3: { cellWidth: 80 },
        // 4: { cellWidth: 80 },
        5: { cellWidth: 70 },
        6: { cellWidth: 90 },
      },
    };
    pdf.autoTable({
      head: [interfoliadaColumns],
      body: interfoliadaData,
      ...interfoliadaOptions,
    });
  }else{
   
     // **Nueva sección: Agregar título "Cantidad Interfoliada"**
     const interfoliadaTitleY = totalDefectuososY + 70;
     pdf.setFontSize(14);
 
    pdf.text("Productos Interfoliados", 40, interfoliadaTitleY);

    // Generar tabla de "Cantidad Interfoliada"
    const interfoliadaData = dataInterfoleacion.map((row) => [
      row.cod,
      row.cantidad,
      row.clasificacion,
      row.obs,
      // row.motivo,
      row.turno,
      // row.create_at ? format(new Date(row.create_at), "dd/MM/yyyy") : "",
      row.fecha,
    ]);
    const interfoliadaColumns = ["Tipo de Vidrio", "Cantidad", "Clasificación", "Defecto", "Turno", "Fecha"];
    const interfoliadaOptions = {
      startY: interfoliadaTitleY + 15,
      styles: {
        cellPadding: 3,
        fontSize: 10,
        overflow: 'linebreak',
        align: 'center',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 150 },
        1: { cellWidth: 60 },
        2: { cellWidth: 70 },
        3: { cellWidth: 80 },
        // 4: { cellWidth: 80 },
        5: { cellWidth: 70 },
        6: { cellWidth: 90 },
      },
    };
    pdf.autoTable({
      head: [interfoliadaColumns],
      body: interfoliadaData,
      ...interfoliadaOptions,
    });
  }

    const totalInterfoliadaY = pdf.lastAutoTable.finalY + 30;
    pdf.setFontSize(14);
    pdf.text(`Total Interfoliada: ${calcularTotalInterfoliados()}`, 40, totalInterfoliadaY);

    setIsLoading(false);  
    // Guardar el PDF
    const fechahoy = dayjs().format('DD-MM-YYYY');
    pdf.save(`Reporte_de_Produccion-${fechahoy}.pdf`);
};
  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        padding: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingRight: "50px",
        }}
      >
        <Header
          title="Producción del Día"
          subtitle="Clasificación de Laminados"
        />

        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              marginRight: "2%",
              marginLeft: "2%",
              marginTop: "1.2vh",
            }}
          >
            <Button
              sx={{
                background: "#8a1b0d",
                width: "100%",
                height: "3.2rem!important",
                color: "white",
                borderRadius: "8px",

                "&:hover": {
                  background: "#a42410", // Color de fondo cuando el botón está en hover
                },
              }}
              onClick={handleGenerate}
              variant="contained"
              color="primary"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                alt="Excel Icon"
                style={{ width: 29, height: 29, marginRight: 8 }}
              />
              Exportar
            </Button>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Fecha de Inicio"
                value={startDate}
                onChange={(newValue) => setStartDate(dayjs(newValue))} // Asegurarse de que newValue se pase correctamente como un objeto de dayjs
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}  sx={{ marginLeft: "1vh" }}>
              <DatePicker
                label="Fecha Fin"
                value={endDate}
                onChange={(newValue) => setEndDate(dayjs(newValue))} // Asegurarse de que newValue se pase correctamente como un objeto de dayjs
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
          marginTop: "-230px",
        }}
      >
        <Box height="45vh" width="45%" ref={chartRef}>
          <PieChart fecha={elVerdadero} />
        </Box>
        <Box height="45vh" width="45%" ref={secondChartRef}>
          <ProduccionPie fecha={elVerdadero} />
        </Box>
      </Box>
      <Box
        sx={{
          fontFamily: "sans-serif",
          fontSize: "20px",
          marginTop: "10px",
          zIndex: 100,
          // paddingTop:"-220px!important",
          marginTop: "-220px",
        }}
      >
        Total Producido: {calcularTotalProducido()}
      </Box>
      <Box
        m="10px 0 0 0"
        height="30vh"
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
          getRowId={(row) => `${row.id_producto}-${row.turno}-${row.fecha}`}
          columns={columns}
          disableMultipleSelection
        />
      </Box>
      <Box
        sx={{
          fontFamily: "sans-serif",
          fontSize: "20px",
          marginTop: "10px",
          zIndex: 100,
        }}
      >
        Productos Defectuosos: {calcularTotalDefectos()}
      </Box>

      <Box
        m="10px 0 0 0"
        height="30vh"
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
          rows={dataC}
          getRowId={(row) => `${row.id}-${row.turno}`}
          columns={columnsC}
          disableMultipleSelection
        />
      </Box>

      <Box
        sx={{
          fontFamily: "sans-serif",
          fontSize: "20px",
          marginTop: "10px",
          zIndex: 100,
        }}
      >
        Productos Interfoliados: {calcularTotalInterfoliados()}
      </Box>
      <Box
        m="10px 0 0 0"
        height="30vh"
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
          rows={dataInterfoleacion}
          getRowId={(row) => `${row.id_producto}-${row.clasificacion}-${row.fecha}`}

          columns={columnsI}
          disableMultipleSelection
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {/* <Box sx={{ paddingRight: "2%", paddingTop: "0.5%", paddingBottom:"3%" }}>
         <Button sx={{height:"120%"}} type="submit" color="secondary" variant="contained" onClick={handleGenerate}>
            Generar Ticket
          </Button>
        </Box>  */}

        <Box
          sx={{ paddingRight: "2%", paddingTop: "0.5%", paddingBottom: "7%" }}
        >
          {/* <div className="wrap">
            <Button
              className="button-animation"
              type="submit"
              color="secondary"
              variant="contained"
              onClick={handleGenerate}
            >
              Generar Pdf
            </Button>
          </div> */}
        </Box>
      </Box>

      {/* <ProduccionPie 
        fechaSeleccionada={fechaSeleccionada} 
        setFechaSeleccionada={setFechaSeleccionada} 
      /> */}
       <ModalCharge isLoading={isLoading} />
    </Box>
    
  );
  
};

export default Graficos;


// import { Box, useTheme, Button } from "@mui/material";
// import Header from "../../components/Header";
// import ProduccionPie from "../../components/ProduccionPie";
// import PieChart from "../../components/PieChart";
// import { useState, useEffect, useRef } from "react";
// import { getDatoReporte } from "../../services/graficos.services";
// import { format } from "date-fns";
// import { DataGrid } from "@mui/x-data-grid";
// import { tokens } from "../../theme";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { PostPdf } from "../../services/reporteCalandra.services";

// const Graficos = () => {
//   const [data, setData] = useState([]);
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const chartRef = useRef();
//   const secondChartRef = useRef();

//   const columns = [
//     { field: "id_producto", headerName: "ID Producto", flex: 1 },
//     { field: "tipo_vidrio", headerName: "Tipo de Vidrio", flex: 2 },
//     { field: "total_cantidad", headerName: "Cantidad", flex: 1 },
//     { field: "turno", headerName: "Turno", flex: 1 },
//     {
//       field: "fecha",
//       headerName: "Fecha",
//       flex: 1,
//       renderCell: (params) =>
//         params.value ? format(new Date(params.value), "dd/MM/yyyy") : "",
//     },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await getDatoReporte();
//       const groupedData = groupAndSummarizeData(response);
//       setData(groupedData);
//     };
//     fetchData();
//   }, []);

//   const handleGenerate = async () => {
//     await new Promise((resolve) => setTimeout(resolve, 500)); // Espera por seguridad

//     try {
//       const pdf = new jsPDF("portrait", "pt", "a4");

//       // Cargar logo
//       const logo = await loadImage('/assets/dracenaC.png');
//       if (!logo) {
//         throw new Error("Error al cargar el logo.");
//       }
//       const logoWidth = 200;
//       const logoHeight = 80;
//       const spacing = 90;
//       const paddingBottom = 30;
//       const paddingTop = 30;

//       // Añadir el logo
//       pdf.addImage(logo, 'PNG', 10, 10, logoWidth, logoHeight);
//       pdf.setFontSize(20);
//       pdf.text("Reportes de Producción", 10 + logoWidth + spacing, 30 + paddingTop);

//       // Capturar los gráficos
//       const chartCanvas = await html2canvas(chartRef.current);
//       const secondChartCanvas = await html2canvas(secondChartRef.current);
//       if (!chartCanvas || !secondChartCanvas) {
//         throw new Error("Error al capturar los gráficos.");
//       }

//       const chartImage = chartCanvas.toDataURL("image/png");
//       const secondChartImage = secondChartCanvas.toDataURL("image/png");

//       const chartWidth = 300;
//       const chartHeight = 200;
//       pdf.addImage(chartImage, "PNG", 20, 70 + paddingBottom, chartWidth, chartHeight);
//       pdf.addImage(secondChartImage, "PNG", 300, 70 + paddingBottom, chartWidth, chartHeight);

//       // Añadir título de la tabla
//       pdf.setFontSize(16);
//       const producedTitleY = 300 + 40;
//       pdf.text("Laminados Producidos", 40, producedTitleY);

//       // Renderizar la tabla usando autoTable
//       const tableData = data.map((row) => [
//         row.id_producto,
//         row.tipo_vidrio,
//         row.total_cantidad,
//         row.turno,
//         format(new Date(row.fecha), "dd/MM/yyyy"),
//       ]);

//       const tableHeaders = ["ID Producto", "Tipo de Vidrio", "Cantidad", "Turno", "Fecha"];
//       pdf.autoTable({
//         startY: producedTitleY + 20, // Coloca la tabla después del título
//         head: [tableHeaders],
//         body: tableData,
//         theme: "grid",
//         headStyles: { fillColor: [41, 128, 185] }, // Color de encabezado
//       });

//       // Esperar a que todo esté completamente renderizado
//       const finalY = pdf.lastAutoTable.finalY;

//       // *** Añadir "Total Producción" debajo de la tabla ***
//       const totalProduccion = data.reduce((acc, row) => acc + row.total_cantidad, 0); // Calcula el total
//       pdf.setFontSize(16);
//       pdf.text(`Total Producción: ${totalProduccion}`, 40, finalY + 20); // Ajusta la posición en función del final de la tabla

//       // Generar el blob para enviar al backend
//       const pdfBlob = pdf.output('blob');

//       // Preparar el archivo para enviar
//       const formData = new FormData();
//       formData.append("file", pdfBlob, "produccion.pdf");


//       // Enviar al backend
//       await PostPdf(formData);

//       alert("PDF generado y enviado con éxito.");
//     } catch (error) {
//       console.error("Error al generar el PDF:", error);
//       alert("Error al generar el PDF: " + error.message);
//     }
//   };

//   const loadImage = (src) => {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.src = src;
//       img.onload = () => resolve(img);
//     });
//   };

//   const groupAndSummarizeData = (data) => {
//     const groupedData = {};
//     data.forEach((item) => {
//       const turno =
//         item.id_horario === 3
//           ? "Primer Turno"
//           : item.id_horario === 4
//           ? "Segundo Turno"
//           : "Turno Desconocido";
//       const key = `${item.id_producto}-${turno}`;
//       if (!groupedData[key]) {
//         groupedData[key] = {
//           id_producto: item.id_producto,
//           tipo_vidrio: item.cod,
//           total_cantidad: 0,
//           turno: turno,
//           fecha: item.fecha,
//         };
//       }
//       groupedData[key].total_cantidad += parseInt(item.total_cantidad, 10) || 0;
//     });
//     return Object.values(groupedData);
//   };

//   const calcularTotalProducido = () => {
//     return data.reduce((acc, curr) => acc + curr.total_cantidad, 0);
//   };

//   return (
//     <Box m="10px">
//       <Header title="Producción del Día" subtitle="Clasificación de Laminados" />
//       <Box
//         m="10px"
//         sx={{
//           display: "flex",
//           justifyContent: "space-evenly",
//           alignItems: "center",
//           height: "100%",
//           width: "100%",
//           margin: "0",
//           boxSizing: "border-box",
//         }}
//       >
//         <Box height="45vh" width="45%" ref={chartRef}>
//           <PieChart />
//         </Box>
//         <Box height="45vh" width="45%" ref={secondChartRef} >
//           <ProduccionPie />
//         </Box>
//       </Box>
//       <Box
//         m="40px 0 0 0"
//         height="30vh"
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
//         }}
//       >
//         <DataGrid
//           rows={data}
//           getRowId={(row) => `${row.id_producto}-${row.turno}`}
//           columns={columns}
//           disableMultipleSelection
//         />
//       </Box>
      
//       <Box sx={{
//         display:"flex",
//         justifyContent:"space-between"
//       }}>
//         <Box
//           sx={{
//             fontFamily: "sans-serif",
//             fontSize: "20px",
//             marginTop: "10px",
//             zIndex: 100,
//           }}
//         >
//           Total Producido: {calcularTotalProducido()}
//         </Box>
//         <Box sx={{ paddingRight: "2%", paddingTop: "0.5%" }}>
//           <Button type="submit" color="secondary" variant="contained" onClick={handleGenerate}>
//             Generar Reporte
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Graficos;