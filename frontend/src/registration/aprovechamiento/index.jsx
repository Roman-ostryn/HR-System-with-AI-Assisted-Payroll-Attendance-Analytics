import { Box, Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import { useTheme } from "@emotion/react";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalClasificacion from "../../modal/clasificacion/modalClasificacion";
import { postDatosAprovechamiento } from "../../services/aprovechamiento.services";


const Aprovechamiento = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clasificacionModalOpen, setClasificacionModalOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const { serie, imagen } = values;

    const valuesToSend = {
      ...values,
      serie,
      imagen, // Imagen en formato base64
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
   const response = await postDatosAprovechamiento(valuesToSend);
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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  

  return (
    <Box m="20px">
      <Header title="Aprovechamiento de Chapas" subtitle="Registro de Aprovechamiento de Chapas" />

      {isLoading && <LoadingSpinner />}
      {registrationSuccess && (
        <ModalSucces open={registrationSuccess} onClose={handleCloseModal} />
      )}
      {registrationError && (
        <ModalError open={registrationError} onClose={handleCloseModalError} error={error} />
      )}

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          serie: "",
          imagen: "", // Inicializamos imagen como string para almacenar base64
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
                label="serie"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.serie || ""}
                name="serie"
                error={!!touched.serie && !!errors.serie}
                helperText={touched.serie && errors.serie}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Campo para cargar la imagen */}
              <TextField
  fullWidth
  variant="filled"
  type="file"
  label="Imagen"
  InputLabelProps={{ shrink: true }}
  onBlur={handleBlur}
  onChange={async (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const base64 = await convertToBase64(file); // Convertimos a base64
      setFieldValue("imagen", base64); // Guardamos la imagen en base64 en Formik
    }
  }}
  name="imagen"
  error={!!touched.imagen && !!errors.imagen}
  helperText={touched.imagen && errors.imagen}
  sx={{ gridColumn: "span 2" }}
/>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Crear Productos
              </Button>
            </Box>

            <ModalClasificacion
              open={clasificacionModalOpen}
              onClose={() => setClasificacionModalOpen(false)}
              onSelect={(field) => setFieldValue("id_categoria", field.id)}
            />
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  serie: yup.string().required("Serie del Producto requerida"),
  imagen: yup.string().required("Imagen del Producto requerida"), // Imagen en base64 es string
});

export default Aprovechamiento;