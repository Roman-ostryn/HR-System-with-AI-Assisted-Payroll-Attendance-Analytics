import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import { PostDatosOrdenProduccion, getUltimaOrden, getVerificarStock } from "../../services/ordenProduccion.services";
import ModalCharge from "../../modal/modalCharge";
import ModalProducto from "../../modal/producto/modalProducto";
import ModalStock from "../../modal/producto/modalStock";


const OrdenProduccion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [modalStockOpen, setModalStockOpen]= useState(false);
  const [ultimaOrden, setUltimaOrden] = useState(""); // Estado para almacenar la última orden
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedRegistro, setSelectedRegistro] = useState(null);

  const fetchUltimaOrden = async () => {
    try {
      const response = await getUltimaOrden(); // Llamada al servicio
      setUltimaOrden( response.orden + 1 || ""); // Actualiza el estado con la última orden
    } catch (err) {
      console.error("Error obteniendo la última orden", err);
    }
  };

  useEffect(() => {
    fetchUltimaOrden();
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    setSelectedRegistro(values);
    try {
      const { cantidad, descripcion_producto } = values;
      // Llamamos al servicio para obtener el stock
      
      const response = await getVerificarStock(descripcion_producto);
    
      // if (!Array.isArray(response) || response.length === 0) {
      //   throw new Error(response);
      // }
      
      let success = false;
    
      for (const producto of response) {
        const { cod, cantidad: stockCantidad, reservado, cantidad_entrada } = producto;
    
        if (parseInt(stockCantidad) >= parseInt(cantidad)) {
          console.log(`Producto ${cod} tiene suficiente stock.`);
          success = true;
          break; // Salimos del bucle al encontrar un producto con suficiente stock
        } else {
          console.log(`Producto ${cod} no tiene suficiente stock.`);
          setModalStockOpen(true); // Abrimos el modal
          success = false;
          break; // Salimos del bucle al encontrar un producto sin stock
        }
      }
      if (success) {
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        // await PostDatosOrdenProduccion(valuesToSend);
        // setRegistrationSuccess(true);
        setModalStockOpen(true); // Abrimos el modal

        resetForm();
      }else{
        setModalStockOpen(true); // Abrimos el modal
      }
    } catch (error) {
      console.error("Error enviando datos", error);
      setRegistrationError(true);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        fetchUltimaOrden();
      }, 2000);
    }}
    

  // const handleFormSubmit = async (values, { resetForm }) => {
  //   setIsLoading(true);
  //   setSelectedRegistro(values); // Guarda los valores en el estado temporal
  
  //   try {
  //     const { cantidad, descripcion_producto } = values;
  
  //     // Llamamos al servicio para verificar el stock del producto
  //     const response = await getVerificarStock(descripcion_producto);
  
  //     // Verificar si la respuesta es un array válido
  //     if (!Array.isArray(response) || response.length === 0) {
  //       throw new Error(response);
  //     }
  
  //     let success = false;
  
  //     // Validar si algún producto tiene stock suficiente
  //     for (const producto of response) {
  //       const { cod, cantidad: stockCantidad } = producto;
  
  //       if (parseInt(stockCantidad, 10) >= parseInt(cantidad, 10)) {
  //         console.log(`Producto ${cod} tiene suficiente stock.`);
  //         success = true;
  //         break; // Salimos del bucle al encontrar stock suficiente
  //       } else {
  //         console.log(`Producto ${cod} no tiene suficiente stock.`);
  //       }
  //     }
  
  //     if (success) {
  //       // Stock suficiente: realizar la operación de creación
  //       await PostDatosOrdenProduccion(values); // Llamada al servicio de creación
  //       setRegistrationSuccess(true); // Mostrar modal de éxito
  //       resetForm(); // Reiniciar el formulario
  //     } else {
  //       // Stock insuficiente: mostrar modal de advertencia
  //       setModalStockOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Error durante el envío del formulario:", error);
  //     setRegistrationError(true);
  //     setError(error.message || "Ocurrió un error desconocido.");
  //   } finally {
  //     // Finaliza el estado de carga
  //     setTimeout(() => {
  //       setIsLoading(false);
  //       fetchUltimaOrden(); // Actualiza el número de orden
  //     }, 2000);
  //   }
  // };
  

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };
  
  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const openModalProducto = () => {
    setModalProductoOpen(true); // Abrir modal de productos
  };

  const handleSelectProducto = (producto, setFieldValue) => {
    setFieldValue("id_producto", producto.id);
    setFieldValue("descripcion_producto", producto.cod); // Asigna el código del paquete
    setModalProductoOpen(false); // Cerrar el modal de productos
  };

  const openModalStock = () => {
    setModalStockOpen(true); // Abrir modal de Stocks
  };

  const closeModalStock = () => {
    setModalStockOpen(false); // Cerramos el modal
    setSelectedRegistro(null); // Limpiamos el registro seleccionado
    fetchUltimaOrden()
  };
  

  return (
    <Box m="20px">
      <Header title="ORDEN DE PRODUCCION" subtitle="Crear Orden Produccion" />
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
          orden: ultimaOrden, // Utiliza el valor obtenido en el efecto
          id_producto: "",
          cantidad: "",
          id_proveedor: "",
        }}
        validationSchema={checkoutSchema}
        enableReinitialize // Permite que los valores iniciales cambien dinámicamente
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => {
          return (
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
                  label="Producto"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.descripcion_producto || ""}
                  name="id_producto"
                  error={!!touched.id_producto && !!errors.id_producto}
                  helperText={touched.id_producto && errors.id_producto}
                  sx={{ gridColumn: "span 2" }}
                  onClick={openModalProducto} // Abre el modal para seleccionar el producto
                  InputProps={{
                    readOnly: true, // Solo se puede seleccionar mediante el modal
                  }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Cantidad"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.cantidad || ""}
                  name="cantidad"
                  error={!!touched.cantidad && !!errors.cantidad}
                  helperText={touched.cantidad && errors.cantidad}
                  sx={{ gridColumn: "span 2" }}
                />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Crear Orden
                </Button>
              </Box>
              <ModalProducto
                open={modalProductoOpen} // Estado del modal de productos
                onClose={() => setModalProductoOpen(false)} // Cerrar el modal de productos
                onSelectProduct={(producto) =>
                  handleSelectProducto(producto, setFieldValue)
                }
                serviceType={1}
              />
              <ModalStock
                open={modalStockOpen} // Estado del modal
                onClose={closeModalStock} // Lógica para cerrar el modal
                registro={selectedRegistro} // Registro seleccionado para mostrar en el modal
              />
              <ModalCharge isLoading={isLoading} />
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  orden: yup.string().required("Descripción requerida"),
  id_producto: yup.number().required("ID requerido"),
});

export default OrdenProduccion;