import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import { useTheme } from "@emotion/react";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { tokens } from "../../theme";
import ModalCharge from "../../modal/modalCharge";
import ModalUser from "../../modal/usuarios/modalUser";
import { PostDatosHoras } from "../../services/horasExtras.services";


const HorasExtrasR = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const initialValues = {
    id_usuario: "",
    id_empleado: "",
    id_grupo: "",
    id_salario: "",
    entrada: null,
    salida: null,
    horas: "",
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    const { id_empleado, id_usuario, id_grupo, id_salario, entrada, salida, horas } = values;
  
    // Convertir entrada y salida a timestamp (Unix)
    const valuesToSend = {
      id_empleado,
      id_grupo,
      id_usuario,
      id_salario,
      entrada: dayjs(entrada).unix(), // Convertir a timestamp
      salida: dayjs(salida).unix(),   // Convertir a timestamp
      horas,
    };
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await PostDatosHoras(valuesToSend);
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
      <Header
        title="Registro Horas Extras"
        subtitle="Habilitados para Horas Extras"
      />

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
        initialValues={initialValues}
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
                },
                "& .MuiInputBase-input": {
                  color: `${colors.grey[100]} !important`,
                },

                "& .MuiInputLabel-root": {
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
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id Usuario"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_usuario}
                name="id_usuario"
                error={!!touched.id_usuario && !!errors.id_usuario}
                helperText={touched.id_usuario && errors.id_usuario}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  readOnly: true,
                }}
                onClick={() => setModalOpen(true)}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id Empleado"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_empleado}
                name="id_empleado"
                error={!!touched.id_empleado && !!errors.id_empleado}
                helperText={touched.id_empleado && errors.id_empleado}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                    readOnly: true,
                  }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id Grupo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_grupo}
                name="id_grupo"
                error={!!touched.id_grupo && !!errors.id_grupo}
                helperText={touched.id_grupo && errors.id_grupo}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                    readOnly: true,
                  }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id Salario"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_salario}
                name="id_salario"
                error={!!touched.id_salario && !!errors.id_salario}
                helperText={touched.id_salario && errors.id_salario}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                    readOnly: true,
                  }}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Hora Entrada"
                  value={values.entrada}
                  onChange={(newValue) =>
                    setFieldValue("entrada", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="filled"
                      error={!!touched.entrada && !!errors.entrada}
                      helperText={touched.entrada && errors.entrada}
                      sx={{ gridColumn: "span 2" }}
                    />
                  )}
                />
                <TimePicker
                  label="Hora Salida"
                  value={values.salida}
                  onChange={(newValue) =>
                    setFieldValue("salida", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="filled"
                      error={!!touched.salida && !!errors.salida}
                      helperText={touched.salida && errors.salida}
                      sx={{ gridColumn: "span 2" }}
                    />
                  )}
                />
              </LocalizationProvider>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Horas"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.horas}
                name="horas"
                error={!!touched.horas && !!errors.horas}
                helperText={touched.horas && errors.horas}
                sx={{ gridColumn: "span 1" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Registrar
              </Button>
            </Box>
            <ModalCharge isLoading={isLoading} />
            <ModalUser
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onSelectUsuario={(user) => {
                // Actualizar los valores del usuario seleccionado
                setFieldValue("id_usuario", user.id);
                setFieldValue("id_empleado", user.id_empleado);
                setFieldValue("id_grupo", user.id_grupo);
                setFieldValue("id_salario", user.id_salario);
                setModalOpen(false);
              }}
            />
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  id_usuario: yup.string().required("Requerido"),
  id_empleado: yup.string().required("Requerido"),
  id_grupo: yup.string().required("Requerido"),
  id_salario: yup.string().required("Requerido"),
  entrada: yup.date().nullable().required("Requerido"),
  salida: yup.date().nullable().required("Requerido"),
  horas: yup.string().required("Requerido"),
});

export default HorasExtrasR;