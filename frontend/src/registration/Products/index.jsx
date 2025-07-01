import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import { PostDatos } from "../../services/garden.services";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalCharge from "../../modal/modalCharge";
import ModalError from "../../modal/modalError";
import ModalClients from "../../modal/owner/modalClients";

const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [ModalClient, setModalClient] = useState(false);
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState({ id: "", nombre: "" });
  const [initialValues, setInitialValues] = useState({
    id_categoria: "",
    categoria: "",
    id_marca: "",
    marca: "",
    id_proveedor: "",
    proveedor: "",
    cantidad: "",
    cantidad_anterior: "",
  });

  useEffect(() => {
    const prevInitialValues = initialValues;
    if (initialValues !== prevInitialValues) {
      // Volver a renderizar el componente al actualizar initialValues
    }
  }, [initialValues]);

  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values) => {
    const { categoria, marca, proveedor, ...valuesWithoutNombre } = values;
    const valuesToSend = {
      ...valuesWithoutNombre,
    };

    // PostData(valuesToSend);
  };

  const PostData = async (valuesToSend) => {
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 3000));
    //   const response = await PostDatos(valuesToSend);
    //   const responseData = await response;
    //   setIsLoading(false);
    //   setRegistrationSuccess(true);
    // } catch (error) {
    //   console.error("error sending data", error);
    //   setIsLoading(false);
    //   setRegistrationError(true);
    //   setError(error.message);
    // }
  };

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
    resetForm();
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setInitialValues({
      ...initialValues,
      id_propietario: client.id,
      nombre: client.nombre,
    });
  };

  const resetForm = () => {
    setInitialValues({
      id_categoria: "",
      categoria: "",
      id_marca: "",
      marca: "",
      id_proveedor: "",
      proveedor: "",
      cantidad: "",
      cantidad_anterior: "",
    });
  };

  // useEffect(() => {
  //   setInitialValues({
  //     id_propietario: selectedClient.id,
  //     nombre: selectedClient.nombre,
  //     abono: "",
  //     fumigacion: "",
  //     vestringias: "",
  //     abono_universal: "",
  //     entrada: null,
  //     salida: null,
  //   });
  // }, [selectedClient]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F9" || (event.key === "Tab" && document.activeElement.name === "id_propietario")) {
        setModalClient(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Box m="20px">
      <Header title="REGISTRO DE PRODUCTOS" subtitle="Registro de Productos" />

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
                label="Id_Categoria"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_categoria}
                name="id_categoria"
                error={!!touched.id_categoria && !!errors.id_categoria}
                helperText={touched.id_categoria && errors.id_categoria}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Categoria"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.categoria}
                name="categoria"
                error={!!touched.categoria && !!errors.categoria}
                helperText={touched.categoria && errors.categoria}
                sx={{ gridColumn: "span 3" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id_Marca"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_marca}
                name="id_marca"
                error={!!touched.id_marca && !!errors.id_marca}
                helperText={touched.id_marca && errors.id_marca}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Marca"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.marca}
                name="marca"
                error={!!touched.marca && !!errors.marca}
                helperText={touched.marca && errors.marca}
                sx={{ gridColumn: "span 3" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id_proveedor"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_proveedor}
                name="id_proveedor"
                error={!!touched.id_proveedor && !!errors.id_proveedor}
                helperText={touched.id_proveedor && errors.id_proveedor}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Proveedor"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.proveedor}
                name="proveedor"
                error={!!touched.proveedor && !!errors.proveedor}
                helperText={touched.proveedor && errors.proveedor}
                sx={{ gridColumn: "span 3" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cantidad"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cantidad}
                name="cantidad"
                error={!!touched.cantidad && !!errors.cantidad}
                helperText={touched.cantidad && errors.cantidad}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cantidad_Ant"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cantidad_anterior}
                name="cantidad_anterior"
                error={!!touched.cantidad_anterior && !!errors.cantidad_anterior}
                helperText={touched.cantidad_anterior && errors.cantidad_anterior}
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
      <ModalError open={registrationError} onClose={handleCloseModalError} error={error} />
      {/* <ModalClients open={ModalClient} onClose={() => setModalClient(false)} onSelectClient={handleSelectClient} /> */}
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  id_categoria: yup.string().required("required"),
  categoria: yup.string().required("required"),
  id_marca: yup.string().required("required"),
  marca: yup.string().required("required"),
  id_proveedor: yup.string().required("required"),
  proveedor: yup.string().required("required"),
  cantidad: yup.string().required("required"),
  cantidad_anterior: yup.string().required("required"),
});

export default Products;
