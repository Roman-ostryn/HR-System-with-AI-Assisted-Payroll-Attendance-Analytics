import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getListaPrecio } from "../../services/precio.services";

const ListaPrecios = () => {
  const [data, setData] = useState([]); // Datos de grupos
  const [searchValue, setSearchValue] = useState(""); // Valor del campo de búsqueda
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados para la tabla

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  // Definir columnas de la tabla
  const columns = [
    { field: "id", headerName: "ID", flex: 0.4 },
    {
      field: "descripcion",
      headerName: "Descripcion",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "precio",
      headerName: "Precio",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
  ];

  // Obtener datos de los grupos al cargar el componente
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await getListaPrecio();
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
      item.cod_interno.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredData(filtered);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="Lista de Precios" subtitle="Precios Referenciales" />
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

export default ListaPrecios;