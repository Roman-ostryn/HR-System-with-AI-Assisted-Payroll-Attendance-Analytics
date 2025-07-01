import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton, Popper, Paper, ClickAwayListener } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getOne, getOneDatos, getStockPvb} from "../../services/stock.services";
import {getOnePvb} from "../../services/pvb.services";
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ModalEditInventario from "../../modal/stock/modalEntrada-Salida"; // Importar el modal de vista previa
import QRCode from 'qrcode';
import ModalPreview from "../../modal/modalPreview"; // Importar el modal de vista previa


const StockPVB = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [registro, setRegistro] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [previewData, setPreviewData] = useState(""); // Estado para guardar los datos de vista previa
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState(''); 

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Obtener datos de la vista al cargar el componente
  const fetchPrueba = async () => {
    try {
      const response = await getStockPvb();
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
    // setRegistro(params.row); // Guarda el registro seleccionado
    setOpen(true); // Abre el modal
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    if (Array.isArray(data)) {
      const filtered = data.filter(
        (item) =>
          item.id.toString().includes(value) ||
          item.serie.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };


  // const handleMenuClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleSubMenuClick = (event) => {
    setSubMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };


  const handleEtiqueta = async () => {
    const { cod_interno } = selectedRow;
  
    try {
      const item = await getOnePvb(cod_interno);
  
      if (!item || typeof item !== "object") {
        console.error("Respuesta inesperada de getOneDatos:", item);
        return;
      }
  
      // Generar la etiqueta para el objeto item
      const fecha = new Date(item.create_at).toLocaleDateString("es-ES");
      const qrImageUrl = await QRCode.toDataURL(item.cod_interno, { errorCorrectionLevel: 'H' }).catch(error => {
        console.error('Error generando el QR:', error);
        return null; // Retorna null en caso de error
      });
  
      const etiqueta = `
        ^XA
        ^PW800
        ^LL1600
  
        ^FO350,40^A0N,50,50^FD${selectedRow.cod} ^FS
        ^FO350,250^A0N,50,50^FD${selectedRow.descripcion} ^FS
  
        ^FO350,750^A0N,50,50^FD${selectedRow.alto} ^FS
        ^FO750,750^A0N,50,50^FD${selectedRow.largo} ^FS
  
        ^FO1650,400^BQN,2,8^FDQA,${qrImageUrl}^FS
  
        ^FO550,950^A0N,50,50^FD${item.serie} ^FS
  
        ^FO350,1150^A0N,500,500^FD${fecha}^FS
        ^FO1770,1150^A0N,500,500^FD${item.cod_interno}^FS
  
        ^XZ
      `;
      setPreviewData(etiqueta); // Guardar los datos en el estado de vista previa
      handleMenuClose();
    } catch (error) {
      console.error("Error en handleEtiqueta:", error);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

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
    { field: "serie", headerName: "Serie Fabrica", flex: 1 },
    { field: "cod", headerName: "Producto", flex: 1 ,cellClassName: "name-column--cell"},
    { field: "cod_interno", headerName: "Codigo Interno", flex: 1 },
    // { field: "descripcion", headerName: "Descripcion", flex: 1 },
    { field: "alto", headerName: "Alto", flex: 1,valueFormatter: (params) => `${params.value} mm`,cellClassName: "name-column--cell" },
    { field: "largo", headerName: "Largo", flex: 1,valueFormatter: (params) => `${params.value} mm`,cellClassName: "name-column--cell" },
    { field: "id_notafiscal", headerName: "Nota Fiscal", flex: 1 },
    {
      field: "create_at",
      headerName: "Fecha",
      flex: 1,
      valueGetter: (params) => formatDate(params.row.create_at),
    },
  ];

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchPrueba();
    handleMenuClose();
  }

  const handleClosePreview = () => {
    setPreviewData(""); // Limpiar los datos de vista previa al cerrar el modal
  };

  
  const handleEntrada = async () => {
    setOpenModal(true);
    setRegistro("entrada");
  };

  const handleSalida = async () => {
    setOpenModal(true);
    setRegistro("salida");
  };


  const handlePrint = async () => {
    if (!selectedRow || !selectedRow.id) {
      setErrorMessage('No se ha seleccionado ninguna fila.');
      return;
    }
    const { cod_interno } = selectedRow;
  
    try {
      const response = await getOnePvb(cod_interno);
      
      // Si response no es un array, conviértelo en uno
      const items = Array.isArray(response) ? response : [response];
      
      const etiquetas = await Promise.all(items.map(async (item) => {
        const fecha = new Date(item.create_at).toLocaleDateString("es-ES");
        let zpl = `
           ^XA
          ^PW800
          ^LL400
  
          // Código en la parte superior, más grande
          ^FO85,40^A0N,30,30^FD${selectedRow.cod} ARQ^FS
  
          ^FO85,80^A0N,25,30^FD${selectedRow.descripcion} ^FS
  
          ^FO140,160^A0N,30,30^FD${selectedRow.alto}^FS

          ^FO240,160^A0N,30,30^FD${selectedRow.largo} ^FS
  
          ^FO85,220^A0N,30,30^FD${item.serie} ^FS
          ^FO85,280^A0N,28,26^FD${fecha}^FS
  
          // Código QR, más grande
          ^FO350,5^BQN,2,8^FDQA,${item.cod_interno}^FS

          ^BY2,2,170
          ^FO580,60^BCB,140,Y,N^FD${item.cod_interno}^FS
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


  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header
          title="Stock PVB"
          subtitle="Disponibilidad Stock"
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
        height="80vh"
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
      <Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {/* <MenuItem onClick={handleEntrada}>Entrada Inventario</MenuItem>
        <MenuItem onClick={handleSalida}>Salida Inventario</MenuItem> */}
        <MenuItem onClick={handlePrint}>Imprimir</MenuItem>
        <MenuItem onClick={handleEtiqueta}>Visualizar</MenuItem>

      </Menu>
      
      </Box>

      {/* <ModalEditInventario
        open={openModal}
        onClose={handleCloseModal}
        onSelectClient={selectedRow} // Mostrar los datos recibidos
        registro={registro}
      /> */}

      {previewData && (
        <ModalPreview
          open={Boolean(previewData)}
          onClose={handleClosePreview}
          data={previewData}
        />
      )}
    </Box>
  );
};

export default StockPVB;

