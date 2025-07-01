
import React, { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, TextField, MenuItem, Typography, Grid, IconButton } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import LoadingSpinner from "../../../loadingSpinner";
import ModalSucces from "../../../modal/modalSucces";
import ModalError from "../../../modal/modalError";
import { tokens } from '../../../theme';
import ModalCharge from "../../../modal/modalCharge";
import ModalProducto from "../../../modal/producto/modalProducto";
import ModalProveedor from "../../../modal/proveedor/modalProveedor";
import ModalCaballete from "../../../modal/caballete/modalCaballete";
import ModalCamion from "../../../modal/camiones/modalCamion";
import Header from '../../../components/Header';
import { getOneDatos, PostDatos, getOneDatosTicket, getEntradaNotaFiscal, getOneDatosTicketR } from '../../../services/quiebre.services';
import dayjs from "dayjs";
import QRCode from 'qrcode'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';

import 'react-toastify/dist/ReactToastify.css';

import imageCompression from 'browser-image-compression';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ModalZd from '../../../modal/Facturacion/Exportacion/zd/modalZd';


const   ExportacionZD = () => {

  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState(''); // Estado para guardar posibles errores
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [valuesPrint, setValuesPrint] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  

  const USER = localStorage.getItem('id');
  const Cod_empresa = localStorage.getItem('cod_empresa') || 1;
  const formikRef = useRef(null); // useRef en lugar de useState
  const [selectedIndex, setSelectedIndex] = useState(null); // Estado para mantener el índice
  const [rows, setRows] = useState([{
    id: 1, 
     articulo: '',
     cantidad: '',
     descripcion:'',
     precioU:'',
     partida:'',
     totales:'',


    }]);
  // const initialRows = [{ id: 1, serie: '', cantidad: '', id_caballete:'' }];
  const initialRows = [{
    id: 1, 
     articulo: '',
     cantidad: '',
     descripcion:'',
     precioU:'',
     partida:'',

    }];

  const [fieldErrors, setFieldErrors] = useState({});
  
  const initialValues = {
    
    senores: '',
    direccion: '',
    // telefono: '',
    cnpj: '',
    pais: '',
    ciudad: '',
    bultos: '',
    factura: '',
    totalC: '',
    totalN: '',

    
  };

  const [formData, setFormData] = useState({
    puerto: "",
    aduana: "",
    transporte: "",
  });



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

const handleFormSubmit = async (values) => {


    setIsLoading(true);

  try {
 
    // Construir los valores para enviar
    const valuesToSend = {
      fecha: startDate,
      senores: values.senores,
      direccion: values.direccion,
      // motivo: values.motivo,
      // telefono: values.telefono,
      cnpj: values.cnpj,
      // cod_empresa: parseInt(Cod_empresa) || 1,
      // id_usuario: parseInt(USER), 
      pais: values.pais,
      ciudad: values.ciudad,
      bultos: values.bultos,
      factura: values.factura,
      pesoB: values.pesoB,
      pesoL: values.pesoL,
      totalC: values.totalC,
      totalN: values.totalN,
      volumen: values.volumen,


      data: rows.map((row) => ({
        articulo: row.articulo,
        cantidad: row.cantidad,
        partida: row.partida,
        descripcion: row.descripcion,
        precioU: row.precioU,
        totales: row.totales,

      })),
    };

    setValuesPrint(valuesToSend);
    handleGeneratePDF(valuesToSend)
    // const response = await PostDatosQuiebra(valuesToSend);
    // getTicket(response.resp.cod_paquete);
    // getTicketRetallo(response.resp.id);


    // setRows(initialRows);
    // setRegistrationSuccess(true);
    // resetForm();
    // setDroppedItems([]); 
    // setImagenXd(''); 
    // setCantidadRetallo('');
    // setRows([{ id: 1, medida: '', descripcion: '', id_caballete: '' }]);
    // setFieldErrors({}); // Limpiar los errores de los campos
  } catch (error) {
    console.error("Error al enviar los datos", error);
    setRegistrationError(true);
  } finally {
    setTimeout(() => {
      setIsLoading(false);  
    }, 1500);
  }
};

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const handleSubmit = (values) => {
    // const zplString = generateZPL(values, selectedCaballete);
    // Aquí puedes agregar cualquier otra lógica que necesites, como enviar el ZPL a un servidor.
};



const handleGeneratePDF = async (valuesToSend) => {
  if (!valuesToSend || !valuesToSend.senores) {
    return;
  }

  const doc = new jsPDF();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formattedDate = formatDate(valuesToSend.fecha);

  try {

// Línea rectangular de separación en el encabezado
doc.setLineWidth(0.3); 
doc.rect(5, 10, 125, 67);

  const img = new Image();
  img.src = "../../assets/drac.png"; // Convierte tu PDF en imagen
        
    // Encabezado de la factura
    // Encabezado de la factura
doc.addImage(img, 'PNG',13, 12, 110, 15); 

    // doc.setFontSize(16);
    doc.setFontSize(8.3);

    doc.setFont("helvetica", "bold");
    // doc.text("GRUPO DRACENA S.A", 15, 20);
    doc.setFontSize(8.3);
    doc.text("Fabricación y transformación de productos diversos", 30, 30);
    doc.text("por cuenta de terceros(MAQUILA)", 35, 33);
    doc.text("Km 24 Acaray, Minga Guazú - Alto Paraná - Paraguay", 30, 37);
    doc.text("Cel.: (0982) 491-819", 50, 40);


// Dibujar la primera línea vertical (separa el encabezado de la información del timbrado)
doc.setLineWidth(0.3);
doc.line(130, 10, 130, 69); // Línea vertical a la izquierda

// Dibujar la segunda línea vertical (otra separación entre encabezado y timbrado)
doc.line(134, 10, 134, 70); // Línea vertical a la derecha

// Línea rectangular de separación en el encabezado
doc.setLineWidth(0.3); 
doc.rect(134, 10, 71, 67);
    // Información del timbrado y la factura
    doc.text("TIMBRADO N° 17992078", 150, 20);
    doc.text("R.U.C: 80070434-7", 150, 25);
    doc.text("Factura de Exportación", 150, 30);
    
    doc.text("Fecha Inicio Vigencia: 28/04/2025", 150, 35);
    doc.text("Fecha Fin Vigencia: 30/04/2026", 150, 40);

    doc.setFontSize(17);
    doc.text(`N° ${valuesToSend.factura}`, 140, 55);

    // Información del cliente
    doc.setFontSize(8.3);
    // doc.text(`Fecha:        ${formattedDate}`, 15, 50);
    // doc.text(`Señores:    ${valuesToSend.senores}`, 15, 55);
    // doc.text(`País:           ${valuesToSend.pais}`, 15, 60);
    // doc.text(`Dirección:  ${valuesToSend.direccion}`, 15, 65);
    // doc.text(`Cnpj:          ${valuesToSend.cnpj}`, 15,70);
    // doc.text(`Ciudad:      ${valuesToSend.ciudad}`, 15, 75);
    // doc.text(`Teléfono: ${valuesToSend.telefono || "N/A"}`, 15, 65);
// Función para agregar texto con formato
function addTextWithBoldValue(title, value, x, y) {
  doc.setFont('helvetica', 'normal');
  doc.text(title, x, y);
  doc.setFont('helvetica', 'bold');
  doc.text(value, x + doc.getTextWidth(title), y);
}

addTextWithBoldValue('Fecha:       ', formattedDate, 15, 50);
addTextWithBoldValue('Señores:   ', valuesToSend.senores, 15, 55);
addTextWithBoldValue('País:          ', valuesToSend.pais, 15, 60);
addTextWithBoldValue('Dirección: ', valuesToSend.direccion, 15, 65);
addTextWithBoldValue('Cnpj:         ', valuesToSend.cnpj, 15, 70);
addTextWithBoldValue('Ciudad:     ', valuesToSend.ciudad, 15, 75);
    // // Línea de separación
    // doc.setLineWidth(0.5);
    // doc.line(10, 70, 200, 70);

    // Ajusta el grosor de la línea
   

    
    // rectangulo de separación
    doc.setLineWidth(0.3); 
    doc.rect(5, 82, 200, 200);

// Función para insertar salto de línea
function addLineBreak(text, maxLength) {
  let result = '';
  let currentLine = '';

  for (let char of text) {
    if (currentLine.length >= maxLength && char === ' ') {
      result += currentLine + '\n';
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  result += currentLine; // Agregar el resto del texto
  return result;
}

    // Tabla de productos
    let yPosition = 90;
    doc.setFont('helvetica', 'normal');
    const items = valuesToSend.data;
    doc.setFontSize(8.3);
    doc.text("Cantidad", 7, yPosition);
    // doc.text("P.Arancelaria", 28.9, yPosition);
    doc.text("NCM", 50, yPosition);
    doc.text("U.M.",30, yPosition);


    doc.text("Descripción", 99, yPosition);
    doc.text("Precio Unit.", 166, yPosition);
    doc.text("Total", 190, yPosition);

        // Línea de separación
    doc.setLineWidth(0.3);
    doc.line(5, 92, 204, 92);

    yPosition += 10;
    
    items.forEach((item, index) => {

      doc.setFont('helvetica', 'bold');
    doc.text(`${item.cantidad}`, 6.5, yPosition);

    doc.text(` M2`, 30, yPosition);


  // LINEA CANTIDAD
    doc.setLineWidth(0.3);
    doc.line(25.7, 82, 25.7, 282); // Línea vertical a la izquierda

    // LINEA PARTIDA
    doc.setLineWidth(0.3);
    doc.line(67, 82, 67, 282); // Línea vertical a la izquierda

    // LINEA UNIDAD DE MEDIDA
        doc.setLineWidth(0.3);
        doc.line(41, 82, 41, 282); // Línea vertical a la izquierda
    
    // LINEA DESCRIPCION
    doc.setLineWidth(0.3);
    doc.line(164, 82, 164, 292); // Línea vertical a la izquierda

        // LINEA PRECIO UNITARIO
        doc.setLineWidth(0.3);
        doc.line(187, 82, 187, 282); // Línea vertical a la izquierda
    

      doc.text(`${item.partida}`, 43, yPosition);
      let text = `${item.descripcion}${"; "}${item.articulo}`;
let formattedText = addLineBreak(text, 45);
doc.text(formattedText, 69, yPosition);

      doc.text(`${item.precioU}`, 169, yPosition);
      doc.text(`${item.totales}`, 190, yPosition);
      yPosition += 10;
    });

    // Total General
    const totalGeneral = valuesToSend.totalN;
    doc.setFontSize(8.3);
    doc.setFont('helvetica', 'normal');

    doc.text(`TOTAL: `, 9,  288.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${totalGeneral} USD`, 172,  288.5);


     // rectangulo de separación
     doc.setLineWidth(0.3); 
     doc.rect(5, 82, 200, 210);

     doc.setFontSize(8);
 

     doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

     doc.text(`Total ${valuesToSend.volumen}: ${valuesToSend.bultos}${" Volumenes"}`, 70, 220);
     doc.text(`Puerto de embarque y salida: ${"Minga Guazu - Py"}`, 70, 230);
     doc.text(`Aduana de ingreso: ${"Foz do Iguaçu - Br"}`, 70, 234);
     doc.text(`Transporte de ingreso: ${"Terrestre"}`, 70, 238);
     doc.text(`FCA ${"- MINGA GUAZU"}`, 70, 252);
 
 
    //  doc.setFont("helvetica", "bold");
     doc.setFontSize(8.3);
     doc.text(` ${valuesToSend.totalC}${" m²"}`, 7, 220);
     doc.text(`Peso Liquido: ${valuesToSend.pesoL}${"Kg"}`, 70, 243);
     doc.text(`Peso Bruto: ${valuesToSend.pesoB}${"Kg"}`, 70, 247);
 
 
     // Opcional: Establecer el grosor de la línea
     doc.setLineWidth(0.5);
     // Dibuja una línea horizontal desde (31, 215) hasta (80, 215)
     doc.line(7, 215, 23, 215);


    // Guardar el PDF
    doc.save("Factura_Exportacion.pdf");
  } catch (error) {
    console.error("Error al generar el PDF:", error);
  }
};


  return (
    <Box sx={{ padding: "20px", height: "90vh", overflowY: "auto" }}>
      <Header
        title="EXPORTACION ZD"
        subtitle="Impresion de Facturas de Exportacion"
      />
      {isLoading && <LoadingSpinner />}
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
               
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Seleccione una Fecha"
                    value={startDate || null} // Evita que value sea undefined
                    onChange={(newValue) =>
                      setStartDate(newValue ? dayjs(newValue) : null)
                    }
                    format="DD/MM/YYYY"
                  />
                </DemoContainer>
              </LocalizationProvider>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="N° Factura"
                value={values.factura}
                name="factura"
                error={!!touched.factura && !!errors.factura}
                helperText={touched.factura && errors.factura}
                
                onChange={handleChange}

                // onKeyDown={handleCantidadRetalloKeyDown}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Señores"
                value={values.senores}
                name="senores"
                error={!!touched.senores && !!errors.senores}
                helperText={touched.senores && errors.senores}
                onChange={handleChange}
                
                InputProps={{
                  readOnly: true,
                }}
                onClick={() => setModalOpen(true)}
              
                // onKeyDown={handleCantidadRetalloKeyDown}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Direccion"
                value={values.direccion}
                name="direccion"
                error={!!touched.direccion && !!errors.direccion}
                helperText={touched.direccion && errors.direccion}
                onChange={handleChange}

                // onKeyDown={handleCantidadRetalloKeyDown}
              />
              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Telefono"
                value={values.telefono}
                name="telefono"
                error={!!touched.telefono && !!errors.telefono}
                helperText={touched.telefono && errors.telefono}
                onChange={handleChange}

                // onKeyDown={handleCantidadRetalloKeyDown}
              /> */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="CNPJ"
                value={values.cnpj}
                name="cnpj"
                error={!!touched.cnpj && !!errors.cnpj}
                helperText={touched.cnpj && errors.cnpj}
                onChange={handleChange}

                // onKeyDown={handleCantidadRetalloKeyDown}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Pais"
                value={values.pais}
                name="pais"
                error={!!touched.pais && !!errors.pais}
                helperText={touched.pais && errors.pais}
                onChange={handleChange}

                // onKeyDown={handleCantidadRetalloKeyDown}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Ciudad"
                value={values.ciudad}
                name="ciudad"
                error={!!touched.ciudad && !!errors.ciudad}
                helperText={touched.ciudad && errors.ciudad}
                onChange={handleChange}

                // onKeyDown={handleCantidadRetalloKeyDown}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Total Bultos"
                value={values.bultos}
                name="bultos"
                error={!!touched.bultos && !!errors.bultos}
                helperText={touched.bultos && errors.bultos}
                onChange={handleChange}

                // onKeyDown={handleCantidadRetalloKeyDown}
              />
               <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Peso Liquido"
                value={values.pesoL}
                name="pesoL"
                error={!!touched.pesoL && !!errors.pesoL}
                helperText={touched.pesoL && errors.pesoL}
                onChange={handleChange}

                // onKeyDown={handleCantidadRetalloKeyDown}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Peso Bruto"
                value={values.pesoB}
                name="pesoB"
                error={!!touched.pesoB && !!errors.pesoB}
                helperText={touched.pesoB && errors.pesoB}
                onChange={handleChange}

                // onKeyDown={handleCantidadRetalloKeyDown}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Total Cantidad"
                value={values.totalC}
                name="totalC"
                error={!!touched.totalC && !!errors.totalC}
                helperText={touched.totalC && errors.totalC}
                onChange={handleChange}

                // onKeyDown={handleCantidadRetalloKeyDown}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Total Neto"
                value={values.totalN}
                name="totalN"
                error={!!touched.totalN && !!errors.totalN}
                helperText={touched.totalN && errors.totalN}
                onChange={handleChange}

                // onKeyDown={handleCantidadRetalloKeyDown}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Volumen"
                name="volumen"
                value={values.volumen}
                onChange={handleChange}
                error={!!touched.volumen && !!errors.volumen}
                helperText={touched.volumen && errors.volumen}
                select // Esta propiedad convierte el TextField en un select
              >
                {/* Opciones del select */}
                <MenuItem value="Rollo">
                  Rollo
                </MenuItem>
                <MenuItem value="Bultos">
                  Bultos
                </MenuItem>
                
              </TextField>

              {/*  */}
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
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={`Articulo ${index + 1}`}
                      value={row.articulo}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[index].articulo = e.target.value;
                        setRows(newRows);
                      }}
                      error={!!fieldErrors[`articulo_${index}`]}
                      helperText={fieldErrors[`articulo_${index}`]}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={`Cantidad`}
                      value={row.cantidad}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[index].cantidad = e.target.value;
                        setRows(newRows);
                      }}
                      error={!!fieldErrors[`cantidad_${index}`]}
                      helperText={fieldErrors[`cantidad_${index}`]}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Partida"
                      value={row.partida}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[index].partida = e.target.value;
                        setRows(newRows);
                      }}
                      error={!!fieldErrors[`partida_${index}`]}
                      helperText={fieldErrors[`partida_${index}`]}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Descripcion"
                      value={row.descripcion}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[index].descripcion = e.target.value;
                        setRows(newRows);
                      }}
                      error={!!fieldErrors[`descripcion_${index}`]}
                      helperText={fieldErrors[`descripcion_${index}`]}
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={`Precio unit.`}
                      value={row.precioU}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[index].precioU = e.target.value;
                        setRows(newRows);
                      }}
                      error={!!fieldErrors[`precioU_${index}`]}
                      helperText={fieldErrors[`precioU_${index}`]}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={`Totales`}
                      value={row.totales}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[index].totales = e.target.value;
                        setRows(newRows);
                      }}
                      error={!!fieldErrors[`totales_${index}`]}
                      helperText={fieldErrors[`totales_${index}`]}
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
            <Box
              sx={{ paddingRight: "2%", paddingTop: "3%", paddingBottom: "3%" }}
              className="wrap"
            >
              <Button
                type="submit"
                onClick={handleFormSubmit}
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
                }
              }
              startIcon={<DescriptionIcon />}

              >
                Generar Factura
              </Button>
            </Box>

            <ModalCharge isLoading={isLoading} />
            <ModalZd
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onSelect={(data) => {
                // Actualizar los valores del usuario seleccionado
                setFieldValue("senores", data.senores);
                setFieldValue("direccion", data.direccion);
                // setFieldValue("telefono", data.telefono);
                setFieldValue("cnpj", data.CNPJ);
                setFieldValue("pais", data.pais);
                setFieldValue("ciudad", data.ciudad);
                setFormData("puerto", data.puerto);
                setFormData("aduana", data.aduana);
                setFormData("transporte", data.transporte);




                setModalOpen(false);
              }}
            />
         
           
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  //  fecha: yup.string().required("Requerido"),
  //  cantidad_retallo: yup.number().required("Requerido"),
   senores: yup.string().required("Requerido"),
   direccion: yup.string().required("Requerido"),
  //  telefono: yup.string().required("Requerido"),
   cnpj: yup.string().required("Requerido"),
   pais: yup.string().required("Requerido"),
   ciudad: yup.string().required("Requerido"),
   bultos: yup.string().required("Requerido"),
   factura: yup.string().required("Requerido"),
   pesoL: yup.string().required("Requerido"),
   pesoB: yup.string().required("Requerido"),
   totalC: yup.string().required("Requerido"),
   totalN: yup.string().required("Requerido"),





   
   

  //  medida: yup.string().required("Requerido"),
  //  descripcion: yup.string().required("Requerido"),


});

export default ExportacionZD;