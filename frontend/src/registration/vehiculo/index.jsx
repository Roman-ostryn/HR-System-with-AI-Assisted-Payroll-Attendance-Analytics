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
import ModalCamion from "../../modal/camiones/modalCamion";
import { PostDatosVehiculo } from "../../services/vehiculos.services";


const Vehiculo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalCamionOpen, setIsModalCamionOpen] = useState(false);
  const [clasificacionModalOpen, setClasificacionModalOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const cod_empresa = localStorage.getItem("cod_empresa");
    const [selectedCamion, setSelectedCamion] = useState({
    id: "",
    model: "",
    brand: "",
    chapa: "",
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const { brand,model,chapa} = values;

    const valuesToSend = {
      brand,
      model,
      chapa,
      id_empresa: cod_empresa,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await PostDatosVehiculo(valuesToSend);
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

  const handleSelectCamion = (camion) => {
  setSelectedCamion(camion);
  };


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "F9" ||
        (event.key === "Tab" && document.activeElement.name === "id_level")
      ) {
        // setIsModalLevelOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Box m="20px">
      <Header title="Registro Vehiculo" subtitle="Registro Vehiculo" />

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
          brand:"",
          model:"",
          chapa:"",
          medidas:"",
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
                label="Marca"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.brand || ""}
                name="brand"
                error={!!touched.brand && !!errors.brand}
                helperText={touched.brand && errors.brand}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Modelo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.model || ""}
                name="model"
                error={!!touched.model && !!errors.model}
                helperText={touched.model && errors.model}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Chapa"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.chapa || ""}
                name="chapa"
                error={!!touched.chapa && !!errors.chapa}
                helperText={touched.chapa && errors.chapa}
                sx={{ gridColumn: "span 2" }}
                onClick={() => setClasificacionModalOpen(true)}
              />

              {/* Otros campos */}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="button" color="secondary" variant="contained" sx={{marginRight:"20px"}} onClick={() => setIsModalCamionOpen(true)}>
                Consultar
              </Button>
              <Button type="submit" color="secondary" variant="contained">
                Registrar
              </Button>

            </Box>
          </form>
        )}
      </Formik>
      <ModalCamion
        open={isModalCamionOpen}
        onClose={() => setIsModalCamionOpen(false)}
        onSelectVehiculos={handleSelectCamion}
      /> 
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  brand: yup.string().required("Marca del Vehiculo requerida"),
  model: yup.string().required("Modelo del Vehiculo requerida"),
  chapa: yup.string().required("Chapa requerida"), // Agrega validación si es necesario
});

export default Vehiculo;