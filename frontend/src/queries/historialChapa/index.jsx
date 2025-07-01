import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getHistorialChapa } from "../../services/salaLimpia.services";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import QRCode from "qrcode";
import dayjs from "dayjs";
import ModalPreview from "../../modal/modalPreview"; // Importar el modal de vista previa
import ModalChapas from "../../modal/ordenProduccion/modalChapas";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HistorialChapa = () => {
  const [data, setData] = useState([]); // Datos de OrdenProduccion
  const [searchValue, setSearchValue] = useState(""); // Valor del campo de búsqueda
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados para la tabla
  const [open, setOpen] = useState(false);
  const [registro, setRegistro] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [previewData, setPreviewData] = useState(""); // Estado para guardar los datos de vista previa
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [errorMessage, setErrorMessage] = useState("");
  const [printerInfo, setPrinterInfo] = useState(""); // Estado para guardar la información de la impresora

  const fetchPrueba = async () => {
    try {
      const response = await getHistorialChapa();
      // console.log("🚀 ~ fetchPrueba ~ response:", response)

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

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpen(false);
    fetchPrueba();
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleClosePreview = () => {
    setPreviewData(""); // Limpiar los datos de vista previa al cerrar el modal
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

  // const handleEtiqueta = async () => {
  //   const { serie } = selectedRow;

  //   try {
  //     const response = await getSerieEtiqueta(serie);
  //     if (response === 404) {
  //       toast.error(`LA SERIE ${serie} AUN NO ESTA CONCLUIDA `, {
  //         position: "top-center",
  //         autoClose: 5000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //       });
  //       return;
  //     }

  //     if (!response || typeof response !== "object") {
  //       console.error("Respuesta inesperada de getOneDatos:", response);
  //       return;
  //     }

  //     // Generar la etiqueta para el objeto response
  //     const fecha = dayjs(response.created_At).format("DD/MM/YYYY hh:mm");
  //     const qrImageUrl = await QRCode.toDataURL(response.serie, {
  //       errorCorrectionLevel: "H",
  //     }).catch((error) => {
  //       console.error("Error generando el QR:", error);
  //       return null; // Retorna null en caso de error
  //     });

  //     const etiqueta = `
  //       ^XA
  //       ^PW800
  //       ^LL1600
  
  //       ^FO200,40^A0N,50,50^FD${response.codigo} ^FS
  
  //       ^FO700,450^A0N,50,50^FD${response.medidas} ^FS
  //       ^FO700,650^A0N,50,50^FD${response.clasificacion} ^FS
  //       ^FO520,770^A0N,80,80^FD${response.obs} ^FS
  
  //       ^FO1650,250^BQN,2,8^FDQA,${qrImageUrl}^FS
  
  //       ^FO700,1150^A0N,500,500^FD${fecha}^FS
  //       ^FO200,1150^A0N,500,500^FD${response.id_produccion}^FS
  //       ^FO1770,1150^A0N,500,500^FD${response.serie}^FS
  
  //       ^XZ
  //     `;

  //     setPreviewData(etiqueta); // Guardar los datos en el estado de vista previa
  //     handleMenuClose();
  //   } catch (error) {
  //     console.error("Error en handleEtiqueta:", error);
  //   }
  // };

  // const handlePrint = async () => {
  //   if (!selectedRow || !selectedRow.id) {
  //     setErrorMessage("No se ha seleccionado ninguna fila.");
  //     return;
  //   }
  //   const { serie } = selectedRow;

  //   try {
  //     const response = await getSerieEtiqueta(serie);
  //     if (response === 404) {
  //       toast.error(`LA SERIE ${serie} AUN NO ESTA CONCLUIDA `, {
  //         position: "top-center",
  //         autoClose: 5000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //       });
  //       return;
  //     }
  //     // Si response no es un array, conviértelo en uno
  //     const items = Array.isArray(response) ? response : [response];

  //     const etiquetas = await Promise.all(
  //       items.map(async (item) => {
  //         const fecha = dayjs(response.created_At).format("DD/MM/YYYY hh:mm");
  //         let zpl = `
  //           ^XA
  //           ^PW800
  //           ^LL400

  //           // Código en la parte superior, más grande
  //           ^FO30,25^A0N,28,28^FD${response.codigo}^FS

  //           // Medidas
  //           ^FO200,110^A0N,35,35^FD${response.medidas}^FS

  //           // Clasificación

  //           ^FO230,180^A0N,35,35^FD${response.clasificacion}^FS

  //           // Observaciones
  //           ^FO150,220^A0N,35,35^FD${response.obs}^FS

  //           // Código QR, más grande

  //           ^FO540,100^BQN,2,8^FDQA,${response.serie}^FS

  //           // ID Producción, fecha y serie
  //           ^FO20,320^A0N,35,35^FD${response.id_produccion}^FS
  //           ^FO190,320^A0N,35,35^FD${fecha}^FS
  //           ^FO550,320^A0N,35,35^FD${response.serie}^FS

  //           ^XZ
  //         `;
  //         return zpl;
  //       })
  //     );

  //     if (window.BrowserPrint) {
  //       // Asegúrate de que BrowserPrint está disponible
  //       window.BrowserPrint.getDefaultDevice(
  //         "printer",
  //         (device) => {
  //           if (device) {
  //             setPrinterInfo(
  //               `Dispositivo predeterminado encontrado: ${device.name}`
  //             );
  //             let zplCommand = etiquetas.join("\n");

  //             device.send(
  //               zplCommand,
  //               function (response) {
  //                 console.log("Datos enviados exitosamente:", response);
  //               },
  //               function (error) {
  //                 console.error("Error al enviar datos:", error);
  //               }
  //             );
  //           } else {
  //             setPrinterInfo(
  //               "No hay una impresora predeterminada configurada."
  //             );
  //           }
  //         },
  //         (error) => {
  //           setErrorMessage(
  //             `Error al obtener el dispositivo predeterminado: ${error}`
  //           );
  //         }
  //       );
  //     } else {
  //       setErrorMessage("BrowserPrint no está disponible.");
  //     }
  //   } catch (error) {
  //     console.error("Error al obtener los datos:", error);
  //     setErrorMessage("Error al obtener los datos.");
  //   }

  //   handleMenuClose();
  // };

  // Definir columnas de la tabla
  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "orden", headerName: "Orden", flex: 0.3 },

    {
      field: "serie",
      headerName: "Serie",
      flex: 0.5,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "cod",
      headerName: "Producto",
      flex: 1.5,
      type: "number",
      headerAlign: "left",
      align: "left",
      cellClassName: "name-column--cell",
    },
    {
      field: "fabrica1",
      headerName: "Chapa1",
      flex: 0.5,
    },{
      field: "fabrica2",
      headerName: "Chapa2",
      flex: 0.5,
    },
    {
      field: "PVB",
      headerName: "PVB",
      flex: 0.5,
    },
    {
      field: "temperatura",
      headerName: "Calandra Temp",
      flex: 0.5,
    },
    {
      field: "Procesado",
      headerName: "Hora Proceso",
      flex: 0.5,
      type: "number",
      headerAlign: "left",
      align: "left",
      valueGetter: (params) => formatDate(params.row.HoraCalandra),
    },
    {
      field: "TemperaturaSalaLimpia",
      headerName: "SL Temperatura",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "HumedadSalaLimpia",
      headerName: "SL Humedad",
      flex: 0.5,
      type: "number",
      headerAlign: "left",
      align: "left",
      cellClassName: "name-column--cell",
    },
    {
      field: "Hora SalaLimpia",
      headerName: "Hora SL",
      flex: 0.5,
      type: "number",
      headerAlign: "left",
      align: "left",
      valueGetter: (params) => formatDate(params.row.HoraSalaLimpia),
    },
    {
      field: "recetaAutoClave",
      headerName: "Receta",
      flex: 1,
    },
  ];

  // useEffect(() => {
  //   const fetchOrdenProduccion = async () => {
  //     try {
  //       const response = await getDatosOrdenView2();
  //       setData(response);
  //       setFilteredData(response);
  //     } catch (error) {
  //       console.error("Error al obtener los datos:", error);
  //     }
  //   };
  //   fetchOrdenProduccion();
  // }, []);

  // Manejar la búsqueda en la tabla
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    // Filtrar los datos en base al valor de búsqueda
    const filtered = data.filter(
      (item) =>
        item.serie.toString().includes(value)
    );
    setFilteredData(filtered);
  };

  // Función para asignar una clase a cada fila dependiendo del Estado
  const getRowClassName = (params) => {
    const estado = params.row.Estado;
    switch (estado) {
      case "programado":
        return "estado-pendiente";
      case "concluido":
        return "estado-completo";
      case "en proceso":
        return "estado-en-proceso";
      default:
        return "estado-default";
    }
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="Historial de Chapas" subtitle="Numero de Serie" />
        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            height={"40%"}
            width={"90%"}
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

          // Estilos para las filas con hover
          "& .estado-pendiente": {
            backgroundColor: "#740017", // Color de texto
            textShadow: "2px 2px 2px 2px #ffffff",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important", // Fondo al pasar el ratón
            },
          },
          "& .estado-completo": {
            backgroundColor: "green",
            textShadow: "2px 2px 2px 2px #ffffff",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important", // Fondo al pasar el ratón
            },
          },
          "& .estado-en-proceso": {
            backgroundColor: "#ff6105",
            textShadow: "2px 2px 2px 2px #ffffff",
            color: "white !important",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important", // Fondo al pasar el ratón
            },
          },
          "& .estado-default": {
            color: "gray",
            textShadow: "2px 2px 2px 2px #ffffff",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important", // Fondo al pasar el ratón
            },
          },
        }}
      >
        <DataGrid
          rows={Object.values(filteredData).flat()} // Aplanar los grupos para que se muestren correctamente en la tabla
          getRowId={(row) => row.id} // Acceder correctamente al campo `Id`
          columns={columns}
          onRowDoubleClick={handleRowClick}
          getRowClassName={getRowClassName} // Aplicar la clase condicional
          components={{ Toolbar: GridToolbar }}
          disableMultipleSelection={true}
        />
      </Box>
      {/* <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePrint}>Imprimir</MenuItem>
        <MenuItem onClick={handleEtiqueta}>Visualizar</MenuItem>
      </Menu> */}
      {/* <ModalChapas
        open={open}
        onClose={handleCloseModal}
        registro={registro} // Mostrar los datos recibidos
      /> */}

      {/*{previewData && (
        <ModalPreview
          open={Boolean(previewData)}
          onClose={handleClosePreview}
          data={previewData}
        />
      )}*/}
    </Box>
  );
};

export default HistorialChapa;
