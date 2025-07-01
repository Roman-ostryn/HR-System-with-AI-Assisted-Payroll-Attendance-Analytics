import { Box, Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
// import ModalLevel from "../../modal/camiones/modalPermisos";
import ModalCliente from "../../modal/cliente/modalCliente";
import { PostDatos } from "../../services/cliente.services";


const Cliente = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalClienteOpen, setIsModalClienteOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedCliente, setSelectedCliente] = useState({
    id: "",
    descripcion: "",
    direccion: "",
    pais: "",
    telefono: "",
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const { direccion,descripcion, telefono, pais} = values;

    const valuesToSend = {
      descripcion,
      direccion,
      pais,
      telefono,
      id_empresa:1
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await PostDatos(valuesToSend);
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

  const handleSelectCliente = (cliente) => {
    setSelectedCliente(cliente);
    };


  return (
    <Box m="20px">
      <Header title="Registro Cliente" subtitle="Registro Cliente" />

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
          direccion:"",
          descripcion:"",
          pais:"",
          telefono: "",
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
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Descripcion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.descripcion || ""}
                name="descripcion"
                error={!!touched.descripcion && !!errors.descripcion}
                helperText={touched.descripcion && errors.descripcion}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Pais"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.pais || ""}
                name="pais"
                error={!!touched.pais && !!errors.pais}
                helperText={touched.pais && errors.pais}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Direccion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.direccion || ""}
                name="direccion"
                error={!!touched.direccion && !!errors.direccion}
                helperText={touched.direccion && errors.direccion}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Telefono"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.telefono || ""}
                name="telefono"
                error={!!touched.telefono && !!errors.telefono}
                helperText={touched.telefono && errors.telefono}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="button" color="secondary" variant="contained" sx={{marginRight:"20px"}} onClick={() => setIsModalClienteOpen(true)}>
                Consultar
              </Button>
              <Button type="submit" color="secondary" variant="contained">
                Registrar
              </Button>

            </Box>
          </form>
        )}
      </Formik>
      <ModalCliente
        open={isModalClienteOpen}
        onClose={() => setIsModalClienteOpen(false)}
      /> 
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  pais: yup.string().required("Pais es requerido"),
  direccion: yup.string().required("Direccion requerido"),
  descripcion: yup.string().required("Descripcion requerida"),
});

export default Cliente;