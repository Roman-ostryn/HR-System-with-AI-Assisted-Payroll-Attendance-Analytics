import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";

import { getCaballetePal, getDatosPalitero, getIdColar, getIdColarPalitero, getIdColarPReprint } from "../../services/palitero.services";
import SaveIcon from '@mui/icons-material/Save';
import dayjs from "dayjs";
import QRCode from 'qrcode'
import ModalInterfoliacion from "../../modal/interfoliacion/modalInterfoliacion";
import ModalPalitero from "../../modal/palitero/modalPalitero";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import Alert from '@mui/material/Alert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import ModalCharge from "../../modal/modalCharge";
import ModalError from "../../modal/modalError";
import { getColaresxd } from "../../services/interfoliacion.services";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalColar from "../../modal/colar/modalColar";


const Reembalar = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = useState(false);
  const [registro, setRegistro] = useState(null);
     const [errorMessage, setErrorMessage] = useState(''); // Estado para guardar posibles errores
       const [registrationError, setRegistrationError] = useState(false);
       const [error, setError] = useState("");
       const [isLoading, setIsLoading] = useState(false);
       const [registrationSuccess, setRegistrationSuccess] = useState(false);
         const [modalOpen, setModalOpen] = useState(true);
         const [openColar, setopenColar] = useState(false);
         const [showAlert, setShowAlert] = useState(false);
         const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [selectedRow, setSelectedRow] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  
  // Obtener datos de la vista al cargar el componente
  const fetchPrueba = async () => {
    try {
      // const response = await getDatosPalitero();
      const response = await getColaresxd();

      setData(response);
      setFilteredData(response);
    } catch (error) {
      console.error("Error al obtener los datos del backend:", error);
    }
  };

  useEffect(() => {
    fetchPrueba();
  }, []);

  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };


  const handleRowClick = (params) => {
    setRegistro(params.row); // Guarda el registro seleccionado

    // setopenColar(true);
  };
  const handleReprint = async () => {
    handleColar();
  }

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    if (Array.isArray(data)) {
      const filtered = data.filter(
        (item) =>
          item.id.toString().includes(value) ||
          item.cod.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };
  const handleCloseModalSucces = () => {
    setRegistrationSuccess(false);
    // onClose();
    
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };


  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget); // Asignar el menú ancla
    setSelectedRow(row); // Guardar la fila seleccionada
  };

      const handleDelete = (row) => {
      
    }
      const handleEdit = (row) => {
      console.log("Editar fila:", row);
      // setSelectedRow(row);
      setRegistro(row);
      setopenColar(true);
    }
  const columns = [
    {
      field: "menu",
      headerName: "",
      flex: 0.2,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleMenuClick(event, params.row)}>
          <MenuIcon />
        </IconButton>
      ),
    },
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "descripcion",
      headerName: "Descripcion",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    { field: "colar", headerName: "Colar", flex: 0.5 },
    { field: "cantidad", headerName: "Cantidad", flex: 0.5, cellClassName: "name-column--cell"},
    { field: "caballete", headerName: "Caballete", flex: 0.5 },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)} size="small">
            <EditIcon sx={{ color: "rgb(206, 220, 0)" }} />
          </IconButton>

          {/* <IconButton
            color="error"
            onClick={() => handleDelete(params.row)}
            size="small"
          >
            <DeleteIcon />
          </IconButton> */}
        </Box>
      ),
    },

    // { field: "estado", headerName: "Estado", flex: 0.5, cellClassName: "name-column--cell" },
    // { field: "defecto", headerName: "Defecto", flex: 1, cellClassName: "name-column--cell" },
    //  { field: "serie", headerName: "Serie", flex: 0.7 },
    // {
    //   field: "fecha",
    //   headerName: "Fecha",
    //   cellClassName: "name-column--cell",
    //   flex: 1,
    //   valueGetter: (params) => formatDate(params.row.fecha),
    // },
    // { field: "turno", headerName: "Turno", flex: 1 },
  ];
  

  const generateZPL = async (values) => {

      const qrImageUrl = await QRCode.toDataURL(values.colar, { errorCorrectionLevel: 'H' }).catch(error => {
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
    descripcionLines.forEach((line, index) => {
      zpl += `^FO85,${260 + index * 30}^A0N,30,30^FD${line}^FS\n`;
    });
    
    zpl += `
      ^FO85,${80 + descripcionLines.length * 30 + 30}^A0N,30,30^FDCantidad: ${values.cantidad}^FS
      ^FO340,170^A0N,30,35^FDPeso:^FS
      ^FO340,200^A0N,30,35^FD${values.total_peso}${" Kg"}^FS
    
      // Código QR, más grande
      //^FO580,80^BQN,2,7^FDQA,${values.colar}^FS
    
      ^FO530,30^A0N,30,35^FD${values.fecha}^FS
      ^FO85,30^A0N,30,35^FDColar:  ${values.colar}^FS

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


  const handleColar = async () => {

  // if (registro === null) {
  //     setShowAlert(true);
  //   }else{

 

      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const response = await getIdColarPReprint(selectedRow.id);

          setRegistrationSuccess(true);
          const {cod, descripcion, total_peso, cod_interno, peso, colar, create_at, cantidad } = response;
           const fecha = dayjs(create_at).format("DD/MM/YYYY hh:mm");
           const ticketData = {
            cod: cod,
            descripcion: descripcion,
          //  //  cantidad_entrada: cantidad_entrada,
            colar: colar,
            fecha: dayjs().format("DD/MM/YYYY hh:mm"),
            // cod_interno: "NSA123",
            total_peso: total_peso,
            cantidad: cantidad,
      
          };
          // Call function to print ticket
          generateZPL(ticketData);
      } catch (error) {
        console.error("Error al obtener los datos del backend:", error);
        setRegistrationError(true);
        setError(error.message);
      } finally {
        setTimeout(() => {
          setIsLoading(false);  
          handleCloseModalSucces();
          
        }, 1500);
      }



    }; 
    // setModalOpenInterfoliacion(true);


    const handleCloseColar = () => {
      setopenColar(false);
      // fetchPrueba();
      // handleMenuClose();
    }

    const handleCloseModalError = () => {
      setRegistrationError(false);
    };
  

    useEffect(() => {
      if (registro !== null) {
        setShowAlert(false);
      }
    }, [registro]);
  
  return (
    <Box m="20px">
      {showAlert && (
        <Box m="20px">
          <Alert
            variant="outlined"
            severity="warning"
            sx={{ marginBottom: "20px" }}
          >
            Primero Seleccione un Palitero para poder Reimprimir
          </Alert>
        </Box>
      )}
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header
          title="Reembalar"
          subtitle="Consulta de Colares"
        />
        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            height={"40%"}
            width={"60%"}
            ml={1}
          >
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Buscar"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box
        m="40px 0 0 0"
        height="70vh"
        
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[900],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[900],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          onRowDoubleClick={handleRowClick} // Abrir modal al hacer doble clic
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </Box>
      <Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >

        <MenuItem onClick={handleReprint}>Imprimir</MenuItem>
        {/* <MenuItem onClick={handleEtiqueta}>Visualizar</MenuItem> */}

      </Menu>

      </Box>
      <Box sx={{ 
          height:"30vh",
          width:"100%",
          // backgroundColor: "red",
         }}>

<Box
              sx={{ paddingRight: "2%", paddingTop: "1%", paddingBottom: "3%" }}
              className="wrap"
            >
              {/* <Button
              
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
                startIcon={<SaveIcon />}
              >
                Registrar
              </Button> */}
              {/* <Button
                type="submit"
                onClick={handleColar}
                sx={{
                  backgroundColor: "rgb(206, 220, 0)",
                  border: "none",
                  color: "black",
                  height: "7vh",
                  width: "10vw",
                  borderRadius: "20px",
                  cursor: "pointer",
                  marginTop: "0vw",

                  "&:hover": { backgroundColor: "#bac609" },
                }}
                startIcon={<LocalPrintshopIcon />}
              >
                REIMPRIMIR
              </Button> */}
            </Box>
        </Box>
        {/* <ModalInterfoliacion
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              // onSelectReImpresion={(data) => {
              //   // Actualizar los valores del usuario seleccionado
              //   setFieldValue("serie", data.serie);
              //   setModalOpen(false);
              // }}
            /> */}

        <ModalColar
        open={openColar}
        onClose={handleCloseColar}
        onSelect={selectedRow} // Mostrar los datos recibidos
        id={registro?.colar}
        
      />
    <ModalCharge isLoading={isLoading} />
    <ModalError
          open={registrationError}
          onClose={handleCloseModalError}
          error={error}
        />
    </Box>
  );
};

export default Reembalar;
