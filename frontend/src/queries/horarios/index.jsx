import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getDatosHorarios } from "../../services/horarios.services";
import { da } from "date-fns/locale";

const HorariosView = () => {
  const [data, setData] = useState([]); // Cambiado a array vacío
  const [searchValue, setSearchValue] = useState(""); 
  const [filteredData, setFilteredData] = useState([]); // Cambiado a array vacío

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 2,
      cellClassName: "name-column--cell",
    },

    {
      field: "hora_entrada",
      headerName: "Entrada",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
        field: "hora_salida",
        headerName: "Salida",
        flex: 1,
        type: "number",
        headerAlign: "left",
        align: "left",
      },

  ];

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await getDatosHorarios();
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.error("Error al obtener los grupos del backend:", error);
      }
    };

    fetchHorarios(); // Llamar a la función que obtiene los grupos
  }, []);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    // Aquí puedes aplicar la lógica de filtrado cuando sea necesario
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="Horarios" subtitle="Lista de Horarios Disponibles" />
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
          rows={filteredData} // Siempre será un array
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          disableMultipleSelection={true}
          getRowId={(row) => row.id} 
        />
      </Box>
    </Box>
  );
};

export default HorariosView;