import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
// import { getVistaDescarga } from "../../services/reporteDescarga.services";
import { updateRegistro, } from "../../services/reporteStock.services";
import { getLiberarStock, getVerifyStock, getVerifyStockPVB} from "../../services/stock.services";
import {getDatosCaballete, getOneDatosCaballete} from "../../services/caballete.services";
import SendIcon from '@mui/icons-material/Send';
import ModalCharge from "../../modal/modalCharge";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ModalPreview from "../../modal/modalPreview"; // Importar el modal de vista previa
import QRCode from 'qrcode'

const StockCaballete = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = useState(false);
  const [registro, setRegistro] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [previewData, setPreviewData] = useState(""); // Estado para guardar los datos de vista previa
  const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState(''); // Estado para guardar posibles errores

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Obtener datos de la vista al cargar el componente
  const fetchPrueba = async () => {
    try {
      const response = await getDatosCaballete();
      setData(response);
      setFilteredData(response);
    } catch (error) {
      console.error("Error al obtener los datos del backend:", error);
    }
  };

  useEffect(() => {
    fetchPrueba();
  }, []);

  const handleRowClick = (params) => {
    setRegistro(params.row); // Guarda el registro seleccionado
    setOpen(true); // Abre el modal
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    if (Array.isArray(data)) {
      const filtered = data.filter(
        (item) =>
          item.id.toString().includes(value) ||
          item.codigo.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return '';

    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = String(parsedDate.getFullYear()).slice(-2);
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };


  const columns = [
    {
      field: "menu",
      headerName: "",
      flex: 0.2,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleMenuClick(event, params.row)}>
          <MenuIcon />
        </IconButton>
      ),
    },
    { field: "id", headerName: "ID", flex: 0.4 },
    { field: "codigo", headerName: "Proveedor", flex: 1 },
    { field: "descripcion", headerName: "Nota Fiscal", flex: 1 },
    { field: "estado", headerName: "Operacion", flex: 1 },
    // { field: "vehiculo", headerName: "Vehiculo", flex: 1 },
    // { field: "id_producto", headerName: "Producto", flex: 1 },
    // { field: "cantidad", headerName: "Cantidad", flex: 1 },
    // {
    //   field: "fecha",
    //   headerName: "Fecha",
    //   flex: 1,
    //   valueGetter: (params) => formatDate(params.row.fecha),
    // },
    // {
    //   field: "acciones",
    //   headerName: "Liberar",
    //   flex: 1,
    //   renderCell: (params) => (
    //     <IconButton onClick={() => handleButtonClick(params.row)}>
    //       <SendIcon />
    //     </IconButton>
    //   ),
    // },
  ];

