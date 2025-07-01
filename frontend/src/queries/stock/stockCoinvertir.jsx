import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton, Button} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getOne, getOneDatos, getCoinvertir} from "../../services/stock.services";
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ModalEditInventario from "../../modal/stock/modalEntrada-Salida"; // Importar el modal de vista previa
import QRCode from 'qrcode';
import ModalPreview from "../../modal/modalPreview"; // Importar el modal de vista previa
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Stock = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [registro, setRegistro] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [previewData, setPreviewData] = useState(""); // Estado para guardar los datos de vista previa
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  const [errorMessage, setErrorMessage] = useState(''); 

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Obtener datos de la vista al cargar el componente
  const fetchPrueba = async () => {
    try {
      const response = await getCoinvertir();
      setData(response);
      setFilteredData(response);
    } catch (error) {
      console.error("Error al obtener los datos del backend:", error);
    }
  };

  useEffect(() => {
    fetchPrueba();
  }, []);

  const handleRowClick = (params) => {
    // setRegistro(params.row); // Guarda el registro seleccionado
    setOpen(true); // Abre el modal
  };

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


  // const handleMenuClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleSubMenuClick = (event) => {
    setSubMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };


  const handleEtiqueta = async () => {
    const { serie } = selectedRow;
  
    try {
      const response = await getOneDatos(serie);
  
      if (!response || typeof response !== "object") {
        // console.error("Respuesta inesperada de getOneDatos:", response);
        return;
      }
  
      // Generar la etiqueta para el objeto response
      const fecha = new Date(response.create_at).toLocaleDateString("es-ES");
      const qrImageUrl = await QRCode.toDataURL(response.cod_interno, { errorCorrectionLevel: 'H' }).catch(error => {
        console.error('Error generando el QR:', error);
        return null; // Retorna null en caso de error
      });
  
      const etiqueta = `
        ^XA
        ^PW800
        ^LL1600
  
        ^FO350,40^A0N,50,50^FD${response.cod} ^FS
        ^FO350,250^A0N,50,50^FD${response.descripcion} ^FS
  
        ^FO350,750^A0N,50,50^FDCantidad:${response.cantidad_entrada} ^FS
  
        ^FO1650,400^BQN,2,8^FDQA,${qrImageUrl}^FS
  
        ^FO550,950^A0N,50,50^FD${response.serie} ^FS
  
        ^FO350,1150^A0N,500,500^FD${fecha}^FS
        ^FO1800,1150^A0N,500,500^FD${response.cod_interno}^FS
  
        ^XZ
      `;
      setPreviewData(etiqueta); // Guardar los datos en el estado de vista previa
      handleMenuClose();
    } catch (error) {
      console.error("Error en handleEtiqueta:", error);
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
    { field: "id", headerName: "ID", flex: 0.4 },
    { field: "nombre", headerName: "Empresa", flex: 0.8 },
    { field: "serie", headerName: "Serie Fabrica", flex: 0.8 },
    { field: "cod", headerName: "Producto", flex: 1.5 ,cellClassName: "name-column--cell"},
    { field: "cod_interno", headerName: "Codigo Interno", flex: 1 },
    { type: "number", field: "cantidad", headerName: "Cantidad Entrante", flex: 1 },
    { type: "number", field: "cantidad_entrada", headerName: "Cant. disponible", flex: 1 },
    { 
      field: "m2", 
      headerName: "m²", 
      flex: 1,
      valueFormatter: (params) => `${params.value} m²`
    },
    { field: "caballete", headerName: "Almacenamiento", flex: 1 },
    {
      field: "create_at",
      headerName: "Fecha",
      flex: 1,
      valueGetter: (params) => formatDate(params.row.create_at),
    },
    { field: "obs", headerName: "Observacion", flex: 1.5 },
  ];

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchPrueba();
    handleMenuClose();
  }

  const handleClosePreview = () => {
    setPreviewData(""); // Limpiar los datos de vista previa al cerrar el modal
  };

  
  const handleEntrada = async () => {
    setOpenModal(true);
    setRegistro("entrada");
  };

  const handleSalida = async () => {
    setOpenModal(true);
    setRegistro("salida");
  };

  
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


  const handlePrint = async () => {
    if (!selectedRow || !selectedRow.id) {
      setErrorMessage('No se ha seleccionado ninguna fila.');
      return;
    }
    const { cod_interno } = selectedRow;
    // console.log("🚀 ~ handlePrint ~ selectedRow:", selectedRow)
  
    try {
      const response = await getOne(cod_interno);
      
      // Si response no es un array, conviértelo en uno
      const items = Array.isArray(response) ? response : [response];
      
      const etiquetas = await Promise.all(items.map(async (item) => {
      const descripcionLines = formatText(item.descripcion, 55);

        const fecha = new Date(item.create_at).toLocaleDateString("es-ES");
        let zpl = `
        ^XA
        ^PW800
        ^LL400

        // Código en la parte superior, más grande
        ^FO85,40^A0N,30,30^FDNumero de Serie:${item.cod_interno} ^FS

        ^FO140,80^A0N,25,30^FD${fecha}^FS

        ^FO85,120^A0N,30,30^FDCant. Chapa:^FS
        ^FO140,160^A0N,30,30^FD${item.cantidad}^FS

        ^FO330,120^A0N,30,30^FDUtilizable:^FS
        ^FO380,160^A0N,30,30^FD${item.cantidad_entrada}^FS

        // ID Producción, fecha y serie
        ^FO85,220^A0N,25,30^FDFABRICA: ${item.serie}^FS
        ^FO85,260^A0N,30,30^FD${item.cod}^FS


        // Código QR, más grande
        //^FO500,40^BQN,2,8^FDQA,${item.cod_interno}^FS

        `;
        descripcionLines.forEach((line, index) => {
          zpl += `^FO85,${300 + index * 30}^A0N,28,26^FD${line}^FS\n`;
        });

        zpl += `
          ^FO85,${300 + descripcionLines.length * 30 + 30}^A0N,28,26^FD^FS
        ^XZ
      `;
        return zpl;
      }));
      

      if (window.BrowserPrint) { // Asegúrate de que BrowserPrint está disponible
        window.BrowserPrint.getDefaultDevice("printer", 
          (device) => {
            if (device) {
              setPrinterInfo(`Dispositivo predeterminado encontrado: ${device.name}`);
              let zplCommand = etiquetas.join("\n");
  
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
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setErrorMessage('Error al obtener los datos.');
    }
  
    handleMenuClose();
  };

  const calcularCantidad = () => {
    return filteredData.reduce((acc, curr) => acc + curr.cantidad_entrada, 0);
  };
  
  const calcularCantidadm = () => {
    const total = filteredData.reduce((acc, curr) => acc + parseFloat(curr.m2 || 0), 0);
    return total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' m²';
  };

  useEffect(() => {
    calcularCantidadm();
    calcularCantidad();
  
  }, [filteredData]);
  


// const handleExportExcel = () => {
//   if (!filteredData || filteredData.length === 0) {
//     alert("No hay datos para exportar.");
//     return;
//   }

//   // Obtener lista única de productos
//   const productosUnicos = [...new Set(filteredData.map(item => item.cod))];

//   // Si hay un solo producto, usarlo. Si hay varios, poner 'varios'
//   const nombreProducto =
//     productosUnicos.length === 1 ? productosUnicos[0] : "varios_productos";

//   const fecha = new Date().toLocaleDateString("es-AR").replaceAll("/", "-");
//   const nombreArchivo = `stock_${nombreProducto}_${fecha}.xlsx`;

//   // Formatear datos con encabezados personalizados
//   const exportData = filteredData.map((item) => ({
//     ID: item.id,
//     Empresa: item.nombre,
//     "Serie Fabrica": item.serie,
//     Producto: item.cod,
//     "Codigo Interno": item.cod_interno,
//     "Cantidad Entrante": item.cantidad,
//     "Cant. disponible": item.cantidad_entrada,
//     "m²": `${item.m2} m²`,
//     Almacenamiento: item.caballete,
//     Fecha: formatDate(item.create_at),
//     Observacion: item.obs,
//   }));

//   const ws = XLSX.utils.json_to_sheet(exportData);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Stock");

//   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//   const dataBlob = new Blob([excelBuffer], {
//     type: "application/octet-stream",
//   });
//   saveAs(dataBlob, nombreArchivo);
// };


// const handleExportExcel = () => {
//   if (!filteredData || filteredData.length === 0) {
//     alert("No hay datos para exportar.");
//     return;
//   }

//   // Definimos las columnas a exportar y cómo extraer cada valor
//   const exportData = filteredData.map((item) => ({
//     id: item.id,
//     nombre: item.nombre,
//     serie: item.serie,
//     cod: item.cod,
//     cod_interno: item.cod_interno,
//     cantidad: item.cantidad,
//     cantidad_entrada: item.cantidad_entrada,
//     m2: item.m2 ? `${item.m2} m²` : "",
//     caballete: item.caballete,
//     create_at: item.create_at ? formatDate(item.create_at) : "",
//     obs: item.obs,
//   }));

//   // Crear la hoja de Excel
//   const ws = XLSX.utils.json_to_sheet(exportData);

//   // Ajustar el ancho de las columnas (wch = width characters)
//   ws["!cols"] = [
//     { wch: 6 },   // ID
//     { wch: 20 },  // Empresa
//     { wch: 20 },  // Serie Fabrica
//     { wch: 25 },  // Producto
//     { wch: 20 },  // Codigo Interno
//     { wch: 18 },  // Cantidad Entrante
//     { wch: 18 },  // Cant. disponible
//     { wch: 10 },  // m²
//     { wch: 20 },  // Almacenamiento
//     { wch: 18 },  // Fecha
//     { wch: 30 },  // Observacion
//   ];

//   // Limitar a 3 productos en el nombre para no hacer el archivo muy largo
// const productosUnicos = [...new Set(filteredData.map((item) => item.cod))];

// let nombreArchivo = "reporte_stock.xlsx";

// if (productosUnicos.length === 1) {
//   nombreArchivo = `stock_${productosUnicos[0]}.xlsx`;
// } else if (productosUnicos.length === 2) {
//   nombreArchivo = `stock_de_${productosUnicos[0]} y ${productosUnicos[1]}.xlsx`;
// } else if (productosUnicos.length > 2) {
//   nombreArchivo = `stock_varios_productos.xlsx`;
// }

//   // Crear libro y añadir hoja
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Stock");

//   // Generar archivo y descargar
//   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//   const dataBlob = new Blob([excelBuffer], {
//     type: "application/octet-stream",
//   });
//   saveAs(dataBlob, nombreArchivo);
// };




const handleExportExcel = () => {
  if (!filteredData || filteredData.length === 0) {
    toast.error(
      `No hay datos para exportar`,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
    return;
  }

  // Aplicar el filtro manualmente aquí:
  const datosFiltradosParaExportar = filteredData.filter(item => item.cantidad_entrada > 0);

  if (datosFiltradosParaExportar.length === 0) {
    toast.error(
      `El producto no tiene cantidad disponible para exportar`,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
    return;
  }

  const exportData = datosFiltradosParaExportar.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    serie: item.serie,
    cod: item.cod,
    cod_interno: item.cod_interno,
    cantidad: item.cantidad,
    cantidad_entrada: item.cantidad_entrada,
    m2: item.m2 ? `${item.m2} m²` : "",
    caballete: item.caballete,
    create_at: item.create_at ? formatDate(item.create_at) : "",
    obs: item.obs,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);

  ws["!cols"] = [
    { wch: 6 },
    { wch: 20 },
    { wch: 20 },
    { wch: 25 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 },
    { wch: 10 },
    { wch: 20 },
    { wch: 18 },
    { wch: 30 },
  ];

  // Nombre archivo (puedes ajustarlo según tu lógica)
  const productosUnicos = [...new Set(datosFiltradosParaExportar.map((item) => item.cod))];
  let nombreArchivo = "reporte_stock.xlsx";
  if (productosUnicos.length === 1) {
    nombreArchivo = `stock_${productosUnicos[0]}.xlsx`;
  } else if (productosUnicos.length === 2) {
    nombreArchivo = `stock_de_${productosUnicos[0]} y ${productosUnicos[1]}.xlsx`;
  } else if (productosUnicos.length > 2) {
    nombreArchivo = `stock_varios_productos.xlsx`;
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Stock");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(dataBlob, nombreArchivo);
};



  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="Stock Monolitico" subtitle="Disponibilidad Stock" />
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              marginRight: "2%",
              marginLeft: "2%",
            }}
          >
            <Button
              sx={{
                background: "#143f04",
                width: "100%",
                height: "3rem!important",
                color: "white",
                borderRadius: "8px",
                "&:hover": {
                  background: "#36a60f", // Color de fondo cuando el botón está en hover
                },
              }}
              onClick={handleExportExcel}
              variant="contained"
              color="primary"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                alt="Excel Icon"
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              Exportar
            </Button>
          </Box>
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            height={"40%"}
            width={"90%"}
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
        display="flex"
        justifyContent="end"
        p={0}
        sx={{ ml: 2, marginBottom: "-3vh" }}
      >
        <Box
          sx={{
            marginRight: "1vh",
            fontSize: "20px",
            color: "rgb(206, 220, 0)",
          }}
        >
          Cantidad Chapas:
        </Box>
        <Box
          sx={{
            color: "rgb(255, 255, 255)",
            fontSize: "20px",
          }}
        >
          {calcularCantidad()}
        </Box>

        <Box
          sx={{
            marginLeft: "3vh",
            marginRight: "1vh",
            fontSize: "20px",
            color: "rgb(206, 220, 0)",
          }}
        >
          Cantidad m²:
        </Box>
        <Box
          sx={{
            color: "rgb(255, 255, 255)",
            fontSize: "20px",
            marginRight: "1.8vh",
          }}
        >
          {calcularCantidadm()}
        </Box>
      </Box>
      <Box
        m="40px 0 0 0"
        height="80vh"
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
          onRowClick={handleRowClick} // Abrir modal al hacer doble clic
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
          <MenuItem onClick={handleEntrada}>Entrada Inventario</MenuItem>
          <MenuItem onClick={handleSalida}>Salida Inventario</MenuItem>
          <MenuItem onClick={handlePrint}>Imprimir</MenuItem>
          <MenuItem onClick={handleEtiqueta}>Visualizar</MenuItem>
        </Menu>
      </Box>

      <ModalEditInventario
        open={openModal}
        onClose={handleCloseModal}
        onSelectClient={selectedRow} // Mostrar los datos recibidos
        registro={registro}
      />

      {previewData && (
        <ModalPreview
          open={Boolean(previewData)}
          onClose={handleClosePreview}
          data={previewData}
        />
      )}
    </Box>
  );
};

export default Stock;

