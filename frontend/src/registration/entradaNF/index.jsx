import React, { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TextField, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import { tokens } from '../../theme';
import ModalCharge from "../../modal/modalCharge";
import ModalEditarRegistro from '../../modal/inventario/modalInventario';
import ModalProducto from "../../modal/producto/modalProducto";
import ModalProveedor from "../../modal/proveedor/modalProveedor";
import ModalCategoria from "../../modal/categoria/modalCategoria";

import Header from '../../components/Header';
import { getOneDatos, PostDatosStock, getOneDatosTicket, getSerieStock } from '../../services/stock.services';
import dayjs from "dayjs";
import QRCode from 'qrcode'


const Stock = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [motivosData, setMotivosData] = useState([]);
  const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState(''); // Estado para guardar posibles errores
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [modalProveedorOpen, setModalProveedorOpen] = useState(false);
  const [modalCategoriaOpen, setModalCategoriaOpen] = useState(false);


  const [modalOpen, setModalOpen] = useState(true);
  const [selectedCaballete, setSelectedCaballete] = useState(null);
  const [serieValue, setSerieValue] = useState('');
  const USER = localStorage.getItem('id');
  // const TURNO = localStorage.getItem('turno');
  const formikRef = useRef(null); // useRef en lugar de useState
  const initialValues = {
    cod: '',
    descripcion: '',
    cantidad: '',
    medidas: '',
    id_caballete: '',
    obs: '',
    serie: '',
    cantidad_entrada: '',
    id_proveedor: '',
    id_pvb: 0,
    id_clasificacion: 0,
  };

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
    const { descripcion, medidas, clasificacion, serie, obs, motivo, create_at, cantidad, cantidad_entrada } = response;
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

  // const handleFormSubmit = async (values, { resetForm }) => {
  //   setIsLoading(true);
  //   const valuesToSend = {
  //     cod: values.cod,
  //     descripcion: values.descripcion,
  //     cantidad: parseInt(values.cantidad),
  //     medidas: values.medidas,
  //     id_caballete: selectedCaballete,
  //     obs: values.obs,
  //     serie: values.serie,
  //     cantidad_entrada: parseInt(values.cantidad_entrada),
  //     id_proveedor: values.id_proveedor,
  //     id_categoria: 3,
  //     id_usuario: parseInt(USER), // Asegurarse de que `USER` es un número válido
  //   };


  //   try {
  //     // Enviar los datos al backend
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     const response = await PostDatosStock(valuesToSend);
  //     const {id}= response.resp;
  //     getTicket(id);
  //     setRegistrationSuccess(true);
  //     resetForm(); // Restablecer el formulario después de enviar
  //   } catch (error) {
  //     console.error("Error al enviar los datos", error);
  //     setRegistrationError(true);
  //     setIsLoading(false);
  //     setError(error.message);
  //   } finally {
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 3000);
  //   }
  // };
  
  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const handleSelectCaballete = (id) => {
    setSelectedCaballete(id.id);
    setModalOpen(false);
  };

  // Función para actualizar los valores de Formik
  const setFieldValuesInFormik = (data) => {
    if (formikRef.current) {
      formikRef.current.setFieldValue('id_producto', data.id_producto);
      formikRef.current.setFieldValue('cod', data.cod);
      formikRef.current.setFieldValue('descripcion', data.descripcion);
      formikRef.current.setFieldValue('medidas', data.medidas);
      formikRef.current.setFieldValue('id_clasificacion', data.id_clasificacion);
      formikRef.current.setFieldValue('obs', data.obs);
      formikRef.current.setFieldValue('id_caballete', selectedCaballete);
      formikRef.current.setFieldValue('motivo', data.motivo);
      formikRef.current.setFieldValue('id_produccion', data.id_produccion);
      formikRef.current.setFieldValue('cantidad', data.cantidad);
      formikRef.current.setFieldValue('id_proveedor', data.id_proveedor);

    }
  };

  useEffect(() => {
    if (serieValue) {
      const fetchDatos = async () => {
        try {
          const data = await getSerieStock(serieValue);
          setFieldValuesInFormik(data); // Actualizamos los valores de Formik con los datos obtenidos
        } catch (error) {
          console.error("Error al obtener datos:", error.message);
        }
      };

      fetchDatos();
    }

  }, [serieValue, selectedCaballete]); // Dependencias actualizadas

  const handleSubmit = (values) => {
    const zplString = generateZPL(values, selectedCaballete);
    // Aquí puedes agregar cualquier otra lógica que necesites, como enviar el ZPL a un servidor.
};

const openModalProducto = () => {
  setModalProductoOpen(true); // Abrir modal de productos
};

const handleSelectProducto = (producto, setFieldValue) => {
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

const openModalCategoria = () => {
  setModalCategoriaOpen(true); // Abrir modal de productos
};

const handleSelectCategoria = (categoria, setFieldValue) => {
  setFieldValue("id_categoria", categoria.id);

  setModalCategoriaOpen(false); // Cerrar el modal de productos
};
  return (
    <Box sx={{ padding: '20px' }}>
      <Header
        title="Inventario"
        subtitle="Monoliticos"
      />

      {/* Modal para seleccionar caballete */}

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
      {/* <ModalCaballete open={modalOpen} onClose={() => setModalOpen(false)} onSelect={handleSelectCaballete} serviceType={1} /> */}
      
      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        // onSubmit={handleFormSubmit}
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
                label="Serie"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e); // Llama el handleChange normal de Formik
                  setSerieValue(e.target.value); // Actualiza el valor de serieValue
                }}
                value={values.serie}
                name="serie"
                error={!!touched.serie && !!errors.serie}
                helperText={touched.serie && errors.serie}
                
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Código"
                value={values.cod}
                name="cod"
                error={!!touched.cod && !!errors.cod}
                helperText={touched.cod && errors.cod}
                InputProps={{
                  readOnly: true,
                }}
                // onClick={openModalProducto}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Descripción"
                value={values.descripcion}
                name="descripcion"
                error={!!touched.descripcion && !!errors.descripcion}
                helperText={touched.descripcion && errors.descripcion}
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Medidas"
                value={values.medidas}
                name="medidas"
                error={!!touched.medidas && !!errors.medidas}
                helperText={touched.medidas && errors.medidas}
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cantidad"
                value={values.cantidad}
                name="cantidad"
                onChange={handleChange}
                error={!!touched.cantidad && !!errors.cantidad}
                helperText={touched.cantidad && errors.cantidad}
              />
              
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Obs"
                value={values.obs}
                name="obs"
                onChange={handleChange}
                error={!!touched.obs && !!errors.obs}
                helperText={touched.obs && errors.obs}
              />
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
                // onClick={openModalProveedor}
              />
              
            </Box>
              <Box sx={{ paddingRight: "2%", paddingTop: "3%", paddingBottom: "3%" }} className="wrap">
                <Button className="button-animation" type="submit" color="secondary" variant="contained" onClick={() => setModalProductoOpen(true)} >
                  Salida
                </Button>

                <Button className="button-animation" type="submit" color="secondary" variant="contained" onClick={() => setModalProductoOpen(true)}>
                  Entrada 
                </Button>
              </Box>
            <ModalCharge isLoading={isLoading} />

            <ModalEditarRegistro
              open={modalProductoOpen} // Estado del modal de productos
              onClose={() => setModalProductoOpen(false)} // Cerrar el modal de productos
              onSelectProduct={(producto) => handleSelectProducto(producto, setFieldValue)}// Lógica para seleccionar productos
            />

            <ModalProveedor
              open={modalProveedorOpen} // Estado del modal de proveedors
              onClose={() => setModalProveedorOpen(false)} // Cerrar el modal de Proveedors
              onSelect={(proveedor) => handleSelectProveedor(proveedor, setFieldValue)}// Lógica para seleccionar productos
            />

            <ModalCategoria
              open={modalCategoriaOpen} // Estado del modal de Categorias
              onClose={() => setModalCategoriaOpen(false)} // Cerrar el modal de Categorias
              onSelect={(categoria) => handleSelectCategoria(categoria, setFieldValue)}// Lógica para seleccionar productos
            />
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  serie: yup.string().required("Requerido"),
  cod: yup.string().required("Requerido"),
  descripcion: yup.string().required("Requerido"),
  medidas: yup.string().required("Requerido"),
  obs: yup.string().required("Requerido"),
  // id_caballete: yup.number().required("Requerido"),
});

export default Stock;
