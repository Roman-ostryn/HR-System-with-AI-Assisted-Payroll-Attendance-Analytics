import { Box, Button, TextField } from "@mui/material";
import { Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState, useEffect} from "react";
// import { useTheme } from "@emotion/react";
import { PostDatos } from "../../services/owner.services";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalCharge from "../../modal/modalCharge";
import ModalError from "../../modal/modalError";

const Owner = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [initialValues, setInitialValues] = useState({
      nombre: "",
      apellido: "",
      direccion: "",
  });
    
  
  // const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    // Almacenar el valor anterior de initialValues
    const prevInitialValues = initialValues;
    // Verificar si initialValues es diferente al valor anterior
    if (initialValues !== prevInitialValues) {
      // Volver a renderizar el componente al actualizar initialValues
    }
  }, [initialValues]);

  
  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    setInitialValues(values)
    await PostData(values);
  };

  const PostData = async (values) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await PostDatos(values);
      const responseData = await response;
      setIsLoading(false);
      setRegistrationSuccess(true);
    } catch (error) {
      console.error("error sending data", error);
      setIsLoading(false);
      setRegistrationError(true);
      setError(error.message);
    }
  };

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
    resetForm();
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const resetForm = () => {
    setInitialValues({
      nombre: "",
      apellido: "",
      direccion: "",
    });
  };



  return (
    <Box m="20px">
      <Header
        title="REGISTRO DE PROPIETARIOS"
        subtitle="Registro de Propietarios"
      />

      {isLoading && <LoadingSpinner />}
      {registrationSuccess && <ModalSucces />}
      {registrationError && <ModalError />}

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        
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
                label="Nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.nombre && !!errors.nombre}
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: "span 0" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Apellido"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apellido}
                name="apellido"
                error={!!touched.apellido && !!errors.apellido}
                helperText={touched.apellido && errors.apellido}
                sx={{ gridColumn: "span 3" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Direccion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.direccion}
                name="direccion"
                error={!!touched.direccion && !!errors.direccion}
                helperText={touched.direccion && errors.direccion}
                sx={{ gridColumn: "span 2" }}
              />
          
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Registrar
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <ModalCharge isLoading={isLoading} />
      <ModalSucces open={registrationSuccess} onClose={handleCloseModal} />
      <ModalError
        open={registrationError}
        onClose={handleCloseModalError}
        error={error}
      />
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  nombre: yup.string().required("required"),
  apellido: yup.string().required("required"),
  direccion: yup.string().required("required"),
  
});


export default Owner;
