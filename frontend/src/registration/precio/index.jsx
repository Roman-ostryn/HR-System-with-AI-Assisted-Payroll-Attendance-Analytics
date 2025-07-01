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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import io from "socket.io-client";
import { PostDatosPrecios } from "../../services/precios.services";
import ModalHorario from "../../modal/horarios/modalHorarios";
import ModalCharge from "../../modal/modalCharge";
import  ModalProductos from "../../modal/productos/modalProductos";

// const SOCKET_URL = 'http://192.168.88.69:5004/'; // URL del servidor Socket.IO
// const socket = io(SOCKET_URL, {
//   withCredentials: true,
//   transports: ["websocket", "polling"],
//   query: {
//     token: localStorage.getItem("authToken"), // Pasar el token al conectarse
//   },
// });

const Precios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalHorarioOpen, setIsModalHorarioOpen] = useState(false);
  const [isModalProductosOpen, setIsModalProductosOpen] = useState(false);
  const user = localStorage.getItem("id");
  const empresa = localStorage.getItem("cod_empresa") || 1;
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    const { descripcion, precio } = values;

    const valuesToSend = {
      descripcion: descripcion,
      precio: parseInt(precio),
      cod_empresa: parseInt(empresa),
      id_usuario: parseInt(user)
    };


    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await PostDatosPrecios(valuesToSend);
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
      <Header title="Registro Precios" subtitle="Registro Precios" />

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
          descripcion: "",
          monto: "", // Agregado esto si se usa en el formulario
          precio:""
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
                // onClick={() => setIsModalProductosOpen(true)} // Abre el modal para seleccionar el salario
                // InputProps={{
                //  readOnly: true, }} // Solo se puede seleccionar mediante el modal 
              />
              {/* <TextField
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
                sx={{ gridColumn: "span 2" }}
              /> */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Precio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.precio || ""}
                name="precio"
                error={!!touched.precio && !!errors.precio}
                helperText={touched.precio && errors.precio}
                sx={{ gridColumn: "span 2" }}
                // onClick={() => setIsModalHorarioOpen()} // Abre el modal para seleccionar el salario
                // InputProps={{
                //   readOnly: true, // Solo se puede seleccionar mediante el modal
                // }}
              />
              {/* Otros campos */}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button className="button-animation" type="submit" color="secondary" variant="contained">
                REGISTRAR
            </Button>
            </Box>
            {isModalHorarioOpen && (
              <ModalHorario
                open={isModalHorarioOpen}
                onClose={() => setIsModalHorarioOpen(false)}
                onSelectHorario={(horario) => {
                  setFieldValue("precio", horario.id); // Asigna el id del salario al campo id_salario
                  setIsModalHorarioOpen(false);
                }}
              />
            )}
              {/* {isModalProductosOpen && (
              <ModalProductos
                open={isModalProductosOpen}
                onClose={() => setIsModalProductosOpen(false)}
                onSelectProduct = {(productos) => {
                  setFieldValue("id_producto", productos.id); // Asigna el id del salario al campo id_salario
                  setIsModalProductosOpen(false);
                }}
              />
            )} */}
            <ModalCharge isLoading={isLoading} />
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
    descripcion: yup.string().required("Producto Requerido"),
    precio: yup.number().required("Precio Requerido").typeError("Solo números"),
});

export default Precios;