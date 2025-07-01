import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
// import { getVistaDescarga } from "../../services/reporteDescarga.services";
import { updateRegistro, } from "../../services/reporteStock.services";
import { getLiberarStock, getVerifyStock, getVerifyStockPVB} from "../../services/stock.services";
import {putEntradaNotaFiscal, getOneNota} from "../../services/entradaNotaFiscal.services";
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
import EntradaNotaFiscal from "../../modal/notafiscal/modalNotaFiscal";
import { set } from "date-fns";


const Stock = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openNota, setOpenNota] = useState(false);
  const [registro, setRegistro] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [dataNota, setDataNota] = useState([]);
  const [dataStock, setDataStock] = useState([]);

  const [menuPosition, setMenuPosition] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [previewData, setPreviewData] = useState(""); // Estado para guardar los datos de vista previa
  const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState(''); // Estado para guardar posibles errores

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Obtener datos de la vista al cargar el componente
  const fetchPrueba = async () => {
    try {
      const response = await getLiberarStock();
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
          item.cod.toLowerCase().includes(value.toLowerCase())
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
    { field: "proveedor", headerName: "Proveedor", flex: 1 },
    { field: "numeroNota", headerName: "Nota Fiscal", flex: 1 },
    // { field: "operacion", headerName: "Operacion", flex: 1 },
    { field: "vehiculo", headerName: "Vehiculo", flex: 1 },
    { field: "id_producto", headerName: "Producto", flex: 1 },
    { field: "cantidad", headerName: "Cantidad", flex: 1 },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      valueGetter: (params) => formatDate(params.row.fecha),
    },
    {
      field: "acciones",
      headerName: "Liberar",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleButtonClick(params.row)}>
          <SendIcon />
        </IconButton>
      ),
    },
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

// const handleMenuClick = (event, row) => {
//   setAnchorEl(event?.currentTarget);
//   setSelectedRow(row);
// };

// const handleMenuClose = () => {
//   setAnchorEl(null);
//   setSelectedRow(null);
// };



const handleMenuClick = (event, row) => {
  // console.log("🚀 ~ handleMenuClick ~ row:", row)
  event.preventDefault(); // importante en algunos casos
  setMenuPosition({
    top: event.clientY,
    left: event.clientX,
  });
  setSelectedRow(row);
};

const handleMenuClose = () => {
  setMenuPosition(null);
  setSelectedRow(null);
};

const formatText = (text, maxLength) => {
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  words.forEach((word) => {
    console.log("🚀 ~ words.forEach ~ word:", word)
    if ((currentLine + word).length > maxLength) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
};


const handlePrint = async () => {
  if (!selectedRow || !selectedRow.id) {
    setErrorMessage('No se ha seleccionado ninguna fila.');
    return;
  }
  const { id, id_producto } = selectedRow;

  try {
    if(id_producto=="PVB"){
      const response = await getVerifyStockPVB(id);
      const etiquetas = await Promise.all(response.map(async (item) => {
        const fecha = new Date(item.create_at).toLocaleDateString("es-ES");
        let zpl = `
         ^XA
          ^PW800
          ^LL400

          // Código en la parte superior, más grande
          ^FO85,40^A0N,30,30^FD${item.cod} ARQ^FS

          ^FO85,80^A0N,25,30^FD${item.descripcion} ^FS

          ^FO140,160^A0N,30,30^FD${item.alto}^FS

          ^FO240,160^A0N,30,30^FD${item.largo} ^FS

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
    }else{
    const response = await getVerifyStock(id);

    const etiquetas = await Promise.all(response.map(async (item) => {
      const fecha = new Date(item.create_at).toLocaleDateString("es-ES");
      // let zpl = `
      //   ^XA
      //   ^PW800
      //   ^LL400

      //   // Código en la parte superior, más grande
      //   ^FO85,40^A0N,30,30^FDNumero de Serie:${item.cod_interno} ^FS

      //   ^FO140,80^A0N,25,30^FD${fecha}^FS

      //   ^FO85,120^A0N,30,30^FDCant. Chapa:^FS
      //   ^FO140,160^A0N,30,30^FD${item.cantidad}^FS

      //   ^FO330,120^A0N,30,30^FDUtilizable:^FS
      //   ^FO380,160^A0N,30,30^FD${item.cantidad_entrada}^FS

      //   // ID Producción, fecha y serie
      //   ^FO85,220^A0N,25,30^FDFABRICA: ${item.serie}^FS
      //   ^FO85,260^A0N,30,30^FD${item.cod}^FS
      //   //^FO85,300^A0N,28,26^FD${item.descripcion}^FS

      //   // Código QR, más grande
      //   //^FO500,40^BQN,2,8^FDQA,${item.cod_interno}^FS

      //   ^XZ
      // `;

const descripcionLines = formatText(item.descripcion, 40); // o 40 según el tamaño de letra

function generarBloqueDescripcion(startY, x, fontSizeY = 28, fontSizeX = 28, lineSpacing = 40) {
  return descripcionLines.map((line, index) => {
    const y = startY - (index * lineSpacing);
    return `^FO${y},${x}^A0R,${fontSizeY},${fontSizeX}^FD${line}^FS`;
  }).join('\n');
}
const bloqueDescripcion1 = generarBloqueDescripcion(300, 50);
const bloqueDescripcion2 = generarBloqueDescripcion(300, 800);
const bloqueDescripcion3 = generarBloqueDescripcion(300, 1600);


let zpl = `
    ^XA
^POI
^PW820
^LL2420

^FO700,50^A0R,30,30^FDNumero de Serie:${item.cod_interno}^FS
^FO650,50^A0R,25,30^FD${fecha}^FS

^FO580,50^A0R,30,30^FDCant. Chapa:^FS
^FO520,90^A0R,30,30^FD${item.cantidad}^FS

^FO580,300^A0R,30,30^FDUtilizable:^FS
^FO520,330^A0R,30,30^FD${item.cantidad_entrada}^FS

^FO420,50^A0R,25,30^FDFABRICA:${item.serie}^FS
^FO370,50^A0R,30,30^FD${item.cod}^FS

${bloqueDescripcion1}


^FO500,500^BQN,2,8^FDQA,${item.cod_interno}^FS
^FO100,740^GB700,3,3,B,0^FS

^FO700,800^A0R,30,30^FDNumero de Serie:${item.cod_interno}^FS
^FO650,830^A0R,25,30^FD${fecha}^FS

^FO580,800^A0R,30,30^FDCant. Chapa:^FS
^FO520,850^A0R,30,30^FD${item.cantidad}^FS

^FO580,1080^A0R,30,30^FDUtilizable:^FS
^FO520,1110^A0R,30,30^FD${item.cantidad_entrada}^FS

^FO420,800^A0R,25,30^FDFABRICA:${item.serie}^FS
^FO370,800^A0R,30,30^FD${item.cod}^FS

${bloqueDescripcion2}

^FO500,1350^BQN,2,8^FDQA,${item.cod_interno}^FS
^FO100,1550^GB700,3,3,B,0^FS

^FO700,1600^A0R,30,30^FDNumero de Serie:${item.cod_interno}^FS
^FO650,1630^A0R,25,30^FD${fecha}^FS

^FO580,1600^A0R,30,30^FDCant. Chapa:^FS
^FO520,1650^A0R,30,30^FD${item.cantidad}^FS

^FO580,1880^A0R,30,30^FDUtilizable:^FS
^FO520,1910^A0R,30,30^FD${item.cantidad_entrada}^FS

^FO420,1600^A0R,25,30^FDFABRICA:${item.serie}^FS
^FO370,1600^A0R,30,30^FD${item.cod}^FS
${bloqueDescripcion3}
^FO500,2150^BQN,2,8^FDQA,${item.cod_interno}^FS

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
    }}
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    setErrorMessage('Error al obtener los datos.');
  }

  handleMenuClose();
};

const handlePrint5cm = async () => {
  if (!selectedRow || !selectedRow.id) {
    setErrorMessage('No se ha seleccionado ninguna fila.');
    return;
  }
  const { id, id_producto } = selectedRow;

  try {
    if(id_producto=="PVB"){
      const response = await getVerifyStockPVB(id);
      const etiquetas = await Promise.all(response.map(async (item) => {
        const fecha = new Date(item.create_at).toLocaleDateString("es-ES");
        let zpl = `
         ^XA
          ^PW800
          ^LL400

          // Código en la parte superior, más grande
          ^FO85,40^A0N,30,30^FD${item.cod} ARQ^FS

          ^FO85,80^A0N,25,30^FD${item.descripcion} ^FS

          ^FO140,160^A0N,30,30^FD${item.alto}^FS

          ^FO240,160^A0N,30,30^FD${item.largo} ^FS

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
    }else{
    const response = await getVerifyStock(id);

    const etiquetas = await Promise.all(response.map(async (item) => {
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
        ^FO85,220^A0N,25,30^FDFABRICA: ${item.serie}^FS
        ^FO85,260^A0N,30,30^FD${item.cod}^FS
        //^FO85,300^A0N,28,26^FD${item.descripcion}^FS

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
    }}
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    setErrorMessage('Error al obtener los datos.');
  }

  handleMenuClose();
};

const handleView = async () => {
  const { id, id_producto } = selectedRow;
  if(id_producto=="PVB"){
    const response = await getVerifyStockPVB(id);
    const etiquetas = await Promise.all(response.map(async (item) => {
      const fecha = new Date(item.create_at).toLocaleDateString("es-ES");
      const qrImageUrl = await QRCode.toDataURL(item.cod_interno, { errorCorrectionLevel: 'H' }).catch(error => {
        console.error('Error generando el QR:', error);
        return null; // Retorna null en caso de error
      });

      return `
      ^XA
        ^PW800
        ^LL1600

        ^FO350,40^A0N,50,50^FD${item.cod} ^FS
        ^FO350,250^A0N,50,50^FD${item.descripcion} ^FS

        ^FO350,750^A0N,50,50^FD${item.alto} ^FS
        ^FO750,750^A0N,50,50^FD${item.largo} ^FS

        ^FO1650,400^BQN,2,8^FDQA,${qrImageUrl}^FS

        ^FO550,950^A0N,50,50^FD${item.serie} ^FS

        ^FO350,1150^A0N,500,500^FD${fecha}^FS
        ^FO1770,1150^A0N,500,500^FD${item.cod_interno}^FS

        ^XZ
      `;
    }));

    setPreviewData(etiquetas.join("\n")); // Guardar los datos en el estado de vista previa
    handleMenuClose();
  }else{
    const response = await getVerifyStock(id);

    const etiquetas = await Promise.all(response.map(async (item) => {
    const fecha = new Date(item.create_at).toLocaleDateString("es-ES");
    const qrImageUrl = await QRCode.toDataURL(item.cod_interno, { errorCorrectionLevel: 'H' }).catch(error => {
      console.error('Error generando el QR:', error);
      return null; // Retorna null en caso de error
    });

    return `
    ^XA
      ^PW800
      ^LL1600

      ^FO350,40^A0N,50,50^FD${item.cod} ^FS
      ^FO350,250^A0N,50,50^FD${item.descripcion} ^FS

      ^FO350,750^A0N,50,50^FDCantidad:${item.cantidad} ^FS

      ^FO1650,400^BQN,2,8^FDQA,${qrImageUrl}^FS

      ^FO550,950^A0N,50,50^FD${item.serie} ^FS

      ^FO350,1150^A0N,500,500^FD${fecha}^FS
      ^FO1770,1150^A0N,500,500^FD${item.cod_interno}^FS

      ^XZ
    `;
  }));

  setPreviewData(etiquetas.join("\n")); // Guardar los datos en el estado de vista previa
  handleMenuClose();
  }
};


const handleCancelar = async () => {
  const { id, id_producto, numeroNota } = selectedRow;

  setIsLoading(true);
  const datos = {
    status_active:0
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const respons = await updateRegistro(id, datos, id_producto);
    const response = await putEntradaNotaFiscal(id, datos);
    toast.success(`Nota: ${numeroNota} Cancelada`, {
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

const handleAlterar = async () => {
  const { id, numeroNota, id_producto} = selectedRow;
  if(id_producto=="PVB"){
    const nota =  await getOneNota(numeroNota);
    setDataNota(nota)

    const response = await getVerifyStockPVB(id);
    setDataStock(response)
    setOpenNota(true)
    //llamada para el modal
  }else{
    const nota =  await getOneNota(numeroNota);
    console.log("🚀 ~ handleAlterar ~ nota:", nota)
    setDataNota(nota)
    
    const response = await getVerifyStock(id);
    setDataStock(response)
    setOpenNota(true)
  }
}


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
          title="En Transito"
          subtitle="Liberar a Stock"
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
      {/* {Boolean(anchorEl) && (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePrint}>Imprimir</MenuItem>
        <MenuItem onClick={handleView}>Visualizar</MenuItem>
        <MenuItem onClick={handleCancelar}>Cancelar</MenuItem>
        <MenuItem onClick={handleView}>Alterar</MenuItem>

      </Menu>
      )} */}

    <Menu
      open={Boolean(menuPosition)}
      onClose={handleMenuClose}
      anchorReference="anchorPosition"
      anchorPosition={menuPosition}
    >
      <MenuItem onClick={handlePrint}>Imprimir(Etiqueta30cm)</MenuItem>
      <MenuItem onClick={handlePrint5cm}>Imprimir(Etiqueta5cm)</MenuItem>
      <MenuItem onClick={handleView}>Visualizar</MenuItem>
      <MenuItem onClick={handleCancelar}>Cancelar</MenuItem>
      <MenuItem onClick={handleAlterar}>Alterar</MenuItem>
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
      <EntradaNotaFiscal
        open={openNota}
        onClose={() => setOpenNota(false)}
        dataNota={dataNota}
        dataStock={dataStock}
        numeroNota={dataNota?.numeroNota} // Cambié aquí para usar el registro seleccionado
      />
    </Box>
  );
};

export default Stock;
