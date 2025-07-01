import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getVistaLavadoraSL } from "../../services/reporteLavadora.services";
import ModalProblemaLavadora from "../../modal/problema/modalProblemaLavadora";
import ModalProblema from "../../modal/problema/modalProblema"; // Importa el modal
import io from 'socket.io-client';
import ModalImage  from "../../modal/imagen/modalImagen";
import getUrlSocket from '../../utils/getUrlSocket';


const socket = io(getUrlSocket(), {
  transports: ['websocket', 'polling']
});

const LavadoraCalandraView = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRegistro, setSelectedRegistro] = useState(null); // Estado para el registro seleccionado
  const [openModal, setOpenModal] = useState(false); // Estado para controlar el modal
  const [open, setOpen] = useState(false);
  const [registroLavadora, setRegistroLavadora] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Estado para la imagen seleccionada


  // Escuchar el evento de Socket para mostrar el modal
  useEffect(() => {
    socket.on('mostrar_modal_sala_limpia', (data) => {
      console.log('Datos recibidos desde el Socket:', data);
      setRegistroLavadora(data); // Guarda los datos en el estado
      setOpen(true); // Abre el modal cuando se reciben datos
      fetchPrueba();
    });

    return () => {
      socket.off('mostrar_modal_sala_limpia');
    };
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Obtener datos de la vista al cargar el componente
  const fetchPrueba = async () => {
    try {
      const response = await getVistaLavadoraSL();
      
      setData(response);
      setFilteredData(response);
    } catch (error) {
      console.error("Error al obtener los datos del backend:", error);
    }
  };

  useEffect(() => {
    fetchPrueba();
  }, []);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Función para manejar doble clic en una fila
  const handleRowDoubleClick = (params) => {
    setSelectedRegistro(params.row); // Guarda el registro seleccionado
    setOpenModal(true); // Abre el modal
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
    fetchPrueba();
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };


  const columns = [
    { field: "serie_stock", headerName: "SERIE", flex: 0.5 },
    { field: "orden_produccion", headerName: "ORDEN DE PRODUCCION", flex: 0.7 },
    { field: "cod", headerName: "PRODUCTO", flex: 1.3 },
    { field: "problema", headerName: "PROBLEMA", flex: 1 },
    { field: "problemaanterior", headerName: "Llego asi?", flex: 0.4 },
    { field: "obs", headerName: "Observaciones", flex: 1 },
    {
      field: "imagenes",
      headerName: "Imágenes",
      flex: 0.5,
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
      field: "fecha",
      headerName: "Fecha",
      flex: 0.7,
      valueGetter: (params) => formatDate(params.row.fecha),
    },
    { field: "turno", headerName: "Turno", flex: 0.6 },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header
          title="Reportes"
          subtitle="Problemas Lavadora-Cargadora -> Sala Limpia"
        />
        <Box display="flex" alignItems="center">
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

      {/* Modal para problemas de lavadora */}
      <ModalProblemaLavadora
        open={openModal}
        onClose={handleCloseModal}
        registro={selectedRegistro}
      />

      {/* Modal que se abre cuando se reciben datos del socket */}
      <ModalProblema
        open={open}
        onClose={() => setOpen(false)}
        registro={registroLavadora} // Mostrar los datos recibidos
      />

      <ModalImage
        open={Boolean(selectedImage)}
        onClose={handleCloseImageModal}
        imageSrc={selectedImage}
      />
    </Box>
  );
};

export default LavadoraCalandraView;

