import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
// import { getVistaDescarga } from "../../services/reporteDescarga.services";
import { getStockview} from "../../services/reporteStock.services";
import ModalProblema from "../../modal/problema/modalProblemaStock"; 

const Stock = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = useState(false);
  const [registro, setRegistro] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Obtener datos de la vista al cargar el componente
  const fetchPrueba = async () => {
    try {
      const response = await getStockview();
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
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "cod", headerName: "Codigo Paquete", flex: 2 },
    { field: "cantidad", headerName: "Cantidad", flex: 1 },
    { field: "cantidad_entrada", headerName: "Cant. disponible", flex: 1 },
    { field: "reservado", headerName: "Reservado", flex: 1 },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      valueGetter: (params) => formatDate(params.row.fecha),
    },
    // { field: "turno", headerName: "Turno", flex: 1 },
  ];
  
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header
          title="Stock"
          subtitle="Disponibilidad Stock"
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
        />
      </Box>
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

