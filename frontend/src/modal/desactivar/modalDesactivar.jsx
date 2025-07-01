
import React, { useState, useEffect } from "react";
import { Box, Modal, InputBase, IconButton, Button, Alert } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles"; 
import { tokens } from "../../theme"; 
import { getOneImpresion } from "../../services/interfoliacion.services";
import { desactivar } from "../../services/interfoliacion.services";
import QRCode from 'qrcode'
import { format } from 'date-fns';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalEstasSeguro from "./modalEstasSeguro";

const ModalDesactivar = ({ open, onClose }) => {
  const [Desactivar, setDesactivar] = useState([]); // Datos de reimpresión
  const [modalOpenEstasSeguro, setModalOpenEstasSeguro] = useState(false)
  const [serieValue, setSerieValue] = useState(""); // Estado para la serie
  const [impressionData, setImpressionData] = useState(null); // Datos obtenidos para impresión
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
          setDesactivar([data]); // Suponemos que `data` es un objeto único
        } catch (error) { 
          console.error("Error al obtener datos:", error.message);
        }
      };
      // resetAlert();
      fetchDatos();
    }
  }, [serieValue]);


  // Manejador de cambio en el campo de entrada
  const handleSerieChange = (e) => {
    setSerieValue(e.target.value);
  };

  // Función para manejar la reimpresión cuando se presiona el botón
  const handleDesactivar = (response) => {
    if(response==1){
        const data = {
          status_active: 0,
        }
        if (impressionData) {
          const response = desactivar(serieValue, data);
          toast.success(
            `La etiqueta ${serieValue} a sido desactivada`,
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          setTimeout(() => {
            onClose();
            resetFields();
      }, 2000);}else{
        onClose();
      }
  };
}

  // Función para resetear los campos cuando el modal se cierra
  const resetFields = () => {
    setSerieValue("");         // Vacia el campo de serie
    setDesactivar([]);        // Limpia la lista de datos de reimpresión
    setImpressionData(null);   // Limpia los datos de impresión
  };



  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();    // Llama la función `onClose` pasada como prop
        resetFields(); // Llama la función para resetear los campos
      }}
      aria-labelledby="modal-Desactivar-title"
      aria-describedby="modal-Desactivar-description"
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
        <Box
          mb={2}
          width="100%"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
            <h1 id="modal-caballete-title">Desactivar</h1>

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
            rows={Desactivar}
            columns={columns}
            getRowId={(row) => row.id} 
          />
        </Box>
        <Box mt={2} width="100%" sx={{ display: "flex", justifyContent: "right" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpenEstasSeguro(true)} // Cambié aquí
            sx={{
              padding: "10px 20px",
              backgroundColor: colors.blueAccent[500],
              "&:hover": {
                backgroundColor: colors.blueAccent[700],
              },
            }}
            
          >
            Desactivar
          </Button>
        </Box>

        <ModalEstasSeguro
          open={modalOpenEstasSeguro}
          onClose={() => setModalOpenEstasSeguro(false)}
          onAccept={handleDesactivar}
        />
      </Box>
    </Modal>
  );
};

export default ModalDesactivar;
