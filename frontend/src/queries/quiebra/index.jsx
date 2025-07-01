import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton, Popper, Paper, ClickAwayListener, modalClasses } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import {  getStockV } from "../../services/reporteStock.services";
import { getOne, getOneDatos} from "../../services/stock.services";
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ModalEditInventario from "../../modal/stock/modalEntrada-Salida"; // Importar el modal de vista previa
import QRCode from 'qrcode';
import ModalPreview from "../../modal/modalPreview"; // Importar el modal de vista previa
import { getDatos } from "../../services/vehiculos.services";
import { getDatosQuiebra, getOneDatosTicket } from "../../services/quiebre.services";
import ModalRetallo from "../../modal/retallo/modalRetallo";
import dayjs from "dayjs";



const   QuiebraV = () => {
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
  const [openModalRetallo, setOpenModalRetallo] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  // Obtener datos de la vista al cargar el componente
  const fetchPrueba = async () => {
    try {
      const response = await getDatosQuiebra();
      setData(response);
      setFilteredData(response);
    } catch (error) {
      console.error("Error al obtener los datos del backend:", error);
    }
  };

  useEffect(() => {
    fetchPrueba();
  }, []);

  const handleDoubleRowClick = (params) => {
    setRegistro(params.row); // Guarda el registro seleccionado
    setOpenModalRetallo(true); // Abre el modal
    // id(registro.id);
    
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


  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget); // Asignar el menú ancla
    setSelectedRow(row); // Guardar la fila seleccionada
  };

  const handleSubMenuClick = (event) => {
    setSubMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };


  const handleEtiqueta = async () => {
    const { serie } = selectedRow;

    try {
      const response = await getOneDatos(serie);

      if (!response || typeof response !== "object") {
        console.error("Respuesta inesperada de getOneDatos:", response);
        return;
      }

      // Generar la etiqueta para el objeto response
      const fecha = new Date(response.create_at).toLocaleDateString("es-ES");
      const qrImageUrl = await QRCode.toDataURL(response.cod_interno, { errorCorrectionLevel: 'H' }).catch(error => {
        console.error('Error generando el QR:', error);
        return null; // Retorna null en caso de error
      });

      const etiqueta = `
        ^XA
        ^PW800
        ^LL1600

        ^FO350,40^A0N,50,50^FD${response.cod} ^FS
        ^FO350,250^A0N,50,50^FD${response.descripcion} ^FS

        ^FO350,850^A0N,50,50^FDCantidad:${response.cantidad_entrada} ^FS

        ^FO1900,580^BQN,2,8^FDQA,${qrImageUrl}^FS

        ^FO350,1050^A0N,50,50^FD${response.serie} ^FS

        ^FO350,1330^A0N,500,500^FD${fecha}^FS
        ^FO2050,1330^A0N,500,500^FD${response.cod_interno}^FS

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
    { field: "serie", headerName: "serie", flex: 1, cellClassName: "name-column--cell" },
    { field: "descripcion", headerName: "Producto", flex: 2 },
    { field: "cod_paquete", headerName: "Codigo Interno", flex: 1, cellClassName: "name-column--cell" },
    { field: "cantidad_retallo", headerName: "Cantidad Retallo", flex: 1 },
    { field: "descripcion_caballete", headerName: "Almacenamento", flex: 1, cellClassName: "name-column--cell" },
    {
      field: "create_at",
      headerName: "Fecha",
      flex: 1,
      valueGetter: (params) => formatDate(params.row.create_at),
    },
    { field: "motivo", headerName: "Motivo de Quebra", flex: 1.5, cellClassName: "name-column--cell" },
  ];

  // const handleMenuClick = (event, row) => {
  //   // setOpenModalRetallo(false);

  //   setAnchorEl(event.currentTarget);
  //   setSelectedRow(row);
    
  // };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchPrueba();
    handleMenuClose();
  }

  const handleCloseRetallo = () => {
    setOpenModalRetallo(false);
    // fetchPrueba();
    // handleMenuClose();
  }

  const handleClosePreview = () => {
    setPreviewData(""); // Limpiar los datos de vista previa al cerrar el modal
  };




  const handlePrint = async () => {
    if (!selectedRow || !selectedRow.id) {
      setErrorMessage('No se ha seleccionado ninguna fila.');
      return;
    }
    const { cod_interno } = selectedRow;

    try {
      const response = await getOne(cod_interno);

      // Si response no es un array, conviértelo en uno
      const items = Array.isArray(response) ? response : [response];

      const etiquetas = await Promise.all(items.map(async (item) => {
        const fecha = new Date(item.create_at).toLocaleDateString("es-ES");
        let zpl = `
        ^XA
        ^PW800
        ^LL400

        // Código en la parte superior, más grande
        ^FO85,40^A0N,30,30^FDNumero de Serie:${item.cod_interno} ^FS

        ^FO140,80^A0N,25,30^FD${fecha}^FS

        ^FO85,120^A0N,30,30^FDCant. Chapa:^FS
        ^FO140,160^A0N,30,30^FD${item.cantidad}^FS

        ^FO330,120^A0N,30,30^FDUtilizable:^FS
        ^FO380,160^A0N,30,30^FD${item.cantidad_entrada}^FS

        // ID Producción, fecha y serie
        //^FO85,220^A0N,30,30^FDProducto:^FS
        //^FO85,260^A0N,28,26^FD${item.descripcion}^FS

        // Código QR, más grande
        //^FO500,40^BQN,2,8^FDQA,${item.cod_interno}^FS

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

const handleReprint = async () => {
  getTicket(selectedRow.cod_interno)
}


  const getTicket = async (serie) => {

    // if (!selectedRow || !selectedRow.cod_interno) {
    //   setErrorMessage('No se ha seleccionado ninguna fila.');
    //   return;
    // }

    const response = await getOneDatosTicket(serie);
    if (response) {
      const {cod, descripcion, cod_interno, serie, create_at, cantidad_entrada } = response;
      const fecha = dayjs(create_at).format("DD/MM/YYYY hh:mm");
  
      const ticketData = {
        cod: cod,
        descripcion: descripcion,
        cantidad_entrada: cantidad_entrada,
        serie: serie,
        fecha: fecha,
        cod_interno: cod_interno,
  
      };
      // Call function to print ticket
      generateZPL(ticketData);
    } else {
      console.error("No se encontró el ticket con el ID proporcionado");
    }
  }
  
  const generateZPL = async (values) => {
      const qrImageUrl = await QRCode.toDataURL(values.serie, { errorCorrectionLevel: 'H' }).catch(error => {
      console.error('Error generando el QR:', error);
      return null; // Retorna null en caso de error
    });
    
    const formatText = (text, maxLength) => {
      const words = text.split(" ");
      let lines = [];
      let currentLine = "";
    
      for (let word of words) {
        if ((currentLine + word).length > maxLength) {
          lines.push(currentLine.trim());
          currentLine = word + " ";
        } else {
          currentLine += word + " ";
        }
      }
    
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }
    
      return lines;
    };
    
    // Dividir la descripción y el código en líneas
    const descripcionLines = formatText(values.descripcion, 48);
    const codLines = formatText(values.cod, 43);
    
    let zpl = `
      ^XA
      ^PW800        // Ancho de la etiqueta (400 puntos = 10 cm)
      ^LL400        // Longitud de la etiqueta (200 puntos = 5 cm)
    `;
    
    // Agregar las líneas del código (cod) al ZPL
    codLines.forEach((line, index) => {
      zpl += `^FO85,${40 + index * 30}^A0N,30,30^FD${line}^FS\n`;
    });
    
    // Agregar las líneas de descripción al ZPL
    descripcionLines.forEach((line, index) => {
      zpl += `^FO85,${85 + index * 30}^A0N,30,30^FD${line}^FS\n`;
    });
    
    zpl += `
      ^FO85,${80 + descripcionLines.length * 30 + 30}^A0N,30,30^FDCantidad: ${values.cantidad_entrada}^FS
      ^FO85,${100 + descripcionLines.length * 30 + 60}^A0N,30,30^FD${values.serie}^FS
    
      // Código QR, más grande
      //^FO580,150^BQN,2,8^FDQA,${values.cod_interno}^FS
    
      ^FO085,350^A0N,30,35^FD${values.fecha}^FS
      ^FO580,350^A0N,30,35^FD${values.cod_interno}^FS
      ^XZ
    `;
    
    
  
  
    if (window.BrowserPrint) { // Asegúrate de que BrowserPrint está disponible
      window.BrowserPrint.getDefaultDevice("printer", 
      (device) => {
          if (device) {
          setPrinterInfo(`Dispositivo predeterminado encontrado: ${device.name}`);
          let zplCommand = zpl;
  
          // 3. Usar la función send para enviar los datos al dispositivo
          device.send(zplCommand, function(response) {
              console.log("Datos enviados exitosamente:", response);

          // setSelectedRow(null)

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


  
  };
  // const handleClosePreview = () => {
  //   setPreviewData(""); // Limpiar los datos de vista previa al cerrar el modal
  // };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header
          title="CONSULTA QUIEBRA"
          subtitle="Productos Quebrados"
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
          onRowDoubleClick={handleDoubleRowClick} // Abrir modal al hacer doble clic
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

        <MenuItem onClick={handleReprint}>Imprimir</MenuItem>
        <MenuItem onClick={handleEtiqueta}>Visualizar</MenuItem>

      </Menu>

      </Box>

      <ModalEditInventario
        open={openModal}
        onClose={handleCloseModal}
        onSelectClient={selectedRow} // Mostrar los datos recibidos
      />

      <ModalRetallo
        open={openModalRetallo}
        onClose={handleCloseRetallo}
        onSelectClient={selectedRow} // Mostrar los datos recibidos
        id={registro?.id}
        
      />
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

export default QuiebraV;

