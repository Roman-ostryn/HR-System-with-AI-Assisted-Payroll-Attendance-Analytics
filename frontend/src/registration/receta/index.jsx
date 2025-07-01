import React, { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, TextField, MenuItem, Typography, Grid, IconButton } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import { tokens } from '../../theme';
import ModalCharge from "../../modal/modalCharge";
import ModalProducto from "../../modal/producto/modalProducto";
import ModalProveedor from "../../modal/proveedor/modalProveedor";
import ModalCaballete from "../../modal/caballete/modalCaballete";
import ModalCamion from "../../modal/camiones/modalCamion";
import Header from '../../components/Header';
import { PostDatosReceta} from '../../services/receta.services.js';
import dayjs from "dayjs";
import QRCode from 'qrcode'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EntradaNotaFiscal = () => {
  const initialRows = [{ id: 1, temperatura: '', presion: '', tiempo:'' }];
  const [rows, setRows] = useState([]); // Maneja las filas dinámicas
  const [xd, setxd] = useState([]); // Maneja las filas dinámicas
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
  const [selectedIndex, setSelectedIndex] = useState(null); // Estado para mantener el índice
  const initialValues = {
    // id_proveedor: '',
    // numeroNota: '',
    // modelo: '',
    // operacion: '',
    // formaDePago: '',
    // estado: '',
    // id_vehiculo: '',
    // id_producto: '',
    // id_proveedor: '',
    descripcion: '',
    presion: '',
    temperatura:'',
    tiempo:'',
  };

// const generateZPL = async (values) => {
//     const qrImageUrl = await QRCode.toDataURL(values.serie, { errorCorrectionLevel: 'H' }).catch(error => {
//     console.error('Error generando el QR:', error);
//     return null; // Retorna null en caso de error
//   });
  
//   let zpl = `
//   ^XA
//   ^PW800        // Ancho de la etiqueta (400 puntos = 10 cm)
//   ^LL400        // Longitud de la etiqueta (200 puntos = 5 cm)

//   // Código en la parte superior, más grande
//   ^FO85,40^A0N,30,30^FDNumero de Serie:${values.serie} ^FS

//   ^FO500,40^A0N,30,35^FD${values.fecha}^FS

//  ^FO85,120^A0N,30,30^FDCant. Chapa:^FS
//  ^FO140,160^A0N,30,30^FD${values.cantidad}^FS

//  ^FO380,120^A0N,30,30^FDCant. Utilizable:^FS
//  ^FO380,160^A0N,30,30^FD${values.cantidad_entrada}^FS

//   // ID Producción, fecha y serie
//   //^FO85,220^A0N,30,30^FDProducto:^FS
//   //^FO85,260^A0N,28,26^FD${values.descripcion}^FS

//   // Código QR, más grande
//   //^FO580,90^BQN,2,8^FDQA,${values.qrImageUrl}^FS

//   ^XZ
// `
//   if (window.BrowserPrint) { // Asegúrate de que BrowserPrint está disponible
//     window.BrowserPrint.getDefaultDevice("printer", 
//     (device) => {
//         if (device) {
//         setPrinterInfo(`Dispositivo predeterminado encontrado: ${device.name}`);
//         let zplCommand = zpl;

//         // 3. Usar la función send para enviar los datos al dispositivo
//         device.send(zplCommand, function(response) {
//             console.log("Datos enviados exitosamente:", response);
//         }, function(error) {
//             console.error("Error al enviar datos:", error);
//         });
//         } else {
//         setPrinterInfo("No hay una impresora predeterminada configurada.");
//         }
//     },
//     (error) => {
//         setErrorMessage(`Error al obtener el dispositivo predeterminado: ${error}`);
//     }
//     );
//   } else {
//     setErrorMessage('BrowserPrint no está disponible.');
//   }

// };

// const getTicket = async (id) => {
//   const response = await getOneDatosTicket(id);
//   if (response) {
//     const { descripcion, medidas, clasificacion, serie, modelo, motivo, create_at, cantidad, cantidad_entrada } = response;
//     const fecha = dayjs(create_at).format("DD/MM/YYYY hh:mm");

//     const ticketData = {
//       serie: serie,
//       fecha: fecha,
//       cantidad: cantidad,
//       cantidad_entrada: cantidad_entrada,
//       descripcion: descripcion,
//     };
//     // Call function to print ticket
//     generateZPL(ticketData);
//   } else {
//     console.error("No se encontró el ticket con el ID proporcionado");
//   }
// }

const handleAddRow = () => {
  setRows([...rows, { id: rows.length + 1, temperatura: '', presion: '', tiempo:''}]);
};

// const handleAddRow = () => {
//   const newRow = { id: rows.length + 1, serie: '', cantidad: '', id_caballete: '' };
//   // Agregar la nueva fila
//   const updatedRows = [...rows, newRow];
//   setRows(updatedRows);
//   // Calcular la suma de las cantidades y mostrar en la consola
//   const totalCantidad = updatedRows.reduce((sum, row) => sum + (parseFloat(row.cantidad) || 0), 0);
//   setxd(totalCantidad)
// };


const handleRowChange = (index, field, value) => {
  const updatedRows = [...rows];  // Hacer una copia del estado actual de las filas
  updatedRows[index] = { ...updatedRows[index], [field]: value };  // Actualizar solo el campo específico
  setRows(updatedRows);  // Actualizar el estado con las filas modificadas

  const totalCantidad = updatedRows.reduce((sum, row) => sum + (parseFloat(row.cantidad) || 0), 0);
  setxd(totalCantidad);
};


const handleRemoveRow = (index) => {
  const updatedRows = rows.filter((_, i) => i !== index);
  setRows(updatedRows);
};

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    const valuesToSend = {
      descripcion: values.descripcion,
      cod_empresa: parseInt(Cod_empresa) || 1,
      id_usuario: parseInt(USER), // Asegurarse de que `USER` es un número válido
      data: rows.map((row) => ({
        fase: parseInt(row.id), // Cantidad de la fila específica
        presion: row.presion, // ID fijo o dinámico si aplica
        temperatura: row.temperatura, // Valor específico de la fila actual
        tiempo: parseInt(row.tiempo), // Cantidad específica de entrada
        cod_empresa: parseInt(Cod_empresa) || 1,
        id_usuario: parseInt(USER), // ID del usuario actual
      })),
    };
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // if(xd == values.cantidad){
        const response = await PostDatosReceta(valuesToSend);
        const {id}= response.resp;
        setRows(initialRows);
        // getTicket(id);
        setRegistrationSuccess(true);
        resetForm(); // Restablecer el formulario después de enviar
      // }else{
      //   toast.error(`Cantidad no coincide. Total Item: ${xd}, Cantidad: ${values.cantidad}`, {
      //     position: "top-center",
      //     autoClose: 3000, // Tiempo de cierre automático
      //     hideProgressBar: true, // Oculta la barra de progreso
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //   });
      // }
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

//   const handleSubmit = (values) => {
//     const zplString = generateZPL(values, selectedCaballete);
//     // Aquí puedes agregar cualquier otra lógica que necesites, como enviar el ZPL a un servidor.
// };

const openModalProducto = () => {
  setModalProductoOpen(true); // Abrir modal de productos
};

const handleSelectProducto = (producto, setFieldValue) => {
  setSerieValue(producto)
  setFieldValue("id_producto", producto.id);
  setFieldValue("descripcion", producto.descripcion);
  setFieldValue("cod", producto.cod); // Asigna el código del paquete
  setFieldValue("medidas", producto.medidas);
  setModalProductoOpen(false); // Cerrar el modal de productos
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

const openModalCaballete = (rowId) => {
  setSelectedIndex(rowId);  // Guarda el index seleccionado
  setModalOpen(true);  // Abre el modal
};

const handleSelectCaballete = (caballete) => {
  const updatedRows = [...rows];  // Hacer una copia del estado actual de las filas
  updatedRows[selectedIndex].id_caballete = caballete.id;  // Actualizar el campo específico con el valor seleccionado
  setRows(updatedRows);  // Actualizar el estado con las filas modificadas
  setModalOpen(false);  // Cerrar el modal
};

const handleSelectCamion = (Camion, setFieldValue) => {
  setFieldValue("id_vehiculo", Camion);
  setModalCamionOpen(false); // Cerrar el modal de productos
};

  return (
    <Box sx={{ padding: '20px',height: "80vh", overflowY: "auto"}}>
      <Header
        title="Receta AutoClave"
        subtitle="Registro de Receta"
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

              {/* <TextField
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
              /> */}
              {/* <TextField
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
              /> */}

              {/* <TextField
                fullWidth
                variant="filled"
                label="Modelo"
                name="modelo"
                value={values.modelo}
                onChange={handleChange}
                error={!!touched.modelo && !!errors.modelo}
                helperText={touched.modelo && errors.modelo}
                select // Esta propiedad convierte el TextField en un select
              > */}
                {/* Opciones del select */}
                {/* <MenuItem value="Documento No Fiscal">Documento No Fiscal</MenuItem>
                <MenuItem value="Nota Fiscal Electronica">Nota Fiscal Electronica</MenuItem>
                <MenuItem value="Nota Fiscal Electronica Consumidor">Nota Fiscal Electronica Consumidor</MenuItem>
              </TextField> */}

              {/* <TextField
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
                {/* <MenuItem value="Entrada materia prima">Entrada Materia prima</MenuItem>
                <MenuItem value="Sim Entrada">Sin Entrada</MenuItem>
              </TextField>
                */}
              {/* <TextField
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
                > */}
                {/* Opciones del select */}
                {/* <MenuItem value="Efectico">Efectico</MenuItem>
                <MenuItem value="Cheque">Cheque</MenuItem>
                <MenuItem value="Transferencia Internacional">Transferencia Internacional</MenuItem>
                <MenuItem value="Transferencia Bancaria">Transferencia Bancaria</MenuItem>
                <MenuItem value="Pagare">Pagare</MenuItem>
              </TextField> */}

              

              {/* <TextField
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
              /> */}

              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Producto"
                value={values.descripcion}
                name="id_producto"
                error={!!touched.id_producto && !!errors.id_producto}
                helperText={touched.id_producto && errors.id_producto}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ gridColumn: "span 2" }}
                onClick={openModalProducto}
              /> */}

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Descripcion"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e); 
                }}
                value={values.descripcion}
                name="descripcion"
                error={!!touched.descripcion && !!errors.descripcion}
                helperText={touched.descripcion && errors.descripcion}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box>
            <Box mt={2}>
              {/* Botón Agregar con texto "Item" */}
              <Box display="flex" alignItems="center" mb={2}>
                <IconButton color="primary" onClick={handleAddRow} >
                <Box sx={{ color: "#00FFCB",fontSize: 40, marginTop: '-5px', marginLeft: '5px' }}>
                  <AddCircleIcon />
                </Box>

                </IconButton>
                <Typography variant="body1" sx={{ marginLeft: '0.5vw' }}>
                  Item
                </Typography>
              </Box>

              {/* Grid dinámico */}
              {rows.map((row, index) => (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  width="79vw"
                  key={index}
                  sx={{ marginBottom: '10px', paddingLeft: '5vw' }}
                >
                  <Grid item xs={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Fase"
                      value={row.id}
                      onChange={(e) =>
                        handleRowChange(index, 'fase', e.target.value)
                      }
                      InputProps={{
                        readOnly: true, // Hacer que el campo sea de solo lectura
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Temperatura"
                      value={row.temperatura}
                      onChange={(e) =>
                        handleRowChange(index, 'temperatura', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Presion"
                      value={row.presion}
                      onChange={(e) =>
                        handleRowChange(index, 'presion', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Tiempo"
                      value={row.tiempo}
                      onChange={(e) =>
                        handleRowChange(index, 'tiempo', e.target.value)
                      }
                      // onClick={() => openModalCaballete(index)}  // Pasar el índice correcto
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <IconButton
                      color="secondary"
                      onClick={() => handleRemoveRow(index)}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Box>

            </Box>
              <Box sx={{ paddingRight: "2%", paddingTop: "3%", paddingBottom: "3%" }} className="wrap">
                <Button className="button-animation" type="submit" color="secondary" variant="contained" >
                  Registrar
                </Button>
              </Box>

            <ModalCharge isLoading={isLoading} />
            <ModalProducto
              open={modalProductoOpen} // Estado del modal de productos
              onClose={() => setModalProductoOpen(false)} // Cerrar el modal de productos
              onSelectProduct={(producto) => handleSelectProducto(producto, setFieldValue)}// Lógica para seleccionar productos
              serviceType="0"
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

            <ModalCaballete 
              open={modalOpen} 
              onClose={() => setModalOpen(false)} 
              onSelect={(caballete) => handleSelectCaballete(caballete, setFieldValue)} 
              serviceType={1} 
            /> 
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  descripcion: yup.string().required("Requerido"),
  // formaDePago: yup.string().required("Requerido"),
  // id_producto: yup.number().required("Requerido"),
  // cod_empresa: yup.number().required("Requerido"),
  // descripcion: yup.number().required("Requerido"),
  // modelo: yup.string().required("Requerido"),
});

export default EntradaNotaFiscal;