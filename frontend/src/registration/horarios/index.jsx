import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import io from "socket.io-client";
import { PostDatosHorarios } from "../../services/horarios.services";
import dayjs from "dayjs";
import { tokens } from "../../theme";
import ModalCharge from "../../modal/modalCharge";


// const SOCKET_URL = "http://192.168.88.69:4000";
// const socket = io(SOCKET_URL, {
//   withCredentials: true,
//   transports: ["websocket", "polling"],
//   query: {
//     token: localStorage.getItem("authToken"),
//   },
// });

const Horarios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const isNonMobile = useMediaQuery("(min-width:600px)");


  

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    const { descripcion, hora_entrada, hora_salida } = values;

    const valuesToSend = {
      descripcion,
      hora_entrada: dayjs(hora_entrada).format("HH:mm"), // Formatear la hora antes de enviar
      hora_salida: dayjs(hora_salida).format("HH:mm"),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await PostDatosHorarios(valuesToSend);
      setRegistrationSuccess(true);
      resetForm();
    } catch (error) {
      console.error("error sending data", error);
      setRegistrationError(true);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  return (
    <Box m="20px">
      <Header title="Registro Horario" subtitle="Registro Horario" />

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

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          descripcion: "",
          hora_entrada: null,
          hora_salida: null,
        }}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            
                "& .MuiOutlinedInput-root": {
                  color: `${colors.grey[100]} !important`,
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                  background: `${colors.primary[950]} !important`,
                  borderBottom: `1px solid ${colors.grey[100]} !important`,
                  zIndex: 1, // Aseguramos que el notchedOutline no cubra el label
                },
                "& .MuiInputBase-input": {
                  padding: "12px",
                  zIndex: 100,
                  color: `${colors.grey[100]} !important`,
                },
            
                "& .MuiSvgIcon-root": {
                  color: `${colors.grey[100]} !important`,
                  zIndex: 10,
                },
                "& .MuiInputLabel-root": {
                  zIndex: 200, // Aumentamos el z-index del label para que esté sobre el fondo
                  color: `${colors.grey[100]} !important`,
                },
            
                "& .MuiOutlinedInput-input": {
                  padding: "12px",
                  zIndex: 100,
                },
            
                "& .MuiInputBase-inputAdornedEnd": {
                  padding: "12px",
                  zIndex: 100,
                },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Descripcion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.descripcion}
                name="descripcion"
                error={!!touched.descripcion && !!errors.descripcion}
                helperText={touched.descripcion && errors.descripcion}
                sx={{ gridColumn: "span 2" }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Hora Entrada"
                  value={values.hora_entrada}
                  onChange={(newValue) =>
                    setFieldValue("hora_entrada", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="filled"
                      error={!!touched.hora_entrada && !!errors.hora_entrada}
                      helperText={touched.hora_entrada && errors.hora_entrada}
                      sx={{ gridColumn: "span 2" }}
                    />
                  )}
                />
                <TimePicker
                  label="Hora Salida"
                  value={values.hora_salida}
                  onChange={(newValue) =>
                    setFieldValue("hora_salida", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="filled"
                      error={!!touched.hora_salida && !!errors.hora_salida}
                      helperText={touched.hora_salida && errors.hora_salida}
                      sx={{ gridColumn: "span 2" }}
                      
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Crear Horario
              </Button>
            </Box>
            <ModalCharge isLoading={isLoading} />
          </form>
        )}
        
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  descripcion: yup.string().required("Descripción requerida"),
  hora_entrada: yup.date().required("Hora de entrada requerida"),
  hora_salida: yup.date().required("Hora de salida requerida"),
});

export default Horarios;