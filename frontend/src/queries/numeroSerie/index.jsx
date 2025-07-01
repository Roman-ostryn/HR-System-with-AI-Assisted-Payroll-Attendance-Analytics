import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getDatosOrdenView2, getSerieEtiqueta, putDatos } from "../../services/ordenProduccion.services";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import QRCode from "qrcode";
import dayjs from "dayjs";
import ModalCharge from "../../modal/modalCharge";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalPreview from "../../modal/modalPreview"; // Importar el modal de vista previa
import ModalChapas from "../../modal/ordenProduccion/modalChapas";
import ModalEditNs from "../../modal/ordenProduccion/modalEditNS";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NumeroSerie = () => {
  const [data, setData] = useState([]); // Datos de OrdenProduccion
  const [searchValue, setSearchValue] = useState(""); // Valor del campo de búsqueda
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados para la tabla
  const [open, setOpen] = useState(false);
  const [registro, setRegistro] = useState(null);
  const [openNs, setOpenNs] = useState(false); // Estado para el modal de edición
  const [registroNs, setRegistroNs] = useState(null); // Estado para guardar el registro seleccionado
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [previewData, setPreviewData] = useState(""); // Estado para guardar los datos de vista previa
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [errorMessage, setErrorMessage] = useState("");
  const [printerInfo, setPrinterInfo] = useState(""); // Estado para guardar la información de la impresora

  const fetchPrueba = async () => {
    try {
      const response = await getDatosOrdenView2();

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

  const handleCloseModalNS = () => {
    setOpenNs(false);
    fetchPrueba();
  };

  const handleCloseModalSucess = () => {
    setRegistrationSuccess(false);
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

  const handleEtiqueta = async () => {
    const { serie } = selectedRow;

    try {
      const response = await getSerieEtiqueta(serie);
      if (response === 404) {
        toast.error(`LA SERIE ${serie} AUN NO ESTA CONCLUIDA `, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      if (!response || typeof response !== "object") {
        console.error("Respuesta inesperada de getOneDatos:", response);
        return;
      }

      // Generar la etiqueta para el objeto response
      const fecha = dayjs(response.created_At).format("DD/MM/YYYY HH:mm");
      const qrImageUrl = await QRCode.toDataURL(response.serie, {
        errorCorrectionLevel: "H",
      }).catch((error) => {
        console.error("Error generando el QR:", error);
        return null; // Retorna null en caso de error
      });

      const etiqueta = `
        ^XA
        ^PW800
        ^LL1600
  
        ^FO200,40^A0N,50,50^FD${response.codigo} ^FS
  
        ^FO700,450^A0N,50,50^FD${response.medidas} ^FS
        ^FO700,650^A0N,50,50^FD${response.clasificacion} ^FS
        ^FO520,770^A0N,80,80^FD${response.obs} ^FS
  
        ^FO1650,250^BQN,2,8^FDQA,${qrImageUrl}^FS
  
        ^FO700,1150^A0N,500,500^FD${fecha}^FS
        ^FO200,1150^A0N,500,500^FD${response.id_produccion}^FS
        ^FO1770,1150^A0N,500,500^FD${response.serie}^FS
  
        ^XZ
      `;

      setPreviewData(etiqueta); // Guardar los datos en el estado de vista previa
      handleMenuClose();
    } catch (error) {
      console.error("Error en handleEtiqueta:", error);
    }
  };

  const handlePrint = async () => {
    if (!selectedRow || !selectedRow.id) {
      setErrorMessage("No se ha seleccionado ninguna fila.");
      return;
    }
    const { serie } = selectedRow;

    try {
      const response = await getSerieEtiqueta(serie);
      if (response === 404) {
        toast.error(`LA SERIE ${serie} AUN NO ESTA CONCLUIDA `, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

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

      // Si response no es un array, conviértelo en uno
      const items = Array.isArray(response) ? response : [response];
      const descripcionLines = formatText(response.codigo, 50);

      const etiquetas = await Promise.all(
        items.map(async (item) => {
          const fecha = dayjs(response.created_At).format("DD/MM/YYYY HH:mm");
          let zpl = `
            ^XA
            ^PW800
            ^LL400

            `;
            descripcionLines.forEach((line, index) => {
              zpl += `^FO30,${25 + index * 30}^A0N,28,28^FD${line}^FS\n`;
            });

            zpl += `
            ^FO30,${80 + descripcionLines.length * 30 + 30}^A0N,28,28^FD^FS


            // Medidas
            ^FO200,110^A0N,35,35^FD${response.medidas}^FS

            // Clasificación


            // Código QR, más grande

            ^FO540,100^BQN,2,8^FDQA,${response.serie}^FS

            // ID Producción, fecha y serie
            ^FO20,320^A0N,35,35^FD${response.id_produccion}^FS
            ^FO190,320^A0N,35,35^FD${fecha}^FS
            ^FO550,320^A0N,35,35^FD${response.serie}^FS

            ^XZ
          `;
          return zpl;
        })
      );

      
      // ^FO230,180^A0N,35,35^FD${response.clasificacion}^FS

      // // Observaciones
      // ^FO150,220^A0N,35,35^FD${response.obs}^FS

      if (window.BrowserPrint) {
        // Asegúrate de que BrowserPrint está disponible
        window.BrowserPrint.getDefaultDevice(
          "printer",
          (device) => {
            if (device) {
              setPrinterInfo(
                `Dispositivo predeterminado encontrado: ${device.name}`
              );
              let zplCommand = etiquetas.join("\n");

              device.send(
                zplCommand,
                function (response) {
                  console.log("Datos enviados exitosamente:", response);
                },
                function (error) {
                  console.error("Error al enviar datos:", error);
                }
              );
            } else {
              setPrinterInfo(
                "No hay una impresora predeterminada configurada."
              );
            }
          },
          (error) => {
            setErrorMessage(
              `Error al obtener el dispositivo predeterminado: ${error}`
            );
          }
        );
      } else {
        setErrorMessage("BrowserPrint no está disponible.");
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setErrorMessage("Error al obtener los datos.");
    }

    handleMenuClose();
  };



  
  const handleEditar = async () => {
    // console.log("🚀 ~ handleEditar ~ selectedRow:", selectedRow)
    if (!selectedRow || !selectedRow.id) {
      setErrorMessage("No se ha seleccionado ninguna fila.");
      return;
    }
    setRegistroNs(selectedRow); // Guarda el registro seleccionado para editar
    setOpenNs(true); // Abre el modal de edición
    handleMenuClose();
  };



  const handleConcluido = async () => {
    setIsLoading(true);
    if (!selectedRow || !selectedRow.id) {
      setErrorMessage("No se ha seleccionado ninguna fila.");
      return;
    }
    console.log("🚀 ~ handleConcluido ~ selectedRow:", selectedRow)

    const { id, Estado, serie} = selectedRow;

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await getSerieEtiqueta(serie);
      console.log("🚀 ~ handleConcluido ~ response:", response)

      if (Estado != "concluido" && response!=404) {
        const responsePut = await putDatos(id, { Estado: 3 });
        setRegistrationSuccess(true);
        fetchPrueba();
      } else {
        if (response === 404) {
        toast.error(`LA SERIE ${serie} AUN NO A SIDO REGISTRADA EN CALANDRA`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }else{
        toast.warning(`LA SERIE ${serie} YA ESTA CONCLUIDA `, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
          return;
      }}
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setErrorMessage("Error al obtener los datos.");
      setIsLoading(false);
    }finally {
      setTimeout(() => {
        setIsLoading(false);
    }, 1500);

    handleMenuClose();
  }};


  // Definir columnas de la tabla
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
    { field: "id", headerName: "ID", flex: 0.3 },
    {
      field: "orden",
      headerName: "Orden Produccion",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
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
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Estado",
      headerName: "Estado",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
  ];

  useEffect(() => {
    const fetchOrdenProduccion = async () => {
      try {
        const response = await getDatosOrdenView2();
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchOrdenProduccion();
  }, []);

  // Manejar la búsqueda en la tabla
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    // Filtrar los datos en base al valor de búsqueda
    const filtered = data.filter(
      (item) =>
        String(item.orden).toLowerCase().includes(value.toLowerCase()) ||
        item.serie.toString().includes(value) ||
        item.cod.toString().includes(value) ||
        item.Estado.toString().includes(value)
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

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="OrdenProduccion" subtitle="Numero de Serie" />
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
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePrint}>Imprimir</MenuItem>
        <MenuItem onClick={handleEtiqueta}>Visualizar</MenuItem>
        <MenuItem onClick={handleEditar}>Editar</MenuItem>
        <MenuItem onClick={handleConcluido}>Concluido</MenuItem>
      </Menu>
      <ModalChapas
        open={open}
        onClose={handleCloseModal}
        registro={registro} // Mostrar los datos recibidos
      />
      <ModalCharge isLoading={isLoading} />

      {registrationSuccess && (
        <ModalSucces open={registrationSuccess} onClose={handleCloseModalSucess} />
      )}
      {registrationError && (
        <ModalError
          open={registrationError}
          onClose={handleCloseModalError}
          error={error}
        />
      )}

      <ModalEditNs
        open={openNs}
        onClose={handleCloseModalNS}
        onSelectClient={registroNs} // Mostrar los datos recibidos
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

export default NumeroSerie;
