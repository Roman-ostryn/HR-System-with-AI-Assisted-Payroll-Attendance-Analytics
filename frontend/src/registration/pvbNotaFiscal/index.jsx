import React, { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, TextField, MenuItem, Typography, Grid, IconButton, InputLabel, Select, FormControl} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import { tokens } from '../../theme';
import ModalCharge from "../../modal/modalCharge";
import ModalProducto from "../../modal/pvb/modalPvbNF";
import ModalProveedor from "../../modal/proveedor/modalProveedor";
import ModalCaballete from "../../modal/caballete/modalCaballete";
import ModalCamion from "../../modal/camiones/modalCamion";
import Header from '../../components/Header';
import { getOneDatos, PostDatosPVB, getOneDatosTicket, getEntradaNotaFiscal } from '../../services/entradaNotaFiscal.services';
import dayjs from "dayjs";
import QRCode from 'qrcode'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EntradaNotaFiscal = () => {

  const [selectedProductIndex, setSelectedProductIndex] = useState([]);
  const [selectedCaballeteIndex, setSelectedCaballeteIndex] = useState([]);
  const [products, setProducts] = useState([]);
  const [caballet, setCaballet] = useState([]);
  const initialRows = [{ id: 1, serie: '', cantidad: '',codigo:'', alto: '', largo: '' }];
  const [rows, setRows] = useState([]); // Maneja las filas dinámicas
  const [cantidad, setCantidad] = useState(0); 
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState(''); // Estado para guardar posibles errores
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [modalProveedorOpen, setModalProveedorOpen] = useState(false);
  const [modalCamionOpen, setModalCamionOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCaballete, setSelectedCaballete] = useState(null);
  const [serieValue, setSerieValue] = useState('');
  const USER = localStorage.getItem('id');
  const Cod_empresa = localStorage.getItem('cod_empresa') || 1;
  const formikRef = useRef(null); // useRef en lugar de useState
  const initialValues = {
    id_proveedor: '',
    numeroNota: '',
    modelo: '',
    operacion: '',
    formaDePago: '',
    condicionPago: '',
    id_vehiculo: '',
    id_producto: '',
    id_proveedor: '',
    cantidad: '',
    descripcion: '',
    codigo:'',
    caballet: [
      { caballete: '' }, // Asegúrate de que los campos esperados estén inicializados
    ],
    cantidad2: '',
    alto: '',
    largo: '',
  };



  const options = [
    '',
    'PVBINC ARQ.A',
    'PVBINC ARQ.38',
    'PVBINC ARQ.76',
    'PVBOP ARQ.A',
    'PVBOP ARQ.38',
    'PVBOP ARQ.76',
    'PVBINC ACÚSTICO.38',
    'PVBAOUSTIC ACÚSTICO.76',
    'PVBMILKYWHITE MILKYWHITE.38',
  ];

const generateZPL = async (values) => {
    const qrImageUrl = await QRCode.toDataURL(values.serie, { errorCorrectionLevel: 'H' }).catch(error => {
    console.error('Error generando el QR:', error);
    return null; // Retorna null en caso de error
  });
  
  let zpl = `
  ^XA
  ^PW800        // Ancho de la etiqueta (400 puntos = 10 cm)
  ^LL400        // Longitud de la etiqueta (200 puntos = 5 cm)

  // Código en la parte superior, más grande
  ^FO85,40^A0N,30,30^FDNumero de Serie:${values.serie} ^FS

  ^FO500,40^A0N,30,35^FD${values.fecha}^FS

 ^FO85,120^A0N,30,30^FDCant. Chapa:^FS
 ^FO140,160^A0N,30,30^FD${values.cantidad}^FS

 ^FO380,120^A0N,30,30^FDCant. Utilizable:^FS
 ^FO380,160^A0N,30,30^FD${values.cantidad_entrada}^FS

  // ID Producción, fecha y serie
  //^FO85,220^A0N,30,30^FDProducto:^FS
  //^FO85,260^A0N,28,26^FD${values.descripcion}^FS

  // Código QR, más grande
  //^FO580,90^BQN,2,8^FDQA,${values.qrImageUrl}^FS

  ^XZ
`
  if (window.BrowserPrint) { // Asegúrate de que BrowserPrint está disponible
    window.BrowserPrint.getDefaultDevice("printer", 
    (device) => {
        if (device) {
        setPrinterInfo(`Dispositivo predeterminado encontrado: ${device.name}`);
        let zplCommand = zpl;

        // 3. Usar la función send para enviar los datos al dispositivo
        device.send(zplCommand, function(response) {
            console.log("Datos enviados exitosamente:", response);
        }, function(error) {
            console.error("Error al enviar datos:", error);
        });
        } else {
        setPrinterInfo("No hay una impresora predeterminada configurada.");
        }
    },
    (error) => {
        setErrorMessage(`Error al obtener el dispositivo predeterminado: ${error}`);
    }
    );
  } else {
    setErrorMessage('BrowserPrint no está disponible.');
  }

};

const getTicket = async (id) => {
  const response = await getOneDatosTicket(id);
  if (response) {
    const { descripcion, medidas, clasificacion, serie, modelo, motivo, create_at, cantidad, cantidad_entrada } = response;
    const fecha = dayjs(create_at).format("DD/MM/YYYY hh:mm");

    const ticketData = {
      serie: serie,
      fecha: fecha,
      cantidad: cantidad,
      cantidad_entrada: cantidad_entrada,
      descripcion: descripcion,
    };
    // Call function to print ticket
    generateZPL(ticketData);
  } else {
    console.error("No se encontró el ticket con el ID proporcionado");
  }
}

// const handleAddRow = () => {
//   setRows([...rows, { id: rows.length + 1, serie: '', cantidad: '', alto:'', largo:'',codigo:''}]);
// };


// const handleRowChange = (index, field, value) => {
//   const updatedRows = [...rows];  // Hacer una copia del estado actual de las filas
//   updatedRows[index] = { ...updatedRows[index], [field]: value };  // Actualizar solo el campo específico
//   setRows(updatedRows);  // Actualizar el estado con las filas modificadas

//   const totalCantidad = updatedRows.reduce((sum, row) => sum + (parseFloat(row.cantidad) || 0), 0);
//   setxd(totalCantidad);
// };


// const handleRemoveRow = (index) => {
//   const updatedRows = rows.filter((_, i) => i !== index);
//   setRows(updatedRows);
// };

const handleFormSubmit = async (values, { resetForm }) => {
  setIsLoading(true);

  let isValid = true; // Variable para verificar si la validación es correcta

  // Validar cada producto
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
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      break; // Detener la validación si hay un error
    }
  }

  // Si la validación es correcta, enviamos los datos
  if (isValid) {
    const valuesToSend = {
      cod_empresa: parseInt(Cod_empresa) || 1,
      id_proveedor: values.id_proveedor,
      numeroNota: values.numeroNota,
      modelo: values.modelo,
      operacion: values.operacion,
      formaDePago: values.formaDePago,
      condicionPago: values.condicionPago,
      id_vehiculo: values.id_vehiculo,
      id_producto: "PVB", 
      cantidad_total: cantidad || 0,
      id_usuario: parseInt(USER),
      data: products.flatMap((product) =>
        product.items.map((item) => ({
          cod_empresa: parseInt(Cod_empresa) || 1,
          id_usuario: parseInt(USER),
          id_proveedor: values.id_proveedor,
          id_producto: product.producto.id,
          cantidad: parseInt(item.cantidad2),
          alto: product.producto.alto,
          largo: product.producto.largo,
          espesura: product.producto.cod, 
          obs: "", 
          serie: item.serie,
        }))
      ),
    };


    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulación de espera
      const response = await PostDatosPVB(valuesToSend);

      // Si todo es correcto, actualizamos los estados
      setRows(initialRows);
      setRegistrationSuccess(true);
      // resetForm(); // Restablecer el formulario después de enviar
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
  } else {
    setIsLoading(false); // Detener la carga si la validación falló
  }
};

  
  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const handleSubmit = (values) => {
    const zplString = generateZPL(values, selectedCaballete);
    // Aquí puedes agregar cualquier otra lógica que necesites, como enviar el ZPL a un servidor.
};

