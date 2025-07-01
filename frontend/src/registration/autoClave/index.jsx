import { Box, Button, TextField, IconButton, InputAdornment, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import io from "socket.io-client";
import { PostDatosAutoClave } from "../../services/autoClave.services";
import ModalHorario from "../../modal/horarios/modalHorarios";
import ModalCaballete from "../../modal/caballete/modalCaballete";
import ModalReceta from "../../modal/receta/modalReceta";
import ModalCharge from "../../modal/modalCharge";

const AutoClave = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalHorarioOpen, setIsModalHorarioOpen] = useState(false);
  const [isModalCaballeteOpen, setIsModalCaballeteOpen] = useState(false);
  const [isModalCaballete2Open, setIsModalCaballete2Open] = useState(false);
  const [isModalRecetaOpen, setIsModalRecetaOpen] = useState(false);


  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const { estado, primerCaballete,segundoCaballete,recetaUtilizada, tempAguaCaja1, tempAguaCaja2, tempAguaCaja3, tempExterna, tempInterna } = values;

    const valuesToSend = {
      estado: "Entrada",
      primerCaballete: parseInt(primerCaballete),
      segundoCaballete: parseInt(segundoCaballete),
      recetaUtilizada: parseInt(recetaUtilizada),
      tempAguaCaja1: parseInt(tempAguaCaja1),
      tempAguaCaja2: parseInt(tempAguaCaja2),
      tempAguaCaja3: parseInt(tempAguaCaja3),
      tempInterna: parseInt(tempInterna),
      tempExterna: parseInt(tempExterna),
    };
    

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (primerCaballete === segundoCaballete) {
        throw new Error(`El primer Caballete ${primerCaballete} y el segundo Caballete ${segundoCaballete} son iguales `);
      }
      const response = await PostDatosAutoClave(valuesToSend);
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
      <Header title="Registro AutoClave" subtitle="Registro AutoClave" />

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
          estado: "",
          primerCaballete: "", // Agregado esto si se usa en el formulario
          segundoCaballete:"",
          recetaUtilizada: "",
          tempAguaCaja1: "",
          tempAguaCaja2: "",
          tempAguaCaja3: "",
          tempInterna: "",
          tempExterna: "",
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
              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Estado"
                value={values.estado}
                onChange={handleChange}
                name="estado"
                error={!!touched.estado && !!errors.estado}
                helperText={touched.estado && errors.estado}
                sx={{ gridColumn: "span 2" }}
                select
                >
                {/* Opciones del select */}
                {/* <MenuItem value="entrada">Entrada</MenuItem>
                <MenuItem value="salida">Salida </MenuItem>
              </TextField>  */}

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Primer Caballete"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.primerCaballete || ""}
                name="primerCaballete"
                error={!!touched.primerCaballete && !!errors.primerCaballete}
                onClick={() => setIsModalCaballeteOpen(true)} // Abre el modal para seleccionar el salario
                helperText={touched.primerCaballete && errors.primerCaballete}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true, // Solo se puede seleccionar mediante el modal
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Segundo Caballete"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.segundoCaballete || ""}
                name="segundoCaballete"
                error={!!touched.segundoCaballete && !!errors.segundoCaballete}
                onClick={() => setIsModalCaballete2Open(true)} // Abre el modal para seleccionar el salario
                helperText={touched.segundoCaballete && errors.segundoCaballete}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true, // Solo se puede seleccionar mediante el modal
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Receta"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.recetaUtilizada || ""}
                name="recetaUtilizada"
                onClick={() => setIsModalRecetaOpen(true)} // Abre el modal para seleccionar el salario
                error={!!touched.recetaUtilizada && !!errors.recetaUtilizada}
                helperText={touched.recetaUtilizada && errors.recetaUtilizada}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  readOnly: true, // Solo se puede seleccionar mediante el modal
                }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Temperatura Caja1"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tempAguaCaja1 || ""}
                name="tempAguaCaja1"
                error={!!touched.tempAguaCaja1 && !!errors.tempAguaCaja1}
                helperText={touched.tempAguaCaja1 && errors.tempAguaCaja1}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Temperatura Caja2"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tempAguaCaja2 || ""}
                name="tempAguaCaja2"
                error={!!touched.tempAguaCaja2 && !!errors.tempAguaCaja2}
                helperText={touched.tempAguaCaja2 && errors.tempAguaCaja2}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Temperatura Caja3"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tempAguaCaja3 || ""}
                name="tempAguaCaja3"
                error={!!touched.tempAguaCaja3 && !!errors.tempAguaCaja3}
                helperText={touched.tempAguaCaja3 && errors.tempAguaCaja3}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Temperatura Interna"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tempInterna || ""}
                name="tempInterna"
                error={!!touched.tempInterna && !!errors.tempInterna}
                helperText={touched.tempInterna && errors.tempInterna}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Temperatura Externa"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tempExterna || ""}
                name="tempExterna"
                error={!!touched.tempExterna && !!errors.tempExterna}
                helperText={touched.tempExterna && errors.tempExterna}
                sx={{ gridColumn: "span 2" }}
              />
              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Horario"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.segundoCaballete || ""}
                name="segundoCaballete"
                error={!!touched.segundoCaballete && !!errors.segundoCaballete}
                helperText={touched.segundoCaballete && errors.segundoCaballete}
                sx={{ gridColumn: "span 2" }}
                onClick={() => setIsModalHorarioOpen(true)} // Abre el modal para seleccionar el salario
                InputProps={{
                  readOnly: true, // Solo se puede seleccionar mediante el modal
                }}
              /> */}
              {/* Otros campos */}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Registrar
              </Button>
            </Box>
            {isModalHorarioOpen && (
              <ModalHorario
                open={isModalHorarioOpen}
                onClose={() => setIsModalHorarioOpen(false)}
                onSelectHorario={(horario) => {
                  setFieldValue("segundoCaballete", horario.id); // Asigna el id del salario al campo id_salario
                  setIsModalHorarioOpen(false);
                }}
              />
            )}
            {isModalCaballeteOpen && (
              <ModalCaballete
                open={isModalCaballeteOpen}
                onClose={() => setIsModalCaballeteOpen(false)}
                onSelect={(caballete) => {
                  setFieldValue("primerCaballete", caballete.id); // Asigna el id del salario al campo id_salario
                  setIsModalCaballeteOpen(false);
                }}
                serviceType={0}
              />
            )}
            {isModalCaballete2Open && (
              <ModalCaballete
                open={isModalCaballete2Open}
                onClose={() => setIsModalCaballete2Open(false)}
                onSelect={(caballete) => {
                  setFieldValue("segundoCaballete", caballete.id); // Asigna el id del salario al campo id_salario
                  setIsModalCaballeteOpen(false);
                }}
                serviceType={0}
              />
            )}
            {isModalRecetaOpen && (
              <ModalReceta
                open={isModalRecetaOpen}
                onClose={() => setIsModalRecetaOpen(false)}
                onSelect={(receta) => {
                  setFieldValue("recetaUtilizada", receta.id); // Asigna el id del salario al campo id_salario
                  setIsModalRecetaOpen(false);
                }}
              />
            )}
            <ModalCharge isLoading={isLoading} />
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  // estado: yup.string().required("Estado requerida"),
  primerCaballete: yup.number().required("Caballete requerido"),
  recetaUtilizada: yup.number().required("Receta requerido"),
  tempAguaCaja1: yup.number().required("Temperatura requerido en numeros"),
  tempAguaCaja2: yup.number().required("Temperatura requerido en numeros"),
  tempAguaCaja3: yup.number().required("Temperatura requerido en numeros"),
  tempExterna: yup.number().required("Temperatura requerido en numeros"),
  tempInterna: yup.number().required("Temperatura requerido en numeros"),
});

export default AutoClave;