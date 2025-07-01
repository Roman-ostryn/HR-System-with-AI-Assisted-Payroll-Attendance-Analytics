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
import ModalCategoria from "../../modal/categoria/modalCategoria";

import { PostDatosProductos } from "../../services/productos.services";
import ModalProveedor from "../../modal/proveedor/modalProveedor";



// const SOCKET_URL = 'http://192.168.88.69:5004/'; // URL del servidor Socket.IO
// const socket = io(SOCKET_URL, {
//   withCredentials: true,
//   transports: ["websocket", "polling"],
//   query: {
//     token: localStorage.getItem("authToken"), // Pasar el token al conectarse
//   },
// });

const Productos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clasificacionModalOpen, setClasificacionModalOpen] = useState(false);
  const [proveedorModalOpen, setProveedorModalOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const { cod, descripcion, id_categoria, medidas, id_proveedor, codigo } = values;

    const valuesToSend = {
      ...values,
      cod,
      id_proveedor,
      codigo,
      descripcion,
      id_categoria,
      medidas,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await PostDatosProductos(valuesToSend);
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
      <Header title="Registro Productos" subtitle="Registro Productos" />

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
          id_proveedor: "",
          codigo: "",
          cod:"",
          descripcion:"",
          id_categoria:"",
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
                label="Proveedor"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_proveedor || ""}
                name="id_proveedor"
                error={!!touched.id_proveedor && !!errors.id_proveedor}
                helperText={touched.id_proveedor && errors.id_proveedor}
                sx={{ gridColumn: "span 2" }}
                onClick={() => setProveedorModalOpen(true)}

              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cod"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cod || ""}
                name="cod"
                error={!!touched.cod && !!errors.cod}
                helperText={touched.cod && errors.cod}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Alias"
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Id Categoria"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_categoria || ""}
                name="id_categoria"
                error={!!touched.id_categoria && !!errors.id_categoria}
                helperText={touched.id_categoria && errors.id_categoria}
                sx={{ gridColumn: "span 2" }}
                onClick={() => setClasificacionModalOpen(true)}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Medidas"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.medidas || ""}
                name="medidas"
                error={!!touched.medidas && !!errors.medidas}
                helperText={touched.medidas && errors.medidas}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Otros campos */}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Crear Producto
              </Button>
            </Box>

            <ModalCategoria
              open={clasificacionModalOpen}
              onClose={() => setClasificacionModalOpen(false)}
              onSelect={(field) => setFieldValue("id_categoria", field.id)} // Usa onSelect aquí y asegúrate de acceder al campo "id"
            />
            <ModalProveedor
              open={proveedorModalOpen}
              onClose={() => setProveedorModalOpen(false)}
              onSelect={(field) => setFieldValue("id_proveedor", field.id)} // Usa onSelect aquí y asegúrate de acceder al campo "id"
            />


          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  id_proveedor: yup.string().required("Proveedor del Producto requerido"),
  codigo: yup.string().required("Alias del Producto requerido"),
  cod: yup.string().required("Codigo del Producto requerida"),
  descripcion: yup.string().required("Descripción del Producto requerida"),
  id_categoria: yup.number().required("Categoria requerida"), // Agrega validación si es necesario
  medidas: yup.string().required("Medidas requerida"),
});

export default Productos;