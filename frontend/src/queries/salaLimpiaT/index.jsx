// import React, { useState, useEffect } from "react";
// import { Box, useTheme, InputBase, IconButton, Button } from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { tokens } from "../../theme";
// import Header from "../../components/Header";
// import SearchIcon from "@mui/icons-material/Search";
// import ModalImage  from "../../modal/imagen/modalImagen";
// import ModalProblema from "../../modal/problema/modalProblemaStock"; 
// import io from 'socket.io-client';
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import useFechaSeleccionada from "../../customHooks/parseFechaHook";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { getDatosSala } from "../../services/salaLimpia.services";
// import ExcelJS from 'exceljs';

// const socket = io(getUrlSocket());



// const SalaLimpiaView = () => {
//   const [data, setData] = useState([]);
//   const [searchValue, setSearchValue] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [selectedRegistro, setSelectedRegistro] = useState(null); // Estado para el registro seleccionado
//   const [openModal, setOpenModal] = useState(false); // Estado para controlar el modal
//   const [open, setOpen] = useState(false);
//   const [startDate, setStartDate] = useState(dayjs());
//   const [registroLavadora, setRegistroLavadora] = useState(null);
//   const { fechaSeleccionada, setFechaSeleccionada } = useFechaSeleccionada();
//   const [selectedImage, setSelectedImage] = useState(null); // Estado para la imagen seleccionada

//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//     useEffect(() => {
//       // Escuchar notificaciones desde el backend y actualizar los datos
//       const handleNewData = () => {
//         console.log("📡 Nueva notificación recibida desde el servidor.");
//         fetchPrueba();
//       };
  
//       socket.on("newDataNotification", handleNewData);
  
//       return () => {
//         socket.off("newDataNotification", handleNewData);
//       };
//     }, []); // Se ejecuta solo al montar el componente


//   // Obtener datos de la vista al cargar el componente
//   const fetchPrueba = async () => {
//     try {
//       console.log("🚀 ~ fetchPrueba ~ fechaSeleccionada:", fechaSeleccionada)
//       const response = await getDatosSala(fechaSeleccionada);
//       console.log("🚀 ~ fetchPrueba ~ getDatosSala:", getDatosSala)
      
//       setData(response);
//       setFilteredData(response);
//     } catch (error) {
//       console.error("Error al obtener los datos del backend:", error);
//     }
//   };

//   // useEffect(() => {

//   //   fetchPrueba();
//   //   const intervalId = setInterval(fetchPrueba, 5000);

//   // return () => clearInterval(intervalId);
//   // }, [fechaSeleccionada]);

//   const handleSearchChange = (event) => {
//     const { value } = event.target;
//     setSearchValue(value);

//     if (Array.isArray(data)) {
//       const filtered = data.filter(
//         (item) =>
//           item.id.toString().includes(value) ||
//           item.serie_stock.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredData(filtered);
//     }
//   };




//   useEffect(() => {
//     if (startDate) {
//       const formattedDate = dayjs(startDate).format("DD/MM/YYYY");  // Formatear la fecha correctamente
//       setFechaSeleccionada(startDate);  // Pasar la fecha formateada al hook personalizado
//     }
//   }, [startDate]);




//   const formatDate = (dateString) => {
//     if (!dateString) return ""; // Si no hay fecha, retorna vacío

//     const date = new Date(dateString);

//     // Ajusta la fecha al huso horario local
//     const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

//     const day = String(localDate.getDate()).padStart(2, "0");
//     const month = String(localDate.getMonth() + 1).padStart(2, "0");
//     const year = String(localDate.getFullYear()).slice(-2);
//     const hours = String(localDate.getHours()).padStart(2, "0");
//     const minutes = String(localDate.getMinutes()).padStart(2, "0");

//     return `${day}/${month}/${year} ${hours}:${minutes}`;
// };


//   // Función para manejar doble clic en una fila
//   const handleRowDoubleClick = (params) => {
//     setSelectedRegistro(params.row); // Guarda el registro seleccionado
//     setOpen(true); // Abre el modal
//   };

