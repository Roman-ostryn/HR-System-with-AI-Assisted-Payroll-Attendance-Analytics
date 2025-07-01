  // import React, { useState, useEffect } from 'react';
  // import { Box, Modal, Button, List, ListItem, ListItemText } from '@mui/material';
  // import { getSalarios } from '../../services/salarios.services'; // Asegúrate de tener este servicio
  import React, { useState, useEffect } from 'react';
  import { Box, Modal, Button, List, ListItem, ListItemText, InputBase, IconButton } from '@mui/material';
  import { DataGrid } from '@mui/x-data-grid'; // Asegúrate de instalar y usar @mui/x-data-grid
  import SearchIcon from '@mui/icons-material/Search';
  import { useTheme } from '@mui/material/styles'; // Importa useTheme desde MUI
  import { tokens } from '../../theme'; // Asegúrate de que tokens esté definido en tu tema
  import { getDatosProducto } from '../../services/productos.services'; // Asegúrate de tener este servicio
import { getOneDatosImagen, getOneDatosRetallos, getOneDatosTicketR } from '../../services/quiebre.services';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import dayjs from "dayjs";
import QRCode from 'qrcode'
import ModalImage from '../imagen/modalImagen';

  const ModalRetallo = ({ open, onClose, onSelectProduct, id }) => {
    const [productos, setProductos] = useState([]);
    const [idRetallo, setIdRetallo] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [imagen, setImagen] = useState([]);
    const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
    const [errorMessage, setErrorMessage] = useState(''); 
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
      if (id) {
        setIdRetallo(id);
        // Puedes usar el id para hacer llamadas al backend o manejar lógica adicional
      }
    }, [id]);



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

    const columns = [
      { field: "id", headerName: "ID", flex: 0.5 },
      { field: "cod", headerName: "Codigo", flex: 1.5, cellClassName: "name-column--cell"},
      { field: "descripcion", headerName: "Descripcion", flex: 3 },
      { field: "serie", headerName: "Serie", flex: 1, cellClassName: "name-column--cell", },
      { field: "medidas", headerName: "Medidas", flex: 1 },
      {
        field: "descripcion_caballete",
        headerName: "Almacenamiento",
        flex: 1,
        cellClassName: "name-column--cell",
      },
      {
        field: "create_at",
        headerName: "Fecha",
        flex: 1,
        valueGetter: (params) => formatDate(params.row.create_at),
      },
    ];

    const handleCloseModal = () => {
      setOpenModal(false);
      // fetchPrueba();
      // handleMenuClose();
    }

    const getTicketRetallo = async (idRetallo) => {
      const response = await getOneDatosTicketR(idRetallo);
    
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
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
  
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
    useEffect(() => {
      // Obtener los salarios desde la base de datos
      const fetchProductos = async () => {
        try {
          const response = await getOneDatosRetallos(idRetallo);
          setProductos(response);
          setFilteredData(response);
        } catch (error) {
          console.error("Error al obtener datos del backend:", error);
        }
      };

      if(idRetallo != null){
        fetchProductos();
      }
      
    }, [idRetallo]);

    useEffect(() => {
      // Obtener las imágenes desde la base de datos
      const fetchProductos = async () => {
        try {
          const response = await getOneDatosImagen(idRetallo);

          if (response && response[0]?.imagen) {
            // Verifica que el campo 'imagen' exista en la posición 0
            const rutasImagenes = response[0].imagen.split(","); // Divide las rutas por comas
            setImagen(rutasImagenes); // Guarda el arreglo de rutas en el estado
          } else {
            console.warn(
              "No se encontró el campo 'imagen' en la posición 0 de la respuesta:",
              response
            );
          }
        } catch (error) {
          console.error("Error al obtener datos del backend:", error);
        }
      };
      if(idRetallo != null){
        fetchProductos();
      }
    }, [idRetallo]);

    const handleSearchChange = (event) => {
      setSearchValue(event.target.value);

      const filtered = productos.filter((producto) =>
        producto.cod
          ? producto.cod
              .toLowerCase()
              .includes(event.target.value.toLowerCase())
          : false
      );

      setFilteredData(filtered);
    };

    const handleImageClick = (ruta) => {
      setImagenSeleccionada(ruta); // Guarda la ruta de la imagen seleccionada
      setOpenModal(true)

    };

    const handleReprint = () => {
      getTicketRetallo(idRetallo)
    }

    const handleRowClick = (params) => {
      const selectedProducto = params.row; // Obtiene toda la fila
      onSelectProduct(selectedProducto); // Envía los datos del usuario seleccionado
      onClose(); // Cierra el modal
    };
   
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
          padding: "2vh",
          zIndex: 1500,
          maxHeight: "90vh", // Limitar el tamaño del modal
          width: "78vw", // Usar vw para ajustarse al ancho de la pantalla
          overflow: "hidden", // Asegurar que no se desborde
          borderRadius: "10px", // Bordes redondeados del modal
        }}
      >
        <Box m="0px">
          <Box display="flex" justifyContent="space-between" p={2}>
            <h1 id="owner-modal-title">Retallos de la Chapa</h1>
            
            <Button
                            type="submit"
                            color="secondary"
                            variant="contained"
                            onClick={handleReprint}
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
                            startIcon={<LocalPrintshopIcon />}
                          >
                            Imprimir Retallos
                          </Button>
          </Box>
          <Box
            m="1vh 0"
            height="30vh" // Altura del DataGrid en función de la pantalla
            width="70vw" // Ancho ajustado al contenedor
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
              rows={filteredData}
              columns={columns}
              onRowClick={handleRowClick}
            />
          </Box>
        </Box>
          {/* <Button onClick={handleRowDoubleClick} color="secondary" variant="contained" style={{ marginTop: "10px" }}>
            Seleccionar
          </Button> */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)", // Tres columnas
              gap: 1, // Espaciado entre las imágenes
              maxHeight: "40vh", // Altura máxima del contenedor
              width: "70vw", // Ancho del grid
              overflowY: "auto", // Activar scroll vertical
              backgroundColor: "#242b43", // Para identificar el área del grid
              padding: "0.5vh", // Espaciado interno para las imágenes
              borderRadius: "8px", // Bordes redondeados del contenedor
            }}
          >
            {imagen.map((ruta, index) => (
              <Box
                key={index}
                component="img"
                src={`http://192.168.88.69:5003${ruta}`} // Asegúrate de que esta URL coincida con la de tu servidor
                alt={`Imagen ${index + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // Asegura que la imagen mantenga proporción y cubra todo el espacio
                  borderRadius: "8px", // Bordes redondeados
                  cursor: "pointer", // Muestra que es interactivo
                  border: imagenSeleccionada === ruta ? "3px solid yellow" : "none", // Resalta si está seleccionada
                }}
                onClick={() => handleImageClick(ruta)} // Captura la ruta al hacer clic
              />
            ))}
          </Box>
          <ModalImage
                open={openModal}
                onClose={handleCloseModal}
                // onSelectClient={selectedRow} // Mostrar los datos recibidos
               imageSrc={`http://192.168.88.69:5003${imagenSeleccionada}`}
                
              />
        </Box>
             
      </Modal>
      
    );
  };

  export default ModalRetallo;