const openModalProducto = (index) => {
  setSelectedProductIndex(index); // Guardar el índice seleccionado
  setModalProductoOpen(true);
};

// const handleSelectProducto = (producto, setFieldValue) => {
//   setSerieValue(producto)
//   setFieldValue("id_producto", producto.id);
//   setFieldValue("descripcion", producto.descripcion);
//   setFieldValue("cod", producto.cod); // Asigna el código del paquete
//   setFieldValue("medidas", producto.medidas);
//   setModalProductoOpen(false); // Cerrar el modal de productos
// };

const handleSelectProducto = (producto, setFieldValue, productIndex) => {
  if (productIndex !== undefined && productIndex >= 0) {
    setSerieValue(producto)
    setFieldValue(`products[${productIndex}].producto`, producto); // Esto actualiza el valor en Formik

    const updatedProducts = [...products];
    updatedProducts[productIndex].producto = producto;
    setProducts(updatedProducts);
  } else {
    console.error("productIndex no está definido o es inválido");
  }
};

const handleProductChange = (index, field, value) => {
  const updatedProducts = [...products];
  updatedProducts[index][field] = value;
  setProducts(updatedProducts);
  actualizarCantidadTotal(updatedProducts);
};

// const handleAddItem = (productIndex) => {
//   const updatedProducts = [...products];
//   updatedProducts[productIndex].items.push({
//     id: "",
//     serie: "",
//     alto: "",
//     largo: "",
//     codigo: "",
//   });
//   setProducts(updatedProducts);
// };

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


const openModalProveedor = () => {
  setModalProveedorOpen(true); // Abrir modal de productos
};

const handleSelectProveedor = (proveedor, setFieldValue) => {
  setFieldValue("id_proveedor", proveedor.id);

  setModalProveedorOpen(false); // Cerrar el modal de productos
};

const openModalCamion = () => {
  setModalCamionOpen(true); // Abrir modal de productos
};

const openModalCaballete = (index) => {
  setSelectedCaballeteIndex(index); // Guardar el índice seleccionado
  setModalOpen(true);
};

const handleSelectCaballete = (caballete, setFieldValue, caballeteIndex) => {

  if (!caballet || !Array.isArray(caballet)) {
    console.error("El estado 'caballet' no está inicializado o no es un array:", caballet);
    return;
  }

  if (caballeteIndex === undefined || caballeteIndex < 0) {
    console.error("El índice 'caballeteIndex' no es válido:", caballeteIndex);
    return;
  }

  // Verifica si el objeto en caballet[caballeteIndex] existe, si no, inicialízalo.
  const updatedcaballet = [...caballet];
  if (!updatedcaballet[caballeteIndex]) {
    updatedcaballet[caballeteIndex] = {}; // Inicializa el objeto si no existe
  }

  // Actualiza el valor de caballete en el estado local
  updatedcaballet[caballeteIndex].caballete = caballete.id;
  setCaballet(updatedcaballet);

  // Actualiza el valor en Formik
  setFieldValue(`caballet[${caballeteIndex}].caballete`, caballete);
};

const handleSelectCamion = (Camion, setFieldValue) => {
  setFieldValue("id_vehiculo", Camion);
  setModalCamionOpen(false); // Cerrar el modal de productos
};

const actualizarCantidadTotal = (productos) => {
  const total = productos.reduce((sum, prod) => {
    const cantidad = parseFloat(prod.cantidad);
    return sum + (isNaN(cantidad) ? 0 : cantidad);
  }, 0);
  console.log("🚀 ~ total ~ total:", total)
  setCantidad(total);
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
    updatedProducts[productIndex].items = updatedProducts[productIndex].items.filter((_, i) => i !== itemIndex);
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

  return (
    <Box sx={{ padding: '20px',height: "80vh", overflowY: "auto"}}>
      <Header
        title="Entrada Nota Fiscal PVB"
        subtitle="Entrada de PVB"
      />
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
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))"
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
              }}>

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
                <MenuItem value="Documento No Fiscal">Documento No Fiscal</MenuItem>
                <MenuItem value="Nota Fiscal Electronica">Nota Fiscal Electronica</MenuItem>
                <MenuItem value="Nota Fiscal Electronica Consumidor">Nota Fiscal Electronica Consumidor</MenuItem>
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
                <MenuItem value="Entrada materia prima">Entrada Materia prima</MenuItem>
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
                <MenuItem value="Efectico">Efectico</MenuItem>
                <MenuItem value="Cheque">Cheque</MenuItem>
                <MenuItem value="Transferencia Internacional">Transferencia Internacional</MenuItem>
                <MenuItem value="Transferencia Bancaria">Transferencia Bancaria</MenuItem>
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
<Box>
      {/* Botón para agregar nuevo producto */}
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton color="secondary" onClick={addProduct}>
          <AddCircleIcon />
        </IconButton>
        <Typography variant="body1">Agregar Producto</Typography>
      </Box>

      {/* Mostrar productos */}
      {products.map((product, productIndex) => (
        <Box
          key={productIndex}
          mt={2}
          sx={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            paddingLeft: "5vh"
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Campo Producto */}
            <Grid item xs={5}>
              <TextField
                fullWidth
                variant="outlined"
                label="Producto"
                value={product.producto.codigo || ""}
                InputProps={{
                  readOnly: true,
                }}
                onClick={() => openModalProducto(productIndex)} // Pasar índice para identificar producto
              />
            </Grid>

            {/* Campo Cantidad */}
            <Grid item xs={1.64}>
              <TextField
                fullWidth
                variant="outlined"
                label="Cantidad"
                value={product.cantidad}
                onChange={(e) =>
                  handleProductChange(productIndex, "cantidad", e.target.value)
                }
              />
            </Grid>

            {/* Botón para eliminar producto */}
            <Grid item xs={1}>
              <IconButton
                color="secondary"
                onClick={() => removeProduct(productIndex)}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Grid>
          </Grid>

          {/* Botón para agregar item */}
          <Box display="flex" alignItems="center" mt={2}>
            <IconButton
              color="secondary"
              sx={{paddingLeft: "30vh"}}
              onClick={() => handleAddItem(productIndex)}
            >
              <AddCircleIcon />
            </IconButton>
            <Typography variant="body1" sx={{ marginLeft: "0.5vw" }}>
              Item
            </Typography>
          </Box>

          {/* Grid dinámico para los items del producto */}
          {product.items.map((item, itemIndex) => (
            <Grid
              container
              spacing={2}
              alignItems="center"
              key={itemIndex}
              sx={{ marginTop: "5px", paddingLeft: "30vh"}}
            >
              <Grid item xs={1}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="ID"
                  value={item.id}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={2.5}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Serie"
                  value={item.serie}
                  onChange={(e) =>
                    handleItemChange(productIndex, itemIndex, "serie", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Cantidad"
                  value={item.cantidad2}
                  onChange={(e) =>
                    handleItemChange(productIndex, itemIndex, "cantidad2", e.target.value)
                  }
                />
              </Grid>
            {/* <Grid item xs={1.5}>
              <TextField
                fullWidth
                variant="outlined"
                label="Alto"
                value={item.alto}
                onChange={(e) =>
                  handleItemChange(productIndex, itemIndex, "alto", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={1.5}>
              <TextField
                fullWidth
                variant="outlined"
                label="Largo"
                value={item.largo}
                onChange={(e) =>
                  handleItemChange(productIndex, itemIndex, "largo", e.target.value)
                }
              />
            </Grid> */}
            {/* <Grid item xs={2}>
              <TextField
                select
                fullWidth
                variant="outlined"
                label="Código"
                value={item.codigo}
                onChange={(e) =>
                  handleItemChange(productIndex, itemIndex, "codigo", e.target.value)
                }
              >
                {options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}

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
    </Box>


              <Box sx={{ paddingRight: "2%", paddingTop: "3%", paddingBottom: "3%" }} className="wrap">
                <Button  type="submit" color="secondary" variant="contained"  sx={{
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
              onSelect={(producto) => handleSelectProducto(producto, setFieldValue, selectedProductIndex )}// Lógica para seleccionar productos
              serviceType="0"
            />
            <ModalCaballete 
              open={modalOpen} 
              onClose={() => setModalOpen(false)} 
              onSelect={(caballete) => handleSelectCaballete(caballete, setFieldValue, selectedCaballeteIndex)} 
              serviceType={1} 
            /> 
            <ModalProveedor
              open={modalProveedorOpen} // Estado del modal de proveedors
              onClose={() => setModalProveedorOpen(false)} // Cerrar el modal de Proveedors
              onSelect={(proveedor) => handleSelectProveedor(proveedor, setFieldValue)}// Lógica para seleccionar productos
            />

            <ModalCamion
              open={modalCamionOpen} // Estado del modal de Camions
              onClose={() => setModalCamionOpen(false)} // Cerrar el modal de Camions
              onSelectVehiculos={(Camion) => handleSelectCamion(Camion, setFieldValue)}// Lógica para seleccionar productos
            />

            
          </form>
        )}
      </Formik>
    </Box>
  );
};


const checkoutSchema  = Yup.object().shape({
  id_proveedor: Yup.number().required("Proveedor es requerido"),
  numeroNota: Yup.string().required("Número de Nota es requerido"),
  modelo: Yup.string().required("Modelo es requerido"),
  operacion: Yup.string().required("Operación es requerida"),
  formaDePago: Yup.string().required("Forma de Pago es requerida"),
  condicionPago: Yup.string().required("Condición de Pago es requerida"),
  id_vehiculo: Yup.number().required("Vehículo es requerido"),
  products: Yup.array().of(
    Yup.object().shape({
      items: Yup.array().of(
        Yup.object().shape({
          serie: Yup.string().required("Serie es requerida"),  // Validación de serie
          cantidad2: Yup.number().required("Cantidad es requerida"),  // Validación de cantidad2
        })
      )
    })
  )
});


export default EntradaNotaFiscal;