//   // Función para cerrar el modal
//   // const handleCloseModal = () => {
//   //   setOpen(false);
//   //   fetchPrueba();
//   // };

//   const handleImageClick = (imageUrl) => {
//     setSelectedImage(imageUrl);
//   };

//   const handleCloseImageModal = () => {
//     setSelectedImage(null);
//   };

//   const columns = [
//     { field: "id", headerName: "ID", flex: 0.4 },
//     { field: "humedad_int", headerName: "HUMEDAD", flex: 1, cellClassName: "name-column--cell"},
//     { field: "temp_interna", headerName: "TEMPERATURA", flex: 1},
  
//     {
//       field: "create_at",
//       headerName: "Fecha",
//       flex: 0.7,
//       valueGetter: (params) => formatDate(params.row.create_at),
//       cellClassName: "name-column--cell"
//     },
//   //   { field: "turno", headerName: "Turno", flex: 0.6 },
//   ];


//   const handleExport = async () => {
//      const workbook = new ExcelJS.Workbook();
//      const worksheet = workbook.addWorksheet('Resumen');
   
//      // Definir las columnas con encabezados
//      worksheet.columns = [
//          { header: 'ID', key: 'id', width: 12 },
//          { header: 'Humedad', key: 'humedad_int', width: 20 },
//          { header: 'Temperatura', key: 'temp_interna', width: 20 },
//          { header: 'Fecha ', key: 'create_at', width: 25 },

//      ];
   
//      // Preparar los datos a exportar
//      const exportableData = filteredData.map((row) => {
//          const { id, humedad_int, temp_interna, create_at} = row;

 
//          return {
             
//              id: id,
//              humedad_int: humedad_int,
//              temp_interna: temp_interna,
//              create_at: formatDate(create_at), 
//          };
//      });
   
//      worksheet.addRows(exportableData);
   
//      // Aplicar estilos a las cabeceras
//      worksheet.getRow(1).eachCell((cell) => {
//          cell.font = { bold: true, color: { argb: 'FFFFFF' } };
//          cell.fill = {
//              type: 'pattern',
//              pattern: 'solid',
//              fgColor: { argb: '143f04' },
//          };
//          cell.border = {
//              top: { style: 'thin' },
//              left: { style: 'thin' },
//              bottom: { style: 'thin' },
//              right: { style: 'thin' },
//          };
//      });
   
//      // Aplicar bordes a todas las celdas con datos
//      worksheet.eachRow((row, rowNumber) => {
//          if (rowNumber !== 1) { // Saltar las cabeceras
//              row.eachCell((cell) => {
//                  cell.border = {
//                      top: { style: 'thin' },
//                      left: { style: 'thin' },
//                      bottom: { style: 'thin' },
//                      right: { style: 'thin' },
//                  };
//              });
//          }
//      });
   
//      // Exportar el archivo Excel
//      const buffer = await workbook.xlsx.writeBuffer();
//      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//      const link = document.createElement('a');
//      link.href = URL.createObjectURL(blob);
//      link.download = 'Resumen_Temperatura.xlsx';
//      link.click();
//    };
   
//   return (
//     <Box m="20px">
//       <Box display="flex" justifyContent="space-between" p={0}>
//         <Header title="AMBIENTE" subtitle="Historial De Registro de Ambiente" />

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             paddingRight: "50px",
//           }}
//         >
//           <Box sx={{ display: "flex" }}>
//             <Box
//               sx={{
//                 marginRight: "2%",
//                 marginLeft: "2%",
//                 marginTop: "2.6%",
//               }}
//             >
//               <Button
//                 sx={{
//                   background: "#143f04",
//                   width: "100%",
//                   height: "3rem!important",
//                   color: "white",
//                   borderRadius: "8px",
                  
