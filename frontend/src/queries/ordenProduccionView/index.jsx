
import React, { useState, useEffect } from "react";
import { Box, useTheme, InputBase, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import { getDatosOrdenView } from "../../services/ordenProduccion.services";
import ModalOrdenProduccion from "../../modal/ordenProduccion/modalOrdenProduccion";

const OrdenProduccionView = () => {
  const [data, setData] = useState([]); // Datos de OrdenProduccion
  const [searchValue, setSearchValue] = useState(""); // Valor del campo de búsqueda
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados para la tabla
  const [open, setOpen] = useState(false);
  const [registro, setRegistro] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const fetchPrueba = async () => {
    try {
      const response = await getDatosOrdenView();
      // console.log("🚀 ~ fetchPrueba ~ response:", response)

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

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpen(false);
    fetchPrueba();
  };


  // Definir columnas de la tabla
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "orden",
      headerName: "Orden Produccion",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "cod",
      headerName: "Producto",
      flex: 1.5,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "cantidad_total",
      headerName: "Cantidad",
      flex: 0.5,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "producidos",
      headerName: "Producidos",
      flex: 0.5,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Estado",
      headerName: "Estado",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
  ];

  useEffect(() => {
    const fetchOrdenProduccion = async () => {
      try {
        const response = await getDatosOrdenView();
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchOrdenProduccion();
  }, []);

  // Manejar la búsqueda en la tabla
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    // Filtrar los datos en base al valor de búsqueda
    const filtered = data.filter((item) =>
      String(item.orden).toLowerCase().includes(value.toLowerCase())||
      item.cod.toLowerCase().includes(value.toLowerCase())||
      item.Estado.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Función para asignar una clase a cada fila dependiendo del Estado
  const getRowClassName = (params) => {
    const estado = params.row.Estado;
    switch (estado) {
      case "programado":
        return "estado-pendiente";
      case "concluido":
        return "estado-completo";
      case "en proceso":
        return "estado-en-proceso";
      default:
        return "estado-default";
    }
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="OrdenProduccion" subtitle="Lista de OrdenProduccion Disponibles" />
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

          // Estilos para las filas con hover
          "& .estado-pendiente": {
            backgroundColor: "#740017", // Color de texto
            textShadow: "2px 2px 2px 2px #ffffff",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important", // Fondo al pasar el ratón
            },
          },
          "& .estado-completo": {
            backgroundColor: "green",
            textShadow: "2px 2px 2px 2px #ffffff",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important", // Fondo al pasar el ratón
            },
          },
          "& .estado-en-proceso": {
            backgroundColor: "#ff6105",
            textShadow: "2px 2px 2px 2px #ffffff",
            color: "white !important",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important", // Fondo al pasar el ratón
            },
          },
          "& .estado-default": {
            color: "gray",
            textShadow: "2px 2px 2px 2px #ffffff",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important", // Fondo al pasar el ratón
            },
          },
        }}
      >
        <DataGrid
          rows={Object.values(filteredData).flat()} // Aplanar los grupos para que se muestren correctamente en la tabla
          getRowId={(row) => row.id} // Acceder correctamente al campo `Id`
          columns={columns}
          onRowClick={handleRowClick} 
          getRowClassName={getRowClassName} // Aplicar la clase condicional
          components={{ Toolbar: GridToolbar }}
          disableMultipleSelection={true}
        />
      </Box>
      <ModalOrdenProduccion
        open={open}
        onClose={handleCloseModal}
        registro={registro} // Mostrar los datos recibidos
      />
    </Box>
  );
};

export default OrdenProduccionView;