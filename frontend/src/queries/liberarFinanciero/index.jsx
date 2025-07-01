import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
// import { getVistaDescarga } from "../../services/reporteDescarga.services";
import { updateRegistro, } from "../../services/reporteStock.services";
// import { getLiberarStock, getVerifyStock, getVerifyStockPVB} from "../../services/stock.services";
import {getLiberarFinanciero, putDatos} from "../../services/pedidoVenta.services"
import SendIcon from '@mui/icons-material/Send';
import ModalCharge from "../../modal/modalCharge";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ModalPreview from "../../modal/modalPreview"; // Importar el modal de vista previa
// import QRCode from 'qrcode'

const Stock = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = useState(false);
  const [registro, setRegistro] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [previewData, setPreviewData] = useState(""); // Estado para guardar los datos de vista previa
  // const [printerInfo, setPrinterInfo] = useState(''); // Estado para guardar la información de la impresora
  // const [errorMessage, setErrorMessage] = useState(''); // Estado para guardar posibles errores

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Obtener datos de la vista al cargar el componente
  const fetchPrueba = async () => {
    try {
      const response = await getLiberarFinanciero();
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
    setRegistro(params.row); // Guarda el registro seleccionado
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

  const formatDate = (date) => {
    if (!date) return '';

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return '';

    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = String(parsedDate.getFullYear()).slice(-2);
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getRowClassName = (params) => {
    return params.row.status_active === 3 ? "row-disabled" : "";
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
    { field: "cliente", headerName: "Cliente", flex: 1 },
    { field: "n_pedido", headerName: "Nota Pedido", flex: 1 },
    { field: "producto", headerName: "Producto", flex: 2 },
    { field: "cantidad", headerName: "Cantidad", flex: 1 },
    { field: "precio", headerName: "Precio", flex: 1 },
    { field: "chapa", headerName: "Vehiculo", flex: 1 },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      valueGetter: (params) => formatDate(params.row.fecha),
    },
    {
      field: "acciones",
      headerName: "Liberar",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleButtonClick(params.row)}
        disabled={params.row.status_active === 3}
        >
          <SendIcon />
        </IconButton>
      ),
    },
  ];

const handleButtonClick = async (id) => {
  setIsLoading(true);
  const datos = {
    status_active:1
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await putDatos(id.id, datos);
    toast.success(`Nota: ${id.n_pedido} liberado para Cargamento`, {
      position: "top-center",
      autoClose: 5000, // Tiempo de cierre automático
      hideProgressBar: true, // Oculta la barra de progreso
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    fetchPrueba();
  } catch (error) {
    console.error("Error al enviar los datos", error);
    setIsLoading(false);
    setRegistrationError(true);
    setError(error.message);
  } finally {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }
}

const handleMenuClick = (event, row) => {

  setAnchorEl(event.currentTarget);
  setSelectedRow(row);
};

const handleMenuClose = () => {
  setAnchorEl(null);
  setSelectedRow(null);
};

const handleEspera = async () => {
  setIsLoading(true);
  const datos = {
    status_active:3
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await putDatos(selectedRow.id, datos);
    toast.success(`Nota: ${selectedRow.n_pedido} Bloqueado en Espera`, {
      position: "top-center",
      autoClose: 5000, // Tiempo de cierre automático
      hideProgressBar: true, // Oculta la barra de progreso
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    fetchPrueba();
  } catch (error) {
    console.error("Error al enviar los datos", error);
    setIsLoading(false);
    setRegistrationError(true);
    setError(error.message);
  } finally {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }

  handleMenuClose();
};

const handleActivar = async () => {

  setIsLoading(true);
  const datos = {
    status_active:2
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await putDatos(selectedRow.id, datos);
    toast.success(`Nota: ${selectedRow.n_pedido} Activado`, {
      position: "top-center",
      autoClose: 5000, // Tiempo de cierre automático
      hideProgressBar: true, // Oculta la barra de progreso
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    fetchPrueba();
  } catch (error) {
    console.error("Error al enviar los datos", error);
    setIsLoading(false);
    setRegistrationError(true);
    setError(error.message);
  } finally {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }

  handleMenuClose();
};

const handleCancelar = async () => {

  setIsLoading(true);
  const datos = {
    delete_at:1,
    status_active:0
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await putDatos(selectedRow.id, datos);
    toast.success(`Nota: ${selectedRow.n_pedido} Cancelado`, {
      position: "top-center",
      autoClose: 5000, // Tiempo de cierre automático
      hideProgressBar: true, // Oculta la barra de progreso
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    fetchPrueba();
  } catch (error) {
    console.error("Error al enviar los datos", error);
    setIsLoading(false);
    setRegistrationError(true);
    setError(error.message);
  } finally {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }

  handleMenuClose();
};


const handleClosePreview = () => {
  setPreviewData(""); // Limpiar los datos de vista previa al cerrar el modal
};

const handleCloseModal = () => {
  setRegistrationSuccess(false);
};

const handleCloseModalError = () => {
  setRegistrationError(false);
};

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header
          title="Liberar"
          subtitle="Liberar para Cargamento"
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
        height="75vh"
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
          getRowClassName={getRowClassName}
        />
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEspera}>En Espera</MenuItem>
        <MenuItem onClick={handleActivar}>Activar</MenuItem>
        <MenuItem onClick={handleCancelar}>Cancelar</MenuItem>
      </Menu>
      <ModalCharge isLoading={isLoading} />

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
      {previewData && (
        <ModalPreview
          open={Boolean(previewData)}
          onClose={handleClosePreview}
          data={previewData}
        />
      )}
      {/* <ModalProblema
        open={open}
        onClose={() => setOpen(false)}
        registro={registro} // Mostrar los datos recibidos
        //  sector="lavadora"
      /> */}
    </Box>
  );
};

export default Stock;