//                   "&:hover": {
//                     background: "#459926", // Color de fondo cuando el botón está en hover
//                   },
//                 }}
//                 onClick={handleExport}
//                 variant="contained"
//                 color="primary"
//               >
//                 <img
//                   src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
//                   alt="Excel Icon"
//                   style={{ width: 29, height: 29, marginRight: 8 }}
//                 />
//                 Exportar
//               </Button>
//             </Box>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DemoContainer components={["DatePicker"]}>
//                 <DatePicker
//                   label="Filtrar Por Fecha"
//                   value={startDate}
//                   onChange={(newValue) => setStartDate(dayjs(newValue))} // Asegurarse de que newValue se pase correctamente como un objeto de dayjs
//                   format="DD/MM/YYYY"
//                 />
//                 {/* <DatePicker
//                 label="Fecha de Fin"
//                 value={endDate}
//                 onChange={(newValue) => setEndDate(dayjs(newValue))}
//                 format="DD/MM/YYYY"
//               /> */}
//               </DemoContainer>
//             </LocalizationProvider>
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
//         }}
//       >
//         <DataGrid
//           rows={filteredData}
//           columns={columns}
//           onRowDoubleClick={handleRowDoubleClick} // Abrir modal al hacer doble clic
//           components={{
//             Toolbar: GridToolbar,
//           }}
//         />
//       </Box>

//       {/* Modal que se abre cuando se reciben datos del socket */}
//       <ModalProblema
//         open={open}
//         onClose={() => setOpen(false)}
//         registro={selectedRegistro} // Mostrar los datos recibidos
//       />

//       <ModalImage
//         open={Boolean(selectedImage)}
//         onClose={handleCloseImageModal}
//         imageSrc={selectedImage}
//       />
//     </Box>
//   );
// };

// export default SalaLimpiaView;


import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import ModalImage  from "../../modal/imagen/modalImagen";
import ModalProblema from "../../modal/problema/modalProblemaStock"; 
import io from 'socket.io-client';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useFechaSeleccionada from "../../customHooks/parseFechaHook";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { getDatosSala } from "../../services/salaLimpia.services";
import ExcelJS from 'exceljs';

// const socket = io(getUrlSocket(), {
//   transports: ['websocket', 'polling']
// });

const SalaLimpiaView = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRegistro, setSelectedRegistro] = useState(null); // Estado para el registro seleccionado
  const [openModal, setOpenModal] = useState(false); // Estado para controlar el modal
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(dayjs());
  const [registroLavadora, setRegistroLavadora] = useState(null);
  const { fechaSeleccionada, setFechaSeleccionada } = useFechaSeleccionada();
  const [selectedImage, setSelectedImage] = useState(null); // Estado para la imagen seleccionada

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Obtener datos de la vista al cargar el componente
  const fetchPrueba = async () => {
    try {
      const response = await getDatosSala(fechaSeleccionada);
      // console.log("🚀 ~ fetchPrueba ~ response:", response)
      
      setData(response);
      setFilteredData(response);
    } catch (error) {
      console.error("Error al obtener los datos del backend:", error);
    }
  };

  useEffect(() => {

    fetchPrueba();
  //   const intervalId = setInterval(fetchPrueba, 5000);

  // return () => clearInterval(intervalId);
  }, [fechaSeleccionada]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    if (Array.isArray(data)) {
      const filtered = data.filter(
        (item) =>
          item.id.toString().includes(value) ||
          item.serie_stock.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };




  useEffect(() => {
    if (startDate) {
      const formattedDate = dayjs(startDate).format("DD/MM/YYYY");  // Formatear la fecha correctamente
      setFechaSeleccionada(startDate);  // Pasar la fecha formateada al hook personalizado
    }
  }, [startDate]);




  const formatDate = (dateString) => {
    if (!dateString) return ""; // Retorna una cadena vacía si dateString es undefined, null o vacío
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 0);

    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = String(localDate.getFullYear()).slice(-2);
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };


  // Función para manejar doble clic en una fila
  const handleRowDoubleClick = (params) => {
    setSelectedRegistro(params.row); // Guarda el registro seleccionado
    setOpen(true); // Abre el modal
  };

  // Función para cerrar el modal
  // const handleCloseModal = () => {
  //   setOpen(false);
  //   fetchPrueba();
  // };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.4 },
    { field: "humedad_int", headerName: "HUMEDAD", flex: 1, cellClassName: "name-column--cell"},
    { field: "temp_interna", headerName: "TEMPERATURA", flex: 1},
  
    {
      field: "create_at",
      headerName: "Fecha",
      flex: 0.7,
      valueGetter: (params) => formatDate(params.row.create_at),
      cellClassName: "name-column--cell"
    },
  //   { field: "turno", headerName: "Turno", flex: 0.6 },
  ];


  const handleExport = async () => {
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet('Resumen');
   
     // Definir las columnas con encabezados
     worksheet.columns = [
         { header: 'ID', key: 'id', width: 12 },
         { header: 'Humedad', key: 'humedad_int', width: 20 },
         { header: 'Temperatura', key: 'temp_interna', width: 20 },
         { header: 'Fecha ', key: 'create_at', width: 25 },

     ];
   
     // Preparar los datos a exportar
     const exportableData = filteredData.map((row) => {
         const { id, humedad_int, temp_interna, create_at} = row;

 
         return {
             
             id: id,
             humedad_int: humedad_int,
             temp_interna: temp_interna,
             create_at: formatDate(create_at), 
         };
     });
   
     worksheet.addRows(exportableData);
   
     // Aplicar estilos a las cabeceras
     worksheet.getRow(1).eachCell((cell) => {
         cell.font = { bold: true, color: { argb: 'FFFFFF' } };
         cell.fill = {
             type: 'pattern',
             pattern: 'solid',
             fgColor: { argb: '143f04' },
         };
         cell.border = {
             top: { style: 'thin' },
             left: { style: 'thin' },
             bottom: { style: 'thin' },
             right: { style: 'thin' },
         };
     });
   
     // Aplicar bordes a todas las celdas con datos
     worksheet.eachRow((row, rowNumber) => {
         if (rowNumber !== 1) { // Saltar las cabeceras
             row.eachCell((cell) => {
                 cell.border = {
                     top: { style: 'thin' },
                     left: { style: 'thin' },
                     bottom: { style: 'thin' },
                     right: { style: 'thin' },
                 };
             });
         }
     });
   
     // Exportar el archivo Excel
     const buffer = await workbook.xlsx.writeBuffer();
     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
     const link = document.createElement('a');
     link.href = URL.createObjectURL(blob);
     link.download = 'Resumen_Temperatura.xlsx';
     link.click();
   };
   
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="AMBIENTE" subtitle="Historial De Registro de Ambiente" />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: "50px",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                marginRight: "2%",
                marginLeft: "2%",
                marginTop: "2.6%",
              }}
            >
              <Button
                sx={{
                  background: "#143f04",
                  width: "100%",
                  height: "3rem!important",
                  color: "white",
                  borderRadius: "8px",
                  
                  "&:hover": {
                    background: "#459926", // Color de fondo cuando el botón está en hover
                  },
                }}
                onClick={handleExport}
                variant="contained"
                color="primary"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                  alt="Excel Icon"
                  style={{ width: 29, height: 29, marginRight: 8 }}
                />
                Exportar
              </Button>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Filtrar Por Fecha"
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
          </Box>
        </Box>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
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
          rows={filteredData}
          columns={columns}
          onRowDoubleClick={handleRowDoubleClick} // Abrir modal al hacer doble clic
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </Box>

      {/* Modal que se abre cuando se reciben datos del socket */}
      {/* <ModalProblema
        open={open}
        onClose={() => setOpen(false)}
        registro={selectedRegistro} // Mostrar los datos recibidos
      /> */}

      {/* <ModalImage
        open={Boolean(selectedImage)}
        onClose={handleCloseImageModal}
        imageSrc={selectedImage}
      /> */}
    </Box>
  );
};

export default SalaLimpiaView;

