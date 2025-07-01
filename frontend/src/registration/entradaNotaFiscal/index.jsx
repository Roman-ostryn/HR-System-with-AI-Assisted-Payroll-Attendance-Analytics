import React, { useState, useEffect, useRef } from "react";
import { Formik, useFormik } from "formik";
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
import ModalProducto from "../../modal/producto/modalProveedorProducto";
import ModalProveedor from "../../modal/proveedor/modalProveedor";
import ModalCaballete from "../../modal/caballete/modalCaballete";
import ModalCamion from "../../modal/camiones/modalCamion";
import Header from "../../components/Header";
import {
  getOneDatos,
  PostDatos,
  getOneDatosTicket,
} from "../../services/entradaNotaFiscal.services";
// import dayjs from "dayjs";
// import QRCode from "qrcode";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PvbNotaFiscal = () => {
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [proveedor, setProveedor] = useState("");
  const [serviceType, setServiceType] = useState(1);
  const [products, setProducts] = useState([]);
  const initialRows = [{ id: 1, items: [{ id: '', serie: '', cantidad2: '' },], caballet: [], producto: { cod: "", descripcion: "", cantidad: "" } }];
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [cantidad, setCantidad] = useState(0); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState(""); // Estado para guardar posibles errores
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [modalProveedorOpen, setModalProveedorOpen] = useState(false);
  const [modalCamionOpen, setModalCamionOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [serieValue, setSerieValue] = useState("");
  const USER = localStorage.getItem("id");
  const Cod_empresa = localStorage.getItem("cod_empresa") || 1;
  const formikRef = useRef(null); 
  const initialValues = {
    id_proveedor: "",
    numeroNota: "",
    modelo: "",
    operacion: "",
    formaDePago: "",
    condicionPago: "",
    id_vehiculo: "",
    id_producto: "",
    id_proveedor: "",
    cantidad: "",
    descripcion: "",
    cod: "",
    caballet: [{ caballete: "" }],
    cantidad2: "",
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    
    setIsLoading(true);
    const valuesToSend = {
      cod_empresa: parseInt(Cod_empresa) || 1,
      id_proveedor: values.id_proveedor,
      numeroNota: values.numeroNota,
      modelo: values.modelo,
      operacion: values.operacion,
      formaDePago: values.formaDePago,
      condicionPago: values.condicionPago,
      id_vehiculo: values.id_vehiculo,
      id_producto: "Vidrio",
      cantidad_total: cantidad || 0,
      id_usuario: parseInt(USER),
      data: products.flatMap((product) =>
        product.items.map((item, itemIndex) => ({
          cod: product.producto.cod || "",
          cod_empresa: parseInt(Cod_empresa) || 1,
          descripcion: product.producto.descripcion,
          cantidad: parseInt(item.cantidad2) || 0,
          medidas: product.producto?.medidas || "",
          id_caballete: product.caballet[itemIndex] || "", // Asignando un valor fijo o variable
          obs: "", // Observación vacía
          serie: item.serie || "",
          cantidad_entrada: parseInt(item.cantidad2) || 0, // Usando la propiedad `cantidad2` de cada item
          id_proveedor: values.id_proveedor,
          id_categoria: product.producto?.id_categoria || "",
          id_usuario: parseInt(USER),
        }))
      ),
    };
    // console.log("🚀 ~ handleFormSubmit ~ valuesToSend:", valuesToSend)

    try {
      // Validar cada producto
      let isValid = true;
  
      for (const product of products) {
        const totalCantidadItems = product.items.reduce(
          (sum, item) => sum + parseInt(item.cantidad2 || 0),
          0
        );
  
        const cantidadProducto = parseInt(product.cantidad) || 0; // Cantidad total del producto
        if (cantidadProducto !== totalCantidadItems) {
          isValid = false;
          toast.error(
            `La cantidad del producto ${product.producto.cod} no coincide con la suma de sus ítems. Total Producto: ${cantidadProducto}, Suma Ítems: ${totalCantidadItems}`,
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          break; // Detener la validación si hay un error
        }
      }
  
      // Enviar los datos si todos los productos son válidos
      if (isValid) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
  
        const response = await PostDatos(valuesToSend);
        const { id } = response.resp;
  
        // setProducts(initialRows);
        setRegistrationSuccess(true);
        // resetForm(); // Restablecer el formulario después de enviar
      }
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

  useEffect(() => {
    setServiceType(proveedor);
  }, [proveedor]);

  const handleSelectProducto = (producto, setFieldValue, productIndex) => {
    if (productIndex !== undefined && productIndex >= 0) {
      setSerieValue(producto);
      setFieldValue(`products[${productIndex}].producto`, producto); // Esto actualiza el valor en Formik

      const updatedProducts = [...products];
      updatedProducts[productIndex].producto = producto;
      setProducts(updatedProducts);
    } else {
      console.error("productIndex no está definido o es inválido");
    }
  };

  const openModalProveedor = () => {
    setModalProveedorOpen(true); // Abrir modal de productos
  };

  const handleSelectProveedor = (proveedor, setFieldValue) => {
    // console.log("🚀 ~ handleSelectProveedor ~ proveedor.id:", proveedor.id)
    setFieldValue("id_proveedor", proveedor.id);
    setProveedor(proveedor.id)

    setModalProveedorOpen(false); // Cerrar el modal de productos
  };

  const openModalCamion = () => {
    setModalCamionOpen(true); // Abrir modal de productos
  };

  const handleCaballeteSelect = (productIndex, itemIndex, caballete) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];

      // Verifica si el índice es válido
      if (!updatedProducts[productIndex].caballet) {
        updatedProducts[productIndex].caballet = []; // Si no existe, inicializa el array
      }

      if (!updatedProducts[productIndex].caballet[itemIndex]) {
        updatedProducts[productIndex].caballet[itemIndex] = { caballete: "" }; // Inicializa el objeto si no existe
      }

      // Asigna el nuevo valor
      updatedProducts[productIndex].caballet[itemIndex] = caballete.id;

      return updatedProducts;
    });
  };

  const handleSelectCamion = (Camion, setFieldValue) => {
    setFieldValue("id_vehiculo", Camion.id);
    setModalCamionOpen(false); // Cerrar el modal de productos
  };

  // Actualizar los datos de un producto específico
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
    actualizarCantidadTotal(updatedProducts);
  };

  // Actualizar datos de un item específico de un producto
  const handleItemChange = (productIndex, itemIndex, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].items[itemIndex][field] = value;
    setProducts(updatedProducts);
  };

  // Eliminar un item específico de un producto
  const handleRemoveItem = (productIndex, itemIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].items = updatedProducts[
      productIndex
    ].items.filter((_, i) => i !== itemIndex);
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { producto: "", cantidad: "", items: [] }, // Producto inicial
    ]);
  };

  // Eliminar un producto
  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    actualizarCantidadTotal(updatedProducts);
  };

  const actualizarCantidadTotal = (productos) => {
    const total = productos.reduce((sum, prod) => {
      const cantidad = parseFloat(prod.cantidad);
      return sum + (isNaN(cantidad) ? 0 : cantidad);
    }, 0);
    console.log("🚀 ~ total ~ total:", total)
    setCantidad(total);
  };
  

  const openModalCaballete = (productIndex, itemIndex) => {
    // Asegúrate de que ambos índices estén correctamente definidos
    setSelectedProductIndex(productIndex);
    setSelectedItemIndex(itemIndex);
    setModalOpen(true);
  };

  // Función para agregar un nuevo item
  const handleAddItem = (productIndex) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];

      // Generar un nuevo id autoincremental basado en el último id de los items existentes
      const lastItemId = updatedProducts[productIndex].items.length
        ? updatedProducts[productIndex].items[
            updatedProducts[productIndex].items.length - 1
          ].id
        : 0;

      // Crear un nuevo item con un id autoincremental
      const newItem = {
        id: lastItemId + 1, // Incrementar el id basado en el último item
        serie: "", // Valor inicial
        cantidad2: "",
        caballet: "", // Valor inicial
      };

      updatedProducts[productIndex].items.push(newItem); // Agregar el nuevo item al producto

      return updatedProducts;
    });
  };

  return (
    <Box sx={{ padding: "20px", height: "80vh", overflowY: "auto" }}>
      <Header title="Entrada Nota Fiscal" subtitle="Entrada Vidrio" />
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
                label="Proveedor"
                value={values.id_proveedor}
                name="id_proveedor"
                error={!!touched.id_proveedor && !!errors.id_proveedor}
                helperText={touched.id_proveedor && errors.id_proveedor}
                InputProps={{
                  readOnly: true,
                }}
                onClick={openModalProveedor}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nota Fiscal N°"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e); // Llama el handleChange normal de Formik
                }}
                value={values.numeroNota}
                name="numeroNota"
                error={!!touched.numeroNota && !!errors.numeroNota}
                helperText={touched.numeroNota && errors.numeroNota}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Modelo"
                name="modelo"
                value={values.modelo}
                onChange={handleChange}
                error={!!touched.modelo && !!errors.modelo}
                helperText={touched.modelo && errors.modelo}
                select // Esta propiedad convierte el TextField en un select
              >
                {/* Opciones del select */}
                <MenuItem value="Documento No Fiscal">
                  Documento No Fiscal
                </MenuItem>
                <MenuItem value="Nota Fiscal Electronica">
                  Nota Fiscal Electronica
                </MenuItem>
                <MenuItem value="Nota Fiscal Electronica Consumidor">
                  Nota Fiscal Electronica Consumidor
                </MenuItem>
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                label="Operacion"
                name="operacion"
                value={values.operacion}
                onChange={handleChange}
                error={!!touched.operacion && !!errors.operacion}
                helperText={touched.operacion && errors.operacion}
                select // Esta propiedad convierte el TextField en un select
              >
                {/* Opciones del select */}
                <MenuItem value="Entrada materia prima">
                  Entrada Materia prima
                </MenuItem>
                <MenuItem value="Sim Entrada">Sin Entrada</MenuItem>
              </TextField>

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
                      onClick={() => openModalProducto(productIndex)}
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
                  <Grid item xs={1}>
                    <IconButton
                      color="secondary"
                      onClick={() => removeProduct(productIndex)}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>

                {/* Agregar Item */}
                <Box display="flex" alignItems="center" mt={2}>
                  <IconButton
                    color="secondary"
                    sx={{ paddingLeft: "20vh" }}
                    onClick={() => handleAddItem(productIndex)}
                  >
                    <AddCircleIcon />
                  </IconButton>
                  <Typography variant="body1" sx={{ marginLeft: "0.5vw" }}>
                    Item
                  </Typography>
                </Box>

                {/* Items del Producto */}
                {product.items.map((item, itemIndex) => (
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    key={itemIndex}
                    sx={{ marginTop: "5px", paddingLeft: "21vh" }}
                  >
                    <Grid item xs={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="ID"
                        value={item.id} // Mostrar el ID autoincremental
                        InputProps={{
                          readOnly: true, // Solo lectura
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Serie"
                        value={item.serie}
                        onChange={(e) =>
                          handleItemChange(
                            productIndex,
                            itemIndex,
                            "serie",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={2.3}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Cantidad"
                        value={item.cantidad2}
                        onChange={(e) =>
                          handleItemChange(
                            productIndex,
                            itemIndex,
                            "cantidad2",
                            e.target.value
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Almacenamiento"
                        value={
                          // Accede directamente al `id` del caballete si está disponible
                          Array.isArray(product.caballet) &&
                          product.caballet[itemIndex]
                            ? product.caballet[itemIndex] // Aquí ya solo guardamos el id
                            : "" // Si no hay `caballet`, deja el valor vacío
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        onClick={() =>
                          openModalCaballete(productIndex, itemIndex)
                        }
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <IconButton
                        color="secondary"
                        onClick={() =>
                          handleRemoveItem(productIndex, itemIndex)
                        }
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
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
              } // Lógica para seleccionar productos
              serviceType={serviceType}
            />

            <ModalCaballete
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onSelect={(caballete) =>
                handleCaballeteSelect(
                  selectedProductIndex,
                  selectedItemIndex,
                  caballete
                )
              }
              serviceType={1}
            />

            <ModalProveedor
              open={modalProveedorOpen} // Estado del modal de proveedors
              onClose={() => setModalProveedorOpen(false)} // Cerrar el modal de Proveedors
              onSelect={(proveedor) =>
                handleSelectProveedor(proveedor, setFieldValue)
              } // Lógica para seleccionar productos
            />

            <ModalCamion
              open={modalCamionOpen} // Estado del modal de Camions
              onClose={() => setModalCamionOpen(false)} // Cerrar el modal de Camions
              onSelectVehiculos={(Camion) =>
                handleSelectCamion(Camion, setFieldValue)
              } // Lógica para seleccionar productos
            />
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  numeroNota: yup.string().required("Requerido"),
  formaDePago: yup.string().required("Requerido"),
});

export default PvbNotaFiscal;
