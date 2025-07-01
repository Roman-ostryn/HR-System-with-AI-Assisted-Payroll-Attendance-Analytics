import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import { tokens } from "../../theme";
import ModalCharge from "../../modal/modalCharge";
import ModalProducto from "../../modal/producto/modalProducto";
import ModalCliente from "../../modal/cliente/modalCliente";
import ModalCamion from "../../modal/camiones/modalCamion";
import Header from "../../components/Header";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getPrecioProducto} from "../../services/precio.services"
import {PostDatosPedidoVenta} from "../../services/pedidoVenta.services"



const PedidoVenta = () => {
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [pais, setPais] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [modalClienteOpen, setModalClienteOpen] = useState(false);
  const [modalCamionOpen, setModalCamionOpen] = useState(false);
  // const [modalOpen, setModalOpen] = useState(false);
  // const [serieValue, setSerieValue] = useState("");
  const USER = localStorage.getItem("id");
  const Cod_empresa = localStorage.getItem("cod_empresa") || 1;
  const formikRef = useRef(null); // useRef en lugar de useState
  const initialValues = {
    id_cliente: "",
    pais_cliente: "",
    precio: "",
    modelo: "",
    operacion: "",
    formaDePago: "",
    condicionPago: "",
    id_vehiculo: "",
    id_producto: "",
    descripcion_cliente: "",
    cantidad: "",
    descripcion: "",
    cod: "",
    // caballet: [{ caballete: "" }],
    cantidad2: "",
    products: [{ producto: "", cantidad: "", precio: "" }],
  };

  const handleFormSubmit = async (values, {resetForm}) => {
    setIsLoading(true);

    const valuesToSend = {
      cod_empresa: parseInt(Cod_empresa) || 1,
      id_cliente: values.id_cliente,
      formaDePago: values.formaDePago,
      id_usuario: parseInt(USER),
      id_vehiculo: values.id_vehiculo,
      data: products.map(item => ({
        id_producto: item.producto.id,
        precio: item.precio,
        cantidad: item.cantidad, // Tomar la cantidad fuera de producto
        id_cliente: values.id_cliente,
      }))
    };
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await PostDatosPedidoVenta(valuesToSend);
      // const { id } = response.resp;      
      setRegistrationSuccess(true);
      setProducts([]); // Limpiar los productos después de enviar el formulario
      resetForm();
    } catch (error) {
      console.error("Error al enviar los datos", error);
      setRegistrationError(true);
      setIsLoading(false);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };



  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const openModalProducto = (index) => {
    setSelectedProductIndex(index); // Guardar el índice seleccionado
    setModalProductoOpen(true);
  };

  const handleSelectProducto = async (producto, setFieldValue, productIndex) => {
    // Verificamos si productIndex es válido
    if (productIndex !== undefined && productIndex >= 0) {
      // Establecemos el producto seleccionado en el formulario
      setFieldValue(`products[${productIndex}].producto`, producto);
  
      const descripcionCorta = producto.descripcion.split(" ").slice(0, 2).join(" ");
  
      let tipoProducto = descripcionCorta === "VIDRO LAMINADO" ? "LAMINADO" : "MONOLITICO";
  
      // Obtenemos el precio del producto y lo asignamos a un valor predeterminado
      const precio = await handlePrecioProducto(pais, tipoProducto, setFieldValue, productIndex);
  
      // Aseguramos que cada producto tiene propiedades predeterminadas
      const updatedProducts = [...products];
  
      // Si el producto no existe en la posición indicada, inicializamos el objeto
      if (!updatedProducts[productIndex]) {
        updatedProducts[productIndex] = { producto: null, precio: "" };  // Inicializa con un producto vacío
      }
  
      // Actualizamos el producto en la posición correcta
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        producto: producto,
        precio: precio || "", // Si el precio no es encontrado, asignamos un valor vacío
      };
  
      setProducts(updatedProducts);
    } else {
      console.error("productIndex no está definido o es inválido");
    }
  };
  
