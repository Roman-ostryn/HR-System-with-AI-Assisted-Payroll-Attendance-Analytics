import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getTranslado } from "../../services/stock.services";

const Translados = () => {
  const [data, setData] = useState([]); // Datos de grupos
  const [searchValue, setSearchValue] = useState(""); // Valor del campo de búsqueda
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados para la tabla

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


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

  // Definir columnas de la tabla
  const columns = [
    { field: "id", headerName: "ID", flex: 0.4 },
    {
      field: "cod_interno",
      headerName: "Serie",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "cod",
      headerName: "Producto",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "origen",
      headerName: "Origen",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    
    {
      field: "destino",
      headerName: "Destino",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "username",
      headerName: "Responsable",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      valueGetter: (params) => formatDate(params.row.fecha),
    },
  ];

  // Obtener datos de los grupos al cargar el componente
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await getTranslado();
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.error("Error al obtener los grupos del backend:", error);
      }
    };

    fetchGrupos(); // Llamar a la función que obtiene los grupos
  }, []);

  // Manejar la búsqueda en la tabla
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    // Filtrar los datos en base al valor de búsqueda
    const filtered = data.filter((item) =>
      String(item.cod_interno).toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredData(filtered);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="Translados" subtitle="Movimientos realizados" />
        <Box display="flex" alignItems="center">
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
          getRowId={(row) => row.id} // Acceder correctamente al campo `Id`
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          disableMultipleSelection={true}
        />
      </Box>
    </Box>
  );
};

export default Translados;