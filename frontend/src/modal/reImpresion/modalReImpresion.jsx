
import React, { useState, useEffect } from "react";
import { Box, Modal, InputBase, IconButton, Button, Alert } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles"; 
import { tokens } from "../../theme"; 
import { getOneImpresion } from "../../services/interfoliacion.services";
import QRCode from 'qrcode'
import { format } from 'date-fns';

const ModalReImpresion = ({ open, onClose, onSelectReImpresion }) => {
  const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState(''); // Estado para guardar posibles errores
  const [reImpresion, setReImpresion] = useState([]); // Datos de reimpresión
  const [serieValue, setSerieValue] = useState(""); // Estado para la serie
  const [impressionData, setImpressionData] = useState(null); // Datos obtenidos para impresión
  const [printerAvailable, setPrinterAvailable] = useState(true); // Estado para indicar si la impresora está disponible
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "serie", headerName: "Serie", flex: 0.3 },
    { field: "cod", headerName: "Codigo", flex: 0.6 },
    { field: "clasificacion", headerName: "Clasificacion", flex: 0.4 },
    { field: "motivo", headerName: "Obs", flex: 0.6 },
  ];

  // useEffect para buscar datos por serie
  useEffect(() => {
    if (serieValue) {
      const fetchDatos = async () => {
        try {   
          const data = await getOneImpresion(serieValue);
          setImpressionData(data); // Guardamos los datos de la serie
          setReImpresion([data]); // Suponemos que `data` es un objeto único
        } catch (error) { 
          console.error("Error al obtener datos:", error.message);
        }
      };
      resetAlert();
      fetchDatos();
    }
  }, [serieValue]);

  const generateZPL = async (values) => {

    if (!values) return;
    
    const formattedDate = format(new Date(values.create_at), 'dd/MM/yyyy');

    const qrImageUrl = await QRCode.toDataURL(values.serie, { errorCorrectionLevel: 'H' }).catch(error => {
      console.error('Error generando el QR:', error);
      return null; // Retorna null en caso de error
    });

    let zpl = `
      ^XA
      ^PW800  
      ^LL400  

      ^FO10,40^A0N,40,40^FD${values.cod}^FS

      ^FO30,90^A0N,30,30^FD${values.descripcion}^FS

      ^FO200,130^A0N,35,35^FD${values.medidas}^FS

      ^FO230,200^A0N,35,35^FD${values.clasificacion}^FS

      ^FO150,240^A0N,35,35^FD${values.motivo}^FS

      ^FO540,120^BQN,2,8^FDQA,${values.serie}^FS

      ^FO20,340^A0N,35,35^FD${values.id_produccion}^FS
      ^FO190,340^A0N,35,35^FD${formattedDate}^FS
      ^FO550,340^A0N,35,35^FD${values.serie}^FS

      ^XZ
    `; // Código ZPL aquí

    // Verificamos si la impresora está disponible antes de intentar imprimir
   
    if (values.clasificacion !== "TIPO A") {
      resetAlert()
      if (window.BrowserPrint) {
        window.BrowserPrint.getDefaultDevice("printer", 
        (device) => {
          if (device) {
            setPrinterInfo(`Dispositivo predeterminado encontrado: ${device.name}`);
            setPrinterAvailable(true); // Impresora disponible
            let zplCommand = zpl;

            // 3. Usar la función send para enviar los datos al dispositivo
            device.send(zplCommand, function(response) {
                console.log("Datos enviados exitosamente:", response);
            }, function(error) {
                console.error("Error al enviar datos:", error);
            });
          } else {
            setPrinterInfo("No hay una impresora predeterminada configurada.");
            setPrinterAvailable(false); // No hay impresora disponible
          }
        },
        (error) => {
            setErrorMessage(`Error al obtener el dispositivo predeterminado: ${error}`);
            setPrinterAvailable(false); // Error al obtener impresora
        });
      } else {
        setErrorMessage('Ejecutar Activador de Zebra');
        setPrinterAvailable(false); // Si BrowserPrint no está disponible
      }
      
    }else{
      setErrorMessage(`La chapa ${values.serie} es de TIPO A`);
    }
  };      

  // Manejador de cambio en el campo de entrada
  const handleSerieChange = (e) => {
    setSerieValue(e.target.value);
  };

  // Función para manejar la reimpresión cuando se presiona el botón
  const handleReImprimir = () => {
    if (!printerAvailable) {
      setErrorMessage('No hay impresora disponible para realizar la reimpresión.');
      return;
    }

    if (impressionData) {
      generateZPL(impressionData); // Llama a la función de generación de ZPL con los datos de impresión
    } else {
      setErrorMessage('No se han encontrado datos para la reimpresión.');
    }
  };

  // Función para resetear los campos cuando el modal se cierra
  const resetFields = () => {
    setSerieValue("");         // Vacia el campo de serie
    setReImpresion([]);        // Limpia la lista de datos de reimpresión
    setImpressionData(null);   // Limpia los datos de impresión
    setErrorMessage('');       // Limpia cualquier mensaje de error
  };

  const resetAlert = () => {
    setErrorMessage('');       // Limpia cualquier mensaje de error
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();    // Llama la función `onClose` pasada como prop
        resetFields(); // Llama la función para resetear los campos
      }}
      aria-labelledby="modal-ReImpresion-title"
      aria-describedby="modal-ReImpresion-description"
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <Box
        sx={{
          width: "800px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary[600],
          p: 3,
          zIndex: 1500,
        }}
      >
        {/* Mostrar el mensaje de error como un Alert prominente */}
        {errorMessage && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box
          mb={2}
          width="100%"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
        <h1 id="modal-reImpresion-title">Re Imprimir</h1>

          <InputBase
            sx={{
              flex: 1,
              backgroundColor: colors.primary[400],
              padding: "5px 10px",
              borderRadius: "4px",
            }}
            placeholder="Ingrese serie"
            value={serieValue}
            onChange={handleSerieChange}
          />
          <IconButton
            type="button"
            sx={{
              backgroundColor: colors.primary[400],
              borderRadius: "4px",
              p: 1,
              "&:hover": {
                backgroundColor: colors.primary[500],
              },
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
        <Box
          width="100%"
          height="400px"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .name-column--cell": { color: colors.greenAccent[300] },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[900], borderBottom: "none" },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[900] },
          }}
        >
          <DataGrid
            checkboxSelection
            rows={reImpresion}
            columns={columns}
            getRowId={(row) => row.id} 
            onRowClick={(params) => {
              if (typeof onSelectReImpresion === 'function') {
                onSelectReImpresion(params.row);
              } else {
                console.error("onSelectReImpresion no es una función válida");
              }
            }}
          />
        </Box>
        <Box mt={2} width="100%" sx={{ display: "flex", justifyContent: "right" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReImprimir}  // Cambié aquí
            sx={{
              padding: "10px 20px",
              backgroundColor: colors.blueAccent[500],
              "&:hover": {
                backgroundColor: colors.blueAccent[700],
              },
            }}
            
          >
            Reimprimir
          </Button>
         
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalReImpresion;
