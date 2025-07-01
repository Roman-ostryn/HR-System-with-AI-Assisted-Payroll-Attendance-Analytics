
import React, { useState, useEffect } from "react";
import { Box, Modal, InputBase, IconButton, Button, Alert } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ModalCharge from "../modalCharge";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { getVerificarPvb, getOnePvb, updateRegistro } from "../../services/pvb.services"; // Importa el servicio para `getOne`
import { updateLavadora } from "../../services/lavadoraSocket.services"
import { NULL } from "sass";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";


const ModalVerificarPvb = ({ open, onClose, orden }) => {
  const [data, setdata] = useState("");
  const [serieValue, setSerieValue] = useState(""); // Estado para la serie
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error
  const [pvbData, setPvbData] = useState(null); // Datos obtenidos para el PVB
  const [comparisonResult, setComparisonResult] = useState(null); // Estado para el resultado de la comparación
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");

  // useEffect para verificar PVB al cambiar la orden
  useEffect(() => {
    if (orden && orden.cod) {
      const fetchPvbData = async () => {
        try {
          const data = await getVerificarPvb(orden.cod); // Llama al servicio de verificación
          setPvbData(data[0].pvb); // Guarda los datos de PVB
          setErrorMessage(""); // Resetea el mensaje de error
        } catch (error) {
          setErrorMessage("Error al verificar PVB: " + error.message); // Maneja los errores
          setPvbData(null); // Si hay error, resetea los datos
        }
      };
      fetchPvbData();
    } else {
      setErrorMessage("Orden o código de orden no válido."); // Maneja el caso donde orden o cod están ausentes
      setPvbData(null); // Limpia los datos del PVB
    }
  }, [orden]);

  // Manejar el cambio de la serie
  const handleSerieChange = (e) => {
    setSerieValue(e.target.value); // Actualiza el estado de la serie cuando cambia
    setComparisonResult(null); // Resetea el resultado de comparación
  };


  // Función para verificar la serie con `getOne`
  const handleVerifySerie = async () => {
    setComparisonResult(null);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const datos = await getOnePvb(serieValue); // Llama al servicio con la serie
      setdata(datos.id)

      if (datos.espesura == pvbData) {
        const valuesToSend = {
          cantidad_total: orden.cantidad_total,
          orden: orden.orden,
          Estado: 4,
          estado_calandra: 1,
          cod: orden.cod,
          pvb: datos.id
        };
        
        const update = await updateLavadora(orden.orden, valuesToSend)
        setRegistrationSuccess(true);
        localStorage.setItem("estado_calandra", valuesToSend.estado_calandra);
        localStorage.setItem("Estado", 2);
        localStorage.setItem("pvb", datos.id);

        resetFields();
        setTimeout(() => {
          onClose();
          handleCloseModal();
        }, 2000);
      } else {        
        setRegistrationError(true);
        // resetFields();
        setError(error.message);
        // setComparisonResult("El PVB ingresado no coincide con los datos.");
      }
      setErrorMessage(""); // Resetea cualquier mensaje de error
    } catch (error) {
      setErrorMessage("Error al verificar la PVB "); // Maneja errores del servicio
      setComparisonResult(null); // Resetea el resultado de comparación
    }finally{
      setIsLoading(false);
    }
  };

  const resetFields = () => {
    setSerieValue(""); // Limpia el campo de serie
    setPvbData(null); // Limpia los datos del PVB
    setComparisonResult(null); // Limpia el resultado de comparación
    setErrorMessage(""); // Limpia cualquier mensaje de error
  };

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose(); // Llama la función `onClose` pasada como prop
        resetFields(); // Resetea los campos cuando se cierra el modal
      }}
      aria-labelledby="modal-VerificarPvb-title"
      aria-describedby="modal-VerificarPvb-description"
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >

      <Box
        sx={{
          width: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary[600],
          p: 3,
          zIndex: 1500,
        }}
      >
        {errorMessage && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
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
            onClick={handleVerifySerie} // Verificar la serie al hacer clic
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

        {pvbData && (
          <Box width="100%" mt={2} sx={{ display: "flex", flexDirection: "column" }}>
            <Alert severity="info">Datos de PVB:</Alert>
            <Box sx={{ mt: 1 }}>
              <pre>{JSON.stringify(pvbData, null, 2)}</pre>
            </Box>
          </Box>
        )}

        {comparisonResult && (
          <Box mt={2}>
            <Alert severity="success" sx={{ width: "100%" }}>
              {comparisonResult}
            </Alert>
          </Box>
        )}

        <Box mt={2} width="100%" sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onClose();
              resetFields();
            }}
            sx={{
              padding: "10px 20px",
              backgroundColor: colors.blueAccent[500],
              "&:hover": {
                backgroundColor: colors.blueAccent[700],
              },
            }}
          >
            Cerrar
          </Button>
        </Box>
      {/* <ModalSucces open={registrationSuccess} onClose={() => {}} /> */}
      <ModalCharge isLoading={isLoading} />

       {registrationSuccess && <ModalSucces open={registrationSuccess} onClose={() => setRegistrationSuccess(false)} />}
      {registrationError && <ModalError open={registrationError} onClose={() => setRegistrationError(false)} error={"PVB INCORRECTO"} />}
      </Box>
    </Modal>
  );
};

export default ModalVerificarPvb;