const handleButtonClick = async (id) => {
  setIsLoading(true);
  const datos = {
    status_active:1
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const responspe = await updateRegistro(id.id, datos, id.id_producto);
    toast.success(`Nota: ${id.numeroNota} liberado`, {
      position: "top-center",
      autoClose: 3000, // Tiempo de cierre automático
      hideProgressBar: true, // Oculta la barra de progreso
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    fetchPrueba();
  } catch (error) {
    console.error("Error al enviar los datos", error);
    setIsLoading(false);
    setRegistrationError(true);
    setError(error.message);
  } finally {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }
}

const handleMenuClick = (event, row) => {
  setAnchorEl(event.currentTarget);
  setSelectedRow(row);
};

const handleMenuClose = () => {
  setAnchorEl(null);
  setSelectedRow(null);
};



const handlePrint = async () => {
  if (!selectedRow || !selectedRow.id) {
    setErrorMessage('No se ha seleccionado ninguna fila.');
    return;
  }
  console.log("🚀 ~ handlePrint ~ selectedRow:", selectedRow)

  const { id } = selectedRow;

  try {
    const response = await getOneDatosCaballete(id);
    
    // Si response no es un array, conviértelo en uno
    const items = Array.isArray(response) ? response : [response];
    const etiquetas = await Promise.all(items.map(async (item) => {
      const fecha = new Date(item.create_at).toLocaleDateString("es-ES");
    
      // Agregar cinco ceros antes del ID
      const idConCeros = `00000${item.id}`;
    
      // let zpl = `
      // ^XA
      //   ^PW800
      //   ^LL400
    
      //   // Código en la parte superior, más grande
      //   ^FO85,40^A0N,40,40^FD${item.codigo}^FS
    
      //   ^FO85,80^A0N,30,40^FD${item.descripcion} ^FS
    
      //   ^FO85,280^A0N,28,26^FD${fecha}^FS
    
      //   // Código QR, más grande
      //   ^FO350,15^BQN,2,8^FDQA,${item.id}^FS
    
      //   ^BY2,2,170
      //   ^FO600,80^BCB,140,Y,N^FD${idConCeros}^FS
      // ^XZ
      // `;

      const zpl = `
      ^XA
        ^PW800
        ^LL400
        ^LT0,0  // Asegura que el origen esté alineado en todas las impresoras

        ^FO85,40^A0N,40,40^FD${item.codigo}^FS
        ^FO85,80^A0N,30,40^FD${item.descripcion} ^FS
        ^FO85,280^A0N,28,26^FD${fecha}^FS

        // Código QR, intenta usar valores absolutos para estandarizar la posición
        ^FO350,40^BQN,2,8^FDQA,${item.id}^FS

        ^BY2,2,170
        ^FO600,80^BCB,140,Y,N^FD${idConCeros}^FS
      ^XZ
      `;
    
      return zpl;
    }));
    
    

    if (window.BrowserPrint) { // Asegúrate de que BrowserPrint está disponible

      window.BrowserPrint.getDefaultDevice("printer", 
        (device) => {
          if (device) {
            setPrinterInfo(`Dispositivo predeterminado encontrado: ${device.name}`);
            let zplCommand = etiquetas.join("\n");
            console.log("🚀 ~ handlePrint ~ zplCommand:", zplCommand)

            device.send(zplCommand, function(response) {
              console.log("Datos enviados exitosamente:", response);
            }, function(error) {
              console.error("Error al enviar datos:", error);
            });
          } else {
            setPrinterInfo("No hay una impresora predeterminada configurada.");
          }
        },
        (error) => {
          setErrorMessage(`Error al obtener el dispositivo predeterminado: ${error}`);
        }
      );
    } else {
      setErrorMessage('BrowserPrint no está disponible.');
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    setErrorMessage('Error al obtener los datos.');
  }

  handleMenuClose();
};

const handleView = async () => {
  const { id } = selectedRow;
  console.log("🚀 ~ handleView ~ selectedRow:", selectedRow)
  
  try {
    const response = await getOneDatosCaballete(id);

    if (!response || typeof response !== "object") {
      console.error("Respuesta inesperada de getOneDatos:", response);
      return;
    }

    // Generar la etiqueta para el objeto response
    const fecha = new Date(response.create_at).toLocaleDateString("es-ES");
    const qrImageUrl = await QRCode.toDataURL(String(response.id), { errorCorrectionLevel: 'H' }).catch(error => {
      console.error('Error generando el QR:', error);
      return null; // Retorna null en caso de error
    });

    const etiqueta = `
      ^XA
      ^PW800
      ^LL1600

      ^FO350,310^A0N,80,80^FD${response.codigo} ^FS
      ^FO350,450^A0N,60,60^FD${response.descripcion} ^FS

      ^FO1650,400^BQN,2,8^FDQA,${qrImageUrl}^FS

      ^FO350,1150^A0N,500,500^FD${fecha}^FS
      ^FO2000,1150^A0N,500,500^FD${response.id}^FS

      ^XZ
    `;
    setPreviewData(etiqueta); // Guardar los datos en el estado de vista previa
    handleMenuClose();
  } catch (error) {
    console.error("Error en handleEtiqueta:", error);
  }
};


const handleClosePreview = () => {
  setPreviewData(""); // Limpiar los datos de vista previa al cerrar el modal
};

const handleCloseModal = () => {
  setRegistrationSuccess(false);
};

const handleCloseModalError = () => {
  setRegistrationError(false);
};

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header
          title="Stock Caballete"
          subtitle="Caballetes"
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
          onRowClick={handleRowClick} // Abrir modal al hacer doble clic
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePrint}>Imprimir</MenuItem>
        <MenuItem onClick={handleView}>Visualizar</MenuItem>
      </Menu>
      <ModalCharge isLoading={isLoading} />

      {isLoading && <LoadingSpinner />}
      {registrationSuccess && (
        <ModalSucces open={registrationSuccess} onClose={handleCloseModal} />
      )}
      {registrationError && (
        <ModalError
          open={registrationError}
          onClose={handleCloseModalError}
          error={error}
        />
      )}
      {previewData && (
        <ModalPreview
          open={Boolean(previewData)}
          onClose={handleClosePreview}
          data={previewData}
        />
      )}
      {/* <ModalProblema
        open={open}
        onClose={() => setOpen(false)}
        registro={registro} // Mostrar los datos recibidos
        //  sector="lavadora"
      /> */}
    </Box>
  );
};

export default StockCaballete;