const handlePrecioProducto = async (pais, producto, setFieldValue, productIndex) => {
  try {
    const response = await getPrecioProducto(pais, producto);  
    if (Array.isArray(response) && response.length > 0) {
      const data = response[0]; // Tomar el primer elemento del array
      if (data && data.precio !== undefined) {
        setFieldValue(`products[${productIndex}].precio`, data.precio);
        return data.id; // Devolvemos el precio para usarlo en handleSelectProducto
      } else {
        console.error("🚨 No se encontró el precio en la respuesta:", data);
        return null; // Si no encontramos precio, devolvemos null
      }
    } else {
      toast.error(
        `🚨 NO SE A REGISTRADO PRECIO PARA ${producto} EN ${pais}`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      console.error(`🚨 NO SE A REGISTRADO PRECIO PARA ${producto} EN ${pais}`);
      return null; // Si no hay respuesta válida, devolvemos null
    }
  } catch (error) {
    console.error("Error obteniendo el precio:", error);
    return null; // Si ocurre un error, devolvemos null
  }
};

  const openModalCliente = () => {
    setModalClienteOpen(true); // Abrir modal de productos
  };

  const handleSelectCliente = (cliente, setFieldValue) => {
    setFieldValue("id_cliente", cliente.id);
    setFieldValue("descripcion_cliente", cliente.descripcion);
    setPais(cliente.pais);

    setModalClienteOpen(false); // Cerrar el modal de productos
  };

  const openModalCamion = () => {
    setModalCamionOpen(true); // Abrir modal de productos
  };

  const handleSelectCamion = (Camion, setFieldValue) => {
    setFieldValue("id_vehiculo", Camion);
    setModalCamionOpen(false); // Cerrar el modal de productos
  };

  // Actualizar los datos de un producto específico
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { producto: "", cantidad: "", precio:""}, // Producto inicial
    ]);
  };

  // Eliminar un producto
  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <Box sx={{ padding: "20px", height: "80vh", overflowY: "auto" }}>
      <Header title="Pedido de Venta" subtitle="Pedido de Venta" />
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
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
        innerRef={formikRef} // Utilizamos ref para evitar ciclo de actualización
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
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
                "& .MuiOutlinedInput-root": {
                  color: `${colors.grey[100]} !important`,
                },
                "& .MuiOutlinedInput-root.MuiOutlinedInput-notchedOutline": {
                  border: "none",
                  background: `${colors.primary[950]} !important`,
                  borderBottom: `1px solid ${colors.grey[100]} !important`,
                },
                "& .MuiInputBase-input": {
                  color: `${colors.grey[100]} !important`,
                },
                "& .MuiInputLabel-root": {
                  color: `${colors.grey[100]} !important`,
                },
                "& .MuiSvgIcon-root": {
                  color: `${colors.grey[100]} !important`,
                  zIndex: 10,
                },
                "& .MuiInputLabel-root": {
                  zIndex: 200,
                  color: `${colors.grey[100]} !important`,
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12px",
                  zIndex: 100,
                },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cliente"
                value={values.descripcion_cliente}
                name="id_cliente"
                error={!!touched.id_cliente && !!errors.id_cliente}
                helperText={touched.id_cliente && errors.id_cliente}
                InputProps={{
                  readOnly: true,
                }}
                onClick={openModalCliente}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Forma de Pago"
                value={values.formaDePago}
                name="formaDePago"
                onChange={handleChange}
                error={!!touched.formaDePago && !!errors.formaDePago}
                helperText={touched.formaDePago && errors.formaDePago}
                select
              >
                {/* Opciones del select */}
                <MenuItem value="Efectivo">Efectivo</MenuItem>
                <MenuItem value="Cheque">Cheque</MenuItem>
                <MenuItem value="Transferencia Internacional">
                  Transferencia Internacional
                </MenuItem>
                <MenuItem value="Transferencia Bancaria">
                  Transferencia Bancaria
                </MenuItem>
                <MenuItem value="Pagare">Pagare</MenuItem>
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Condicion de Pago"
                value={values.condicionPago}
                onChange={handleChange}
                name="condicionPago"
                error={!!touched.condicionPago && !!errors.condicionPago}
                helperText={touched.condicionPago && errors.condicionPago}
                select
              >
                {/* Opciones del select */}
                <MenuItem value="Contado">Contado</MenuItem>
                <MenuItem value="30 dias">30 dias </MenuItem>
                <MenuItem value="30/60 dias">30/60 dias</MenuItem>
                <MenuItem value="90 dias">90 dias</MenuItem>
                <MenuItem value="180 dias">180 dias</MenuItem>
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Vehiculo"
                value={values.id_vehiculo}
                name="id_vehiculo"
                error={!!touched.id_vehiculo && !!errors.id_vehiculo}
                helperText={touched.id_vehiculo && errors.id_vehiculo}
                InputProps={{
                  readOnly: true,
                }}
                onClick={openModalCamion}
              />
            </Box>
            <Box display="flex" alignItems="center" mb={2} sx={{marginTop:"1vw"}}>
              <IconButton color="secondary" onClick={addProduct}>
                <AddCircleIcon />
              </IconButton>
              <Typography variant="body1">Agregar Producto</Typography>
            </Box>

            {products.map((product, productIndex) => (
              <Box
                key={productIndex}
                mt={2}
                sx={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "8px",
                  paddingLeft: "2vh",
                }}
              >
                {/* Producto y Cantidad */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Producto"
                      value={product.producto.cod || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                      onClick={() => {
                        if(values.id_cliente != ""){
                          openModalProducto(productIndex)
                        }}}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Cantidad"
                      value={product.cantidad}
                      onChange={(e) =>
                        handleProductChange(
                          productIndex,
                          "cantidad",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                  <TextField
                  fullWidth
                  variant="outlined"
                  type="number"
                  label="Precio"
                  name={`products[${productIndex}].precio`} // Asegúrate de que el campo sea accesible
                  value={product.precio || ""}
                  onChange={(e) => handleProductChange(productIndex, 'precio', e.target.value)} // Actualiza correctamente el precio
                  error={!!touched.products?.[productIndex]?.precio && !!errors.products?.[productIndex]?.precio}
                  helperText={touched.products?.[productIndex]?.precio && errors.products?.[productIndex]?.precio}
                  InputProps={{
                    readOnly: true,
                  }}
                  />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="secondary"
                      onClick={() => removeProduct(productIndex)}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Box
              sx={{ paddingRight: "2%", paddingTop: "3%", paddingBottom: "3%" }}
              className="wrap"
            >
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{
                  backgroundColor: "rgb(206, 220, 0)",
                  border: "none",
                  color: "black",
                  height: "7vh",
                  width: "10vw",
                  borderRadius: "20px",
                  cursor: "pointer",
                  marginRight: "1vw",

                  "&:hover": { backgroundColor: "#bac609" },
                }}
              >
                Registrar
              </Button>
            </Box>

            <ModalCharge isLoading={isLoading} />
            <ModalProducto
              open={modalProductoOpen} // Estado del modal de productos
              onClose={() => setModalProductoOpen(false)} // Cerrar el modal de productos
              onSelectProduct={(producto) =>
                handleSelectProducto(
                  producto,
                  setFieldValue,
                  selectedProductIndex
                )
              } 
            />

            <ModalCliente
              open={modalClienteOpen} // Estado del modal de clientes
              onClose={() => setModalClienteOpen(false)} // Cerrar el modal de clientes
              onSelect={(cliente) =>
                handleSelectCliente(cliente, setFieldValue)
              } // Lógica para seleccionar productos
            />

            <ModalCamion
              open={modalCamionOpen} // Estado del modal de Camions
              onClose={() => setModalCamionOpen(false)} // Cerrar el modal de Camions
              onSelectVehiculos={(Camion) =>
                handleSelectCamion(Camion.id, setFieldValue)
              } // Lógica para seleccionar productos
            />
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  id_cliente: yup.number().required("Requerido"),
  formaDePago: yup.string().required("Requerido"),
});

export default PedidoVenta;
