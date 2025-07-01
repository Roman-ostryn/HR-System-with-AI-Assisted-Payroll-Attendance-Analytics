import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getPlusView } from "../../services/marcaciones.services";

const PlusView = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [userLevel, setUserLevel] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Columnas de la tabla
  const columns = [
    { field: "Id_empleado", headerName: "Id Empleado", flex: 1 },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "apellido",
      headerName: "Apellido",
      flex: 1,
      type: "string",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "grupo",
      headerName: "Grupo",
      flex: 1,
      type: "string",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "monto_plus",
      headerName: "Monto Plus",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "monto_descuento",
      headerName: "Descuento",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "descripcion_descuento",
      headerName: "Motivo Descuento",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "total",
      headerName: "Total a Pagar",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
  ];

  // Agrupar los datos por Id_empleado
  const groupByEmpleado = (data) => {
    const groupedData = data.reduce((acc, curr) => {
      const {
        Id_empleado,
        nombre,
        apellido,
        grupo,
        monto_plus,
        monto_descuento,
        descripcion_descuento,
        id_descuento, // Añadimos el id_descuento para la verificación
      } = curr;
  
      // Asegúrate de que Id_empleado esté definido
      if (!Id_empleado) {
        console.error("Fila sin Id_empleado:", curr);
        return acc; // O puedes omitir la fila en vez de retornarla
      }
  
      // Corrige el formato de los montos si es necesario
      const montoParsed = parseFloat(monto_plus) || 0;
      const montoDescuentoParsed = parseFloat(monto_descuento) || 0;
  
      if (!acc[Id_empleado]) {
        acc[Id_empleado] = {
          Id_empleado,
          nombre,
          apellido,
          grupo,
          monto_plus: montoParsed,
          monto_descuento: 0,
          total: 0,
          descripcion_descuento: "", // Iniciar campo de motivo descuento
        };
      }
  
      acc[Id_empleado].monto_descuento += montoDescuentoParsed;
      acc[Id_empleado].total = acc[Id_empleado].monto_plus - acc[Id_empleado].monto_descuento;
  
      // Verificar si id_descuento es igual a 6 para mostrar motivo descuento
      if (id_descuento === 6) {
        acc[Id_empleado].descripcion_descuento = descripcion_descuento || "Motivo no disponible";
      }
  
      return acc;
    }, {});
  
    return Object.values(groupedData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPlusView();
        // Filtrar los datos para excluir los elementos con id_descuento 1 y null
        const filteredResponseData = response.filter(item => item.id_descuento !== 1 && item.id_descuento !== null);
      

        // Filtrar las filas sin Id_empleado
        const validData = filteredResponseData.filter(item => item.Id_empleado);
 
        // Agrupar los datos
        const groupedData = groupByEmpleado(validData);

        setData(groupedData);
        setFilteredData(groupedData);
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
      }
    };

    const level = localStorage.getItem("userLevel");
    if (level) {
      setUserLevel(parseInt(level));
    }

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    // Filtrar por el campo "Nombre"
    const filtered = data.filter((item) =>
      item.nombre.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="Resumen de Plus" subtitle="Resumen de Plus por Grupos" />
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
          getRowId={(row) => row.Id_empleado}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          disableMultipleSelection={true}
        />
      </Box>
    </Box>
  );
};

export default PlusView;