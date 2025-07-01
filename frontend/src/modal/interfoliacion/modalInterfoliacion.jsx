import React, { useState, useEffect } from 'react';
  import { Box, Modal, Button, List, ListItem, ListItemText, InputBase, IconButton } from '@mui/material';
  import { DataGrid } from '@mui/x-data-grid'; // Asegúrate de instalar y usar @mui/x-data-grid
  import SearchIcon from '@mui/icons-material/Search';
  import { useTheme } from '@mui/material/styles'; // Importa useTheme desde MUI
  import { tokens } from '../../theme'; // Asegúrate de que tokens esté definido en tu tema
  import { getCaballete } from '../../services/caballete.services'; // Asegúrate de tener este servicio
import { getDatosInterfolacionColar, getIdColar, getReprintColar } from '../../services/interfoliacion.services';
import dayjs from "dayjs";
import QRCode from 'qrcode'
import ModalError from '../modalError';
import ModalCharge from '../modalCharge';
import ModalSuccess from '../modalSucces';

  const ModalInterfoliacion = ({ open, onClose, onSelect }) => {
    const [productos, setProductos] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([{}]); // Estado para almacenar las filas seleccionadas
    const [searchValue, setSearchValue] = useState("");
     const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
       const [errorMessage, setErrorMessage] = useState(''); // Estado para guardar posibles errores
       const [registrationError, setRegistrationError] = useState(false);
       const [error, setError] = useState("");
       const [isLoading, setIsLoading] = useState(false);
       const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
      { field: "id", headerName: "ID", flex: 1 },
      { field: "serie", headerName: "Serie", flex: 2, cellClassName: "name-column--cell", },
      { field: "cod", headerName: "Codigo", flex: 3,  },
      { field: "medidas", headerName: "Medidas", flex: 2, cellClassName: "name-column--cell", },
    ];

    useEffect(() => {
      const fetchProductos = async () => {
        if (open) { // Solo hacer la solicitud si el modal está abierto
          try {
            const response = await getDatosInterfolacionColar(); // Usa serviceType aquí
            setProductos(response);
            setFilteredData(response);
          } catch (error) {
            console.error("Error al obtener datos del backend:", error);
          }
        }
      };
  
      fetchProductos();
    }, [open]); // Dependencia en la prop 'open'
  

    const handleSearchChange = (event) => {
      setSearchValue(event.target.value);

      const filtered = productos.filter((producto) =>
        producto.descripcion
          ? producto.descripcion
              .toLowerCase()
              .includes(event.target.value.toLowerCase())
          : false
      );

      setFilteredData(filtered);
    };

    // const handleRowClick = (params) => {
    //   const selected = params.row;
    //   setSelectedRows((prevSelectedRows) => [...prevSelectedRows, selected]); // Añade la fila seleccionada al estado
    // };

    const handleCloseModalError = () => {
      setRegistrationError(false);
    };

    const handleCloseModalSucces = () => {
      setRegistrationSuccess(false);
      onClose();
      
    };
  
  

    const handleUpdate = async () => {

      
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));



       try {
        const response = await getIdColar(); 

        setRegistrationSuccess(true);
        const {cod, descripcion, total_peso, cod_interno, peso, colar, create_at, cantidad } = response[0];
        const fecha = dayjs().format("DD/MM/YYYY HH:mm");
    
        const ticketData = {
          cod: cod,
          descripcion: descripcion,
         //  cantidad_entrada: cantidad_entrada,
          colar: colar,
          fecha: fecha,
          cod_interno: "NSA123",
          total_peso: total_peso,
          cantidad: cantidad,
    
        };
        // Call function to print ticket
        generateZPL(ticketData);


       } catch (error) {
        console.error("Error al enviar los datos", error);
        setRegistrationError(true);

      } finally {
        setTimeout(() => {
          setIsLoading(false);  
          handleCloseModalSucces();
          
        }, 1500);
      }
    };


  // const generateZPL = async (values) => {

  //     const qrImageUrl = await QRCode.toDataURL(values.colar, { errorCorrectionLevel: 'H' }).catch(error => {
  //     console.error('Error generando el QR:', error);
  //     return null; // Retorna null en caso de error
  //   });

    
  //   const formatText = (text, maxLength) => {
  //     const words = text.split(" ");
  //     let lines = [];
  //     let currentLine = "";
    
  //     for (let word of words) {
  //       if ((currentLine + word).length > maxLength) {
  //         lines.push(currentLine.trim());
  //         currentLine = word + " ";
  //       } else {
  //         currentLine += word + " ";
  //       }
  //     }
    
  //     if (currentLine.trim()) {
  //       lines.push(currentLine.trim());
  //     }
    
  //     return lines;
  //   };
    
  //   // Dividir la descripción y el código en líneas


    
  //   const descripcionLines = formatText(values.descripcion, 48);
  //   const codLines = formatText(values.cod, 43);
    
  //   let zpl = `
  //     ^XA
  //     ^PW800        // Ancho de la etiqueta (400 puntos = 10 cm)
  //     ^LL400        // Longitud de la etiqueta (200 puntos = 5 cm)
  //   `;
    
  //   // Agregar las líneas del código (cod) al ZPL
  //   descripcionLines.forEach((line, index) => {
  //     zpl += `^FO85,${260 + index * 30}^A0N,30,30^FD${line}^FS\n`;
  //   });
    
  //   zpl += `
  //     ^FO85,${80 + descripcionLines.length * 30 + 30}^A0N,30,30^FDCantidad: ${values.cantidad}^FS
  //     ^FO340,170^A0N,30,35^FDPeso:^FS
  //     ^FO340,200^A0N,30,35^FD${values.total_peso}${" Kg"}^FS
    
  //     // Código QR, más grande
  //     //^FO580,80^BQN,2,7^FDQA,${values.colar}^FS
    
  //     ^FO530,30^A0N,30,35^FD${values.fecha}^FS
  //     ^FO85,30^A0N,30,35^FDColar:  ${values.colar}^FS

  //     ^XZ
  //   `;
    
    
  
  //   if (window.BrowserPrint) { // Asegúrate de que BrowserPrint está disponible
  //     window.BrowserPrint.getDefaultDevice("printer", 
  //     (device) => {
  //         if (device) {
  //         setPrinterInfo(`Dispositivo predeterminado encontrado: ${device.name}`);
  //         let zplCommand = zpl;
  
  //         // 3. Usar la función send para enviar los datos al dispositivo
  //         device.send(zplCommand, function(response) {
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


    const generateZPL = async (values) => {

      const qrImageUrl = await QRCode.toDataURL(values.colar, { errorCorrectionLevel: 'H' }).catch(error => {
      console.error('Error generando el QR:', error);
      return null; // Retorna null en caso de error
    });

    
  const formatText = (text, maxLength) => {
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + word).length > maxLength) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
};
    
    // Dividir la descripción y el código en líneas


    
 const descripcionLines = formatText(values.descripcion, 40); // o 40 según el tamaño de letra
  
  function generarBloqueDescripcion(startY, x, fontSizeY = 28, fontSizeX = 28, lineSpacing = 40) {
    return descripcionLines.map((line, index) => {
      const y = startY - (index * lineSpacing);
      return `^FO${y},${x}^A0R,${fontSizeY},${fontSizeX}^FD${line}^FS`;
    }).join('\n');
  }
  const bloqueDescripcion1 = generarBloqueDescripcion(300, 50);
  const bloqueDescripcion2 = generarBloqueDescripcion(300, 800);
  const bloqueDescripcion3 = generarBloqueDescripcion(300, 1600);
  
  
  let zpl = `
      ^XA
  ^POI
  ^PW820
  ^LL2420
  
  ^FO700,50^A0R,30,30^FDNumero de Serie:${values.colar}^FS
  ^FO650,50^A0R,25,30^FD${values.fecha}^FS
  
  ^FO580,50^A0R,30,30^FDCant. Chapa:^FS
  ^FO520,90^A0R,30,30^FD${values.cantidad}^FS
  
  ^FO580,300^A0R,30,30^FDPeso:^FS
  ^FO520,330^A0R,30,30^FD${values.peso}^FS
  
  ^FO420,50^A0R,25,30^FDFABRICA:${values.serie}^FS
  ^FO370,50^A0R,30,30^FD${values.cod}^FS
  
  ${bloqueDescripcion1}
  
  
  ^FO500,500^BQN,2,8^FDQA,${values.colar}^FS
  ^FO100,740^GB700,3,3,B,0^FS
  
  ^FO700,800^A0R,30,30^FDNumero de Serie:${values.colar}^FS
  ^FO650,830^A0R,25,30^FD${values.fecha}^FS
  
  ^FO580,800^A0R,30,30^FDCant. Chapa:^FS
  ^FO520,850^A0R,30,30^FD${values.cantidad}^FS
  
  ^FO580,1080^A0R,30,30^FDPeso:^FS
  ^FO520,1110^A0R,30,30^FD${values.peso}^FS
  
  ^FO420,800^A0R,25,30^FDFABRICA:${values.serie}^FS
  ^FO370,800^A0R,30,30^FD${values.cod}^FS
  
  ${bloqueDescripcion2}
  
  ^FO500,1350^BQN,2,8^FDQA,${values.colar}^FS
  ^FO100,1550^GB700,3,3,B,0^FS
  
  ^FO700,1600^A0R,30,30^FDNumero de Serie:${values.colar}^FS
  ^FO650,1630^A0R,25,30^FD${values.fecha}^FS
  
  ^FO580,1600^A0R,30,30^FDCant. Chapa:^FS
  ^FO520,1650^A0R,30,30^FD${values.cantidad}^FS
  
  ^FO580,1880^A0R,30,30^FDPeso:^FS
  ^FO520,1910^A0R,30,30^FD${values.peso}^FS
  
  ^FO420,1600^A0R,25,30^FDFABRICA:${values.serie}^FS
  ^FO370,1600^A0R,30,30^FD${values.cod}^FS
  ${bloqueDescripcion3}
  ^FO500,2150^BQN,2,8^FDQA,${values.colar}^FS
  
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


  const handleReprint = async () => {

    // setIsLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await getReprintColar(); // Usa serviceType aquí
      const {cod, descripcion, total_peso, cod_interno, peso, colar, create_at, cantidad } = response;
      const fecha = dayjs().format("DD/MM/YYYY HH:mm");
      console.log("response", response);
      const ticketData = {
        cod: cod,
        descripcion: descripcion,
       //  cantidad_entrada: cantidad_entrada,
        colar: colar,
        fecha: fecha,
        cod_interno: "NSA123",
        total_peso: total_peso,
        cantidad: cantidad,
  
      };
      // Call function to print ticket
      generateZPL(ticketData);
    } catch (error) {
      console.error("Error al obtener datos del backend:", error);
    }

  }
    return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-horario-title"
        aria-describedby="modal-horario-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        BackdropProps={{
          style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Ajustar opacidad del fondo
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary[600],
            paddingLeft: "10px",
            paddingTop: "5px",
            paddingRight: "10px",
            paddingBottom: "10px!important",
            zIndex: 1500,
          }}
        >
          <Box m="0px">
            <Box display="flex" justifyContent="space-between" p={2}>
              <h1 id="owner-modal-title">Interfoliados</h1>
              <Box
                display="flex"
                backgroundColor={colors.primary[400]}
                borderRadius="3px"
                height={"40%"}
                width={"40%"}
                marginTop={"3%"}
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
            <Box
              m="10px 0"
              height="70vh"
              width="80vh"
              sx={{
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-cell": { borderBottom: "none" },
                "& .name-column--cell": { color: colors.greenAccent[300] },
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
              }}
            >
              <DataGrid
                // checkboxSelection
                rows={filteredData}
                columns={columns}
                // onRowClick={handleRowClick}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="end"
            alignItems="center"
            width="100%"
            height="10vh"
          >
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              onClick={handleReprint}
              sx={{
                backgroundColor: "rgb(206, 220, 0)",
                border: "none",
                color: "black",
                height: "6vh",
                width: "9vw",
                borderRadius: "20px",
                cursor: "pointer",
                marginRight: "1vw",

                "&:hover": { backgroundColor: "#bac609" },
              }}
            >
              Reimprimir
            </Button>

            <Button
              type="submit"
              color="secondary"
              variant="contained"
              onClick={handleUpdate}
              sx={{
                backgroundColor: "rgb(206, 220, 0)",
                border: "none",
                color: "black",
                height: "6vh",
                width: "9vw",
                borderRadius: "20px",
                cursor: "pointer",
                marginRight: "1vw",

                "&:hover": { backgroundColor: "#bac609" },
              }}
            >
              Crear Colar
            </Button>
          </Box>
          <ModalError
          open={registrationError}
          onClose={handleCloseModalError}
          error={error}
        />
         <ModalCharge isLoading={isLoading} />
         <ModalSuccess open={registrationSuccess} onClose={handleCloseModalSucces} />
        </Box>
      </Modal>
    );
  };
  
  export default ModalInterfoliacion;