import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getReporteInterfoliacion} from "../../services/reporteInterfoliacion.services";
import ModalProblemaLavadora from "../../modal/problema/modalProblemaLavadora";
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
import Modal from '@mui/material/Modal';
import  getUrlSocket from '../../utils/getUrlSocket';

const socket = io(getUrlSocket(), {
  transports: ['websocket', 'polling']
});

const ReporteviewInterView = () => {
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
      const response = await getReporteInterfoliacion(fechaSeleccionada);
      
      setData(response);
      setFilteredData(response);
    } catch (error) {
      console.error("Error al obtener los datos del backend:", error);
    }
  };

  useEffect(() => {
    fetchPrueba();
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


  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
    });
  };



    // const handleGenerate = async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    
    //   // Crear un nuevo documento PDF
    //   const pdf = new jsPDF("portrait", "pt", "a4");
    
    //   // Cargar el logo
    //   const logo = await loadImage('../assets/dracenaC.png');
    //   const logoWidth = 200;
    //   const logoHeight = 80;
    //   const spacing = 90;
    //   const paddingBottom = 30;
    //   const paddingTop = 30;
    
    //   // Agregar logo y título principal
    //   pdf.addImage(logo, 'PNG', 10, 10, logoWidth, logoHeight);
    //   pdf.setFontSize(20);
    //   pdf.text("Reporte Interfoliación", 10 + logoWidth + spacing, 30 + paddingTop);
    
    //   // Agregar subtítulo con fecha
    //   const currentDate = dayjs().format("DD/MM/YYYY HH:mm");
    //   pdf.setFontSize(12);
    //   pdf.text(`Generado el: ${currentDate}`, 10 + logoWidth + spacing, 50 + paddingTop);
    
    //   // Configurar datos para la tabla
    //   const tableColumnHeaders = [
    //     "ID",
    //     "SERIE",
    //     "DEFECTO",
    //     "OBS",
    //     "ESTADO",
    //     "FECHA",
    //   ];
    
    //   const tableRows = filteredData.map((item) => [
    //     item.id,
    //     item.serie || "",
    //     item.problema || "",
    //     item.obs || "",
    //     item.estado_problema || "",
    //     formatDate(item.create_at),
    //   ]);
    
    //   // Agregar tabla al PDF
    //   pdf.autoTable({
    //     head: [tableColumnHeaders],
    //     body: tableRows,
    //     startY: 50 + paddingTop + 50,
    //     theme: "striped",
    //     styles: { fontSize: 10 },
    //     headStyles: { fillColor: [140, 27, 13] },
    //   });
    
    //   // Descargar el PDF
    //   pdf.save(`Reporte_Interfoliacion_${currentDate.replace(/[/:]/g, "-")}.pdf`);
    // };

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
    { field: "serie", headerName: "SERIE", flex: 1 },
    { field: "problema", headerName: "DEFECTO", flex: 1 },
    { field: "obs", headerName: "OBS", flex: 1 },
    { field: "estado_problema", headerName: "ESTADO", flex: 1 },
    {
      field: "imagen",
      headerName: "Imágen",
      flex: 0.8,
      renderCell: (params) => (
        <img 
          // src={`data:image/jpeg;base64,${params.value}`} 
          src={`http://192.168.88.69:5003${params.value}`} 
          alt="Imagen" 
          style={{ width: "100px", height: "100px", objectFit: "cover", cursor: "pointer" }} 
          onClick={() => handleImageClick(`http://192.168.88.69:5003${params.value}`)}
        />
      )
    },
    {
      field: "create_at",
      headerName: "Fecha",
      flex: 0.7,
      valueGetter: (params) => formatDate(params.row.create_at),
    },
  //   { field: "turno", headerName: "Turno", flex: 0.6 },
  ];


  const handleGenerate = async () => {
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
    pdf.text("Reporte Interfoliación", 10 + logoWidth + spacing, 30 + paddingTop);
  
    // Agregar subtítulo con fecha
    const currentDate = dayjs().format("DD/MM/YYYY HH:mm");
    pdf.setFontSize(12);
    pdf.text(`Generado el: ${currentDate}`, 10 + logoWidth + spacing, 50 + paddingTop);
  
    let yPosition = 150; // Posición inicial de contenido
  
    // Recorrer los datos filtrados y agregar las imágenes con descripción
    for (const item of filteredData) {
      // Agregar descripción
      pdf.setFontSize(10);
      pdf.text(`ID: ${item.id}`, 50, yPosition);
      pdf.text(`Serie: ${item.serie || "N/A"}`, 50, yPosition + 15);
      pdf.text(`Defecto: ${item.problema || "N/A"}`, 50, yPosition + 30);
      pdf.text(`Observaciones: ${item.obs || "N/A"}`, 50, yPosition + 45);
      pdf.text(`Estado: ${item.estado_problema || "N/A"}`, 50, yPosition + 60);
      pdf.text(`Fecha: ${formatDate(item.create_at)}`, 50, yPosition + 75);
  
      // Cargar y agregar la imagen
      if (item.imagen) {
        const imgData = `data:image/jpeg;base64,${item.imagen}`;
        pdf.addImage(imgData, "JPEG", 350, yPosition - 10, 100, 100);
      }
  
      // Dibujar una línea divisoria
      pdf.setDrawColor(200, 200, 200);
      pdf.line(30, yPosition + 100, 550, yPosition + 100);
  
      // Aumentar la posición para la siguiente entrada
      yPosition += 120;
  
      // Si la posición excede el límite de la página, agregar una nueva página
      if (yPosition > 750) {
        pdf.addPage();
        yPosition = 50; // Reiniciar la posición en la nueva página
      }
    }
  
    // Descargar el PDF
    pdf.save(`Reporte_Interfoliacion_${currentDate.replace(/[/:]/g, "-")}.pdf`);
  };
  
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header
          title="Reportes"
          subtitle="Reportes Interfoliacion( Reportes del 15/01 en adelante)"
        />
        {/* <Box display="flex" alignItems="center">
        <Box
            sx={{
              marginRight: "2%",
              marginLeft: "2%",
              marginTop: "2.6%",
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
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            height={"40%"}
            width={"60%"}
            ml={1}
          >
           
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Buscar"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Box> */}

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
      <ModalProblema
        open={open}
        onClose={() => setOpen(false)}
        registro={selectedRegistro} // Mostrar los datos recibidos
      />

      <ModalImage
        open={Boolean(selectedImage)}
        onClose={handleCloseImageModal}
        imageSrc={selectedImage}
      />
      
    </Box>
  );
};

export default ReporteviewInterView;

