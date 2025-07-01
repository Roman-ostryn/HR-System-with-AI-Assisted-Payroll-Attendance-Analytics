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
//import ModalSalario from "../../modal/salarios/modalSalarios"; // Verifica que este archivo exista y esté en la ruta correcta
import { PostDatosDescuento } from "../../services/descuento.services";
import ModalCharge from "../../modal/modalCharge";
import { resolveTimeFormat } from "@mui/x-date-pickers/internals/utils/time-utils";

const RegistroDescuento = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [isModalSalarioOpen, setIsModalDescuentoOpen] = useState(false);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const { descripcion, monto, id } = values;

    const valuesToSend = {
      ...values,
      // id,
      descripcion,
      monto,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await PostDatosDescuento(valuesToSend);
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
      <Header title="Registro Descuento" subtitle="Registro Descuento" />

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
          // id: "",
          descripcion: "",
          monto: "",
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
              sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
            >
              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id || ""}
                name="id"
                error={!!touched.id && !!errors.id}
                helperText={touched.id && errors.id}
                sx={{ gridColumn: "span 1" }}
                onClick={() => setIsModalSalarioOpen(true)}
                InputProps={{
                  readOnly: true,
                }}
              /> */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Monto"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.monto || ""}
                name="monto"
                error={!!touched.monto && !!errors.monto}
                helperText={touched.monto && errors.monto}
                sx={{ gridColumn: "span 4" }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Descripción"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.descripcion || ""}
                name="descripcion"
                error={!!touched.descripcion && !!errors.descripcion}
                helperText={touched.descripcion && errors.descripcion}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Registrar
              </Button>
            </Box>

            {/* Modal para seleccionar el salario */}
            {/* <ModalSalario
              open={isModalSalarioOpen}
              onClose={() => setIsModalSalarioOpen(false)}
              onSelectSalario={(salario) => {
                // Actualiza los campos del formulario con el salario seleccionado
                // setFieldValue("id", salario.id);
                setFieldValue("descripcion", salario.descripcion);
                setFieldValue("monto", salario.monto);
                setIsModalSalarioOpen(false);
              }}
            /> */}

            <ModalCharge isLoading={isLoading}/>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  // id: yup.number().required("ID requerido"),
  descripcion: yup.string().required("Descripción requerida"),
  monto: yup.string().required("Monto requerido"), // Puedes ajustar esto según cómo manejes el monto
});

export default RegistroDescuento;