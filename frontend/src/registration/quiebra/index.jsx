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
import { getOneDatos, PostDatos, getOneDatosTicket, getEntradaNotaFiscal, getOneDatosTicketR } from '../../services/quiebre.services';
import dayjs from "dayjs";
import QRCode from 'qrcode'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PostDatosQuiebra } from '../../services/quiebre.services';
import { useDropzone } from 'react-dropzone';
import DraggableItem from '../../components/DraggableItem';
import CloseIcon from '@mui/icons-material/Close';
import imageCompression from 'browser-image-compression';
import getApiBaseUrl from '../../utils/getApiBaseUrl';


const   Quiebra = () => {
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
  const [rows, setRows] = useState([
    { id: 1,  medida: '', descripcion: '', id_caballete:'' }
  ]);
  // const initialRows = [{ id: 1, serie: '', cantidad: '', id_caballete:'' }];
  const initialRows = [{id: 1,  medida: '', descripcion: '', id_caballete:'' }];
  const [droppedItems, setDroppedItems] = useState([]);
  const [imagenxd, setImagenXd] = useState(''); // Maneja las filas dinámicas
  const [dropError, setDropError] = useState('');
  const [cantidadRetallo, setCantidadRetallo] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const initialValues = {
    
    cod_paquete: '',
    cantidad_retallo: '',
    sector: '',
    motivo: '',
    id_proveedor: '',
    medida: '',
    descripcion: '',
    cod_empresa: Cod_empresa,
    imagen: '',
  };

const generateZPL = async (values) => {
    const qrImageUrl = await QRCode.toDataURL(values.serie, { errorCorrectionLevel: 'H' }).catch(error => {
    console.error('Error generando el QR:', error);
    return null; // Retorna null en caso de error
  });
  
  const formatText = (text, maxLength) => {
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";
  
    for (let word of words) {
      if ((currentLine + word).length > maxLength) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    }
  
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }
  
    return lines;
  };
  
  // Dividir la descripción y el código en líneas
  const descripcionLines = formatText(values.descripcion, 48);
  const codLines = formatText(values.cod, 43);
  
  let zpl = `
    ^XA
    ^PW800        // Ancho de la etiqueta (400 puntos = 10 cm)
    ^LL400        // Longitud de la etiqueta (200 puntos = 5 cm)
  `;
  
  // Agregar las líneas del código (cod) al ZPL
  codLines.forEach((line, index) => {
    zpl += `^FO85,${40 + index * 30}^A0N,30,30^FD${line}^FS\n`;
  });
  
  // Agregar las líneas de descripción al ZPL
  descripcionLines.forEach((line, index) => {
    zpl += `^FO85,${85 + index * 30}^A0N,30,30^FD${line}^FS\n`;
  });
  
  zpl += `
    ^FO85,${80 + descripcionLines.length * 30 + 30}^A0N,30,30^FDCantidad: ${values.cantidad_entrada}^FS
    ^FO85,${100 + descripcionLines.length * 30 + 60}^A0N,30,30^FD${values.serie}^FS
  
    // Código QR, más grande
    //^FO580,150^BQN,2,8^FDQA,${values.cod_interno}^FS
  
    ^FO085,350^A0N,30,35^FD${values.fecha}^FS
    ^FO580,350^A0N,30,35^FD${values.cod_interno}^FS
    ^XZ
  `;
  


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

const generateZPLx = async (values) => {
  const qrImageUrl = await QRCode.toDataURL(values.cod_interno, { errorCorrectionLevel: 'H' }).catch(error => {
  console.error('Error generando el QR:', error);
  return null; // Retorna null en caso de error
});

const formatText = (text, maxLength) => {
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  for (let word of words) {
    if ((currentLine + word).length > maxLength) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines;
};

// Dividir la descripción y el código en líneas
const descripcionLines = formatText(values.descripcion, 48);
const codLines = formatText(values.cod, 43);

let zplx = `
^XA
^PW800          // Ancho de la etiqueta (800 puntos = 20 cm)
^LL400          // Longitud de la etiqueta (400 puntos = 10 cm)

// Rectángulo negro para "RETALLO"
^FO0,0^GB80,370,80,B^FS

// Texto blanco dentro del rectángulo negro
^FO10,90^A0R,50,50^FR^FDRETALLO^FS

// Código en la parte superior, más grande
^FO85,30^A0N,30,30^FD${values.cod_interno}^FS

// ^FO85,90^A0N,30,30^FD${values.cod}^FS

^FO85,150^A0N,30,30^FDCantidad: ${values.cantidad_entrada}^FS

 `;

  // Agregar las líneas de descripción al ZPL
  descripcionLines.forEach((line, index) => {
    zplx += `^FO85,${300 + index * 30}^A0N,30,30^FD${line}^FS\n`;
  });


 zplx += `
// Fondo negro para "altura" (con texto blanco)
^FO85,180^GB200,70,100,B^FS
^FO 150,190^A0N,30,30^FR^FDLargura^FS
^FO150,220^A0N,50,50^FR^FD${values.largura}^FS

// Fondo negro para "largura" (con texto blanco)
^FO320,180^GB200,50,100,B^FS
^FO380,190^A0N,30,30^FR^FDAltura^FS
^FO380,220^A0N,50,50^FR^FD${values.altura}^FS

// Código QR, más grande
// ^FO580,120^BQN,2,7^FDQA,${values.cod_interno}^FS

^FO555,30^A0N,30,35^FD${values.fecha}^FS
^XZ


`;

if (window.BrowserPrint) { // Asegúrate de que BrowserPrint está disponible
  window.BrowserPrint.getDefaultDevice("printer", 
  (device) => {
      if (device) {
      setPrinterInfo(`Dispositivo predeterminado encontrado: ${device.name}`);
      let zplCommand = zplx;

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


const getTicket = async (serie) => {
  const response = await getOneDatosTicket(serie);
  if (response) {
    const {cod, descripcion, cod_interno, serie, create_at, cantidad_entrada } = response;
    const fecha = dayjs(create_at).format("DD/MM/YYYY hh:mm");

    const ticketData = {
      cod: cod,
      descripcion: descripcion,
      cantidad_entrada: cantidad_entrada,
      serie: serie,
      fecha: fecha,
      cod_interno: cod_interno,

    };
    // Call function to print ticket
    generateZPL(ticketData);
  } else {
    console.error("No se encontró el ticket con el ID proporcionado");
  }
}

const getTicketRetallo = async (id) => {
  const response = await getOneDatosTicketR(id);

  if (Array.isArray(response) && response.length > 0) {
    response.forEach((item) => {
      const { cod, descripcion, medidas, cod_interno, serie, create_at, cantidad_entrada } = item;
      const fecha = dayjs(create_at).format("DD/MM/YYYY hh:mm");

      // Procesar medidas
      let largura = '';
      let altura = '';
      if (medidas) {
        [largura, altura] = medidas.split('x');
      }
      

      const ticketDatax = {
        cod_interno: cod_interno,
        cod: cod,
        descripcion: descripcion,
        cantidad_entrada: cantidad_entrada,
        serie: serie,
        fecha: fecha,
        largura: largura,
        altura: altura,
      };


      // Llama a la función para imprimir el ticket
      generateZPLx(ticketDatax);
    });
  } else if (response) {
    console.error("No hay datos en la respuesta.");
  } else {
    console.error("No se encontró el ticket con el ID proporcionado");
  }
};


const handleAddRow = () => {
  setRows([...rows, { id: rows.length + 1, medida: '', descripcion: ''}]);
};



const handleRowChange = (index, field, value) => {
  const updatedRows = [...rows];  // Hacer una copia del estado actual de las filas
  updatedRows[index] = { ...updatedRows[index], [field]: value };  // Actualizar solo el campo específico
  setRows(updatedRows);  // Actualizar el estado con las filas modificadas
};

const handleRemoveRow = (index) => {
  const updatedRows = rows.filter((_, i) => i !== index);
  setRows(updatedRows);
};


const handleImageChange = async (images) => {
  const imagePaths = [];

  for (const file of images) {
    try {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append("image", compressedFile);

      const response = await fetch(`${getApiBaseUrl()}upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        imagePaths.push(data.filePath);
      } else {
        console.error("Error al subir la imagen");
      }
    } catch (error) {
      console.error("Error al comprimir la imagen:", error);
    }
  }

  return imagePaths.join(","); // Retorna la concatenación de las rutas
};

const handleFormSubmit = async (values, { resetForm }) => {
  if (droppedItems.length === 0) {
    setDropError('Debe agregar al menos una imagen.');
    return;
  }

    // Validar los campos medida y descripcion
    const errors = {};
    rows.forEach((row, index) => {
      if (!row.medida) {
        errors[`medida_${index}`] = 'La medida es requerida';
      }
      // if (!row.descripcion) {
      //   errors[`descripcion_${index}`] = 'La descripcion es requerida';
      // }
      if (!row.id_caballete) {
        errors[`id_caballete_${index}`] = 'La descripcion es requerida';
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

  try {
    // Procesar las imágenes
    const images = droppedItems.map((item) => item.file);
    const imagePaths = await handleImageChange(images); // Aseguramos que la función retorne las rutas procesadas

    // Construir los valores para enviar
    const valuesToSend = {
      cod_paquete: values.cod_paquete,
      cantidad_retallo: parseInt(cantidadRetallo),
      sector: values.sector,
      motivo: values.motivo,
      id_proveedor: values.id_proveedor,
      cod_empresa: parseInt(Cod_empresa) || 1,
      id_usuario: parseInt(USER), 
      imagen: imagePaths, // Aquí aseguramos que las imágenes estén correctamente enviadas
      data: rows.map((row) => ({
        medida: row.medida,
        // descripcion: row.descripcion,
        id_caballete:parseInt(row.id_caballete)
      })),
    };

    const response = await PostDatosQuiebra(valuesToSend);
    getTicket(response.resp.cod_paquete);
    getTicketRetallo(response.resp.id);


    setRows(initialRows);
    setRegistrationSuccess(true);
    resetForm();
    setDroppedItems([]); 
    setImagenXd(''); 
    setCantidadRetallo('');
    setRows([{ id: 1, medida: '', descripcion: '', id_caballete: '' }]);
    setFieldErrors({}); // Limpiar los errores de los campos
  } catch (error) {
    console.error("Error al enviar los datos", error);
    setRegistrationError(true);
  } finally {
    setTimeout(() => {
      setIsLoading(false);  
    }, 1500);
  }
};

const handleSelectCaballete = (caballete) => {
  const updatedRows = [...rows];  // Hacer una copia del estado actual de las filas
  updatedRows[selectedIndex].id_caballete = caballete.id;  // Actualizar el campo específico con el valor seleccionado
  setRows(updatedRows);  // Actualizar el estado con las filas modificadas
  setModalOpen(false);  // Cerrar el modal
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


const openModalCaballete = (rowId) => {
  setSelectedIndex(rowId);  // Guarda el index seleccionado
  setModalOpen(true);  // Abre el modal
};

const openModalProveedor = () => {
  setModalProveedorOpen(true); // Abrir modal de productos
};

const handleSelectProveedor = (proveedor, setFieldValue) => {
  setFieldValue("id_proveedor", proveedor.id);

  setModalProveedorOpen(false); // Cerrar el modal de productos
};



const handleDrop = (acceptedFiles) => {
  const newItems = acceptedFiles.map((file) => ({
    name: file.name,
    preview: URL.createObjectURL(file),
    file, // Guardar el archivo original
  }));
  setDroppedItems((prevItems) => [...prevItems, ...newItems]);
  setDropError(''); // Limpiar el error cuando se agregan archivos
};

const handleRemoveItem = (index) => {
  setDroppedItems((prevItems) => prevItems.filter((_, i) => i !== index));
};

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  accept: 'image/*',
  onDrop: handleDrop,
});



const handleCantidadRetalloKeyDown = (event) => {
  if (event.key === 'Enter') {
    const cantidad = parseInt(cantidadRetallo, 10);
    if (!isNaN(cantidad) && cantidad > 1) { // Validar que cantidad > 1
      const newRows = Array.from({ length: cantidad - 1 }, (_, index) => ({
        id: rows.length + index + 1,
        medida: '',
        descripcion: '',
      }));
      setRows((prevRows) => [...prevRows, ...newRows]);
    } else {
      console.warn("La cantidad debe ser mayor a 1");
    }
  }
};


  return (
    <Box sx={{ padding: "20px", height: "90vh", overflowY: "auto" }}>
      <Header title="Quiebra" subtitle="Registro de quiebra de productos" />
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
                label="Serie"
                value={values.cod_paquete}
                name="cod_paquete"
                onChange={handleChange}
                error={!!touched.cod_paquete && !!errors.cod_paquete}
                helperText={touched.cod_paquete && errors.cod_paquete}
                //  InputProps={{
                //      readOnly: false,
                //    }}
                // onClick={openModalProveedor}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cantidad Pedazos"
                value={cantidadRetallo} 
                name="cantidad_retallo"
                error={!!touched.cantidad_retallo && !!errors.cantidad_retallo}
                helperText={touched.cantidad_retallo && errors.cantidad_retallo}
                onChange={(e) => setCantidadRetallo(e.target.value)}
                onKeyDown={handleCantidadRetalloKeyDown}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Sector"
                value={values.sector}
                name="sector"
                onChange={handleChange}
                error={!!touched.sector && !!errors.sector}
                helperText={touched.sector && errors.sector}
                select // Esta propiedad convierte el TextField en un select
                 onClick={() => handleCantidadRetalloKeyDown({ key: 'Enter' })}
              >
                {/* Opciones del select */}
                <MenuItem value="Cargadora">Cargadora </MenuItem>
                <MenuItem value="Sala Limpia">Sala Limpia</MenuItem>
                <MenuItem value="Calandra">Calandra</MenuItem>
                <MenuItem value="AutoClave">AutoClave</MenuItem>
                <MenuItem value="Interfoliacion">Interfoliacion</MenuItem>
                <MenuItem value="Stock">Stock</MenuItem>
                <MenuItem value="Descarga">Descarga</MenuItem>
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                label="Motivo"
                name="motivo"
                value={values.motivo}
                onChange={handleChange}
                error={!!touched.motivo && !!errors.motivo}
                helperText={touched.motivo && errors.motivo}
                select // Esta propiedad convierte el TextField en un select
              >
                {/* Opciones del select */}
                <MenuItem value="Pedazos o Defectos en la Base">
                  Pedazos o Defectos en la Base{" "}
                </MenuItem>
                <MenuItem value="Golpe de Pinza en Descarga">
                  Golpe de Pinza en Descarga
                </MenuItem>
                <MenuItem value="Isopor mal Colocado">
                  Isopor mal Colocado
                </MenuItem>
                <MenuItem value="Paquetes Desalineados">
                  Paquetes Desalineados
                </MenuItem>
                <MenuItem value="Presion Excesivo de la Cinta">
                  Presion Excesivo de la Cinta
                </MenuItem>
                <MenuItem value="Perfil en Descarga">
                  Perfil en Descarga
                </MenuItem>
                <MenuItem value="Caida de Chapa en el Piso">
                  Caida de Chapa en el Piso
                </MenuItem>
                <MenuItem value="Entro mal en la Maquina">
                  Entro mal en la Maquina
                </MenuItem>
              </TextField>

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
            </Box>
            <Box mt={4}>
              <Typography variant="h6">
                Arrastra y suelta los items aquí:
              </Typography>
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed #cccccc",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: isDragActive
                    ? "rgb(206, 220, 0)"
                    : "transparent",
                  height: isDragActive ? "200px" : "100px", // Ajuste de altura basado en isDragActive
                  transition: "height 0.3s ease-in-out", // Transición suave para el cambio de altura
                }}
              >
                <input {...getInputProps()} />
                <Typography sx={{ fontSize: isDragActive ? "1.5rem" : "1rem" }}>
                  {isDragActive
                    ? "Suelte aquí su archivo"
                    : "Arrastra y suelta las fotos aquí, o haz clic para seleccionar archivos"}
                </Typography>
              </Box>
              {dropError && <Typography color="error">{dropError}</Typography>}
              <Box
                mt={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #cccccc",
                  borderRadius: "5px",
                }}
              >
                {droppedItems.map((item, index) => (
                  <Box
                    key={index}
                    mt={2}
                    sx={{ padding: "1vh", alignItems: "center" }}
                  >
                    <Typography sx={{ marginLeft: "5vh" }}>
                      • {item.name}
                    </Typography>
                    <IconButton
                      onClick={() => handleRemoveItem(index)}
                      size="small"
                      sx={{ marginLeft: "1vh" }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <img src={item.preview} alt={item.name} width="100px" />
                  </Box>
                ))}
              </Box>
            </Box>
            <Box mt={2}>
              {/* Botón Agregar con texto "Item" */}
              <Box display="flex" alignItems="center" mb={2}>
                <IconButton color="primary" onClick={handleAddRow}>
                  Agregar Item
                </IconButton>
              </Box>
            </Box>

            <Box mt={2}>
              {/* Botón Agregar con texto "Item" */}
              <Box display="flex" alignItems="center" mb={2}>
                <IconButton color="withe" onClick={handleAddRow}>
                  <AddCircleIcon />
                </IconButton>
                <Typography variant="body1" sx={{ marginLeft: "0.5vw" }}>
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
                  sx={{ marginBottom: "10px" }}
                >
                  <Grid item xs={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="ID"
                      value={row.id}
                      InputProps={{
                        readOnly: true, // Hacer que el campo sea de solo lectura
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={`Medida ${index + 1}`}
                      value={row.medida}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[index].medida = e.target.value;
                        setRows(newRows);
                      }}
                      error={!!fieldErrors[`medida_${index}`]}
                      helperText={fieldErrors[`medida_${index}`]}
                    />
                   
                  </Grid>
                  {/* <Grid item xs={5}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Obs"
                      value={row.descripcion}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[index].descripcion = e.target.value;
                        setRows(newRows);
                      }}
                      error={!!fieldErrors[`descripcion_${index}`]}
                      helperText={fieldErrors[`descripcion_${index}`]}
                    />
                 
                  </Grid> */}
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Caballete"
                      value={row.id_caballete}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[index].id_caballete = e.target.value;
                        setRows(newRows);
                      }}
                      error={!!fieldErrors[`id_caballete_${index}`]}
                      helperText={fieldErrors[`id_caballete_${index}`]}
                      InputProps={{
                        readOnly: true, // Hacer que el campo sea de solo lectura
                      }}
                      onClick={() => openModalCaballete(index)} 
                    />
                 
                  </Grid>
                  {/* <Grid item xs={3}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Almacenamiento"
                        value={row.id_caballete}
                        InputProps={{
                          readOnly: true, // Hacer que el campo sea de solo lectura
                        }}
                        onClick={() => openModalCaballete(index)} // Pasar el índice correcto
                      />
                    </Grid> */}

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

            <ModalProveedor
              open={modalProveedorOpen} // Estado del modal de proveedors
              onClose={() => setModalProveedorOpen(false)} // Cerrar el modal de Proveedors
              onSelect={(proveedor) =>
                handleSelectProveedor(proveedor, setFieldValue)
              } // Lógica para seleccionar productos
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
   cod_paquete: yup.string().required("Requerido"),
  //  cantidad_retallo: yup.number().required("Requerido"),
   id_proveedor: yup.number().required("Requerido"),
   sector: yup.string().required("Requerido"),
   motivo: yup.string().required("Requerido"),
  //  medida: yup.string().required("Requerido"),
  //  descripcion: yup.string().required("Requerido"),


});

export default Quiebra;