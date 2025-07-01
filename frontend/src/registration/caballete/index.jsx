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
import ModalCaballete from "../../modal/caballete/modalCaballete";
import { PostDatos } from "../../services/caballete.services";


const Caballete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalCaballeteOpen, setIsModalCaballeteOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedCaballete, setSelectedCaballete] = useState({
    id: "",
    descripcion: "",
    codigo: "",
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const { codigo,descripcion} = values;

    const valuesToSend = {
      codigo,
      descripcion,
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

  const handleSelectCaballete = (caballete) => {
    setSelectedCaballete(caballete);
    };


  return (
    <Box m="20px">
      <Header title="Registro Caballete" subtitle="Registro Caballete" />

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
          codigo:"",
          descripcion:"",
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
                label="Codigo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.codigo || ""}
                name="codigo"
                error={!!touched.codigo && !!errors.codigo}
                helperText={touched.codigo && errors.codigo}
                sx={{ gridColumn: "span 2" }}
              />
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

            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained" sx={{marginRight:"20px"}} onClick={() => setIsModalCaballeteOpen(true)}>
                Consultar
              </Button>
              <Button type="submit" color="secondary" variant="contained">
                Registrar
              </Button>

            </Box>
          </form>
        )}
      </Formik>
      <ModalCaballete
        open={isModalCaballeteOpen}
        onClose={() => setIsModalCaballeteOpen(false)}
        onSelectVehiculos={handleSelectCaballete}
        serviceType="2"
      /> 
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  codigo: yup.string().required("Codigo requerido"),
  descripcion: yup.string().required("Descripcion requerida"),
});

export default Caballete;