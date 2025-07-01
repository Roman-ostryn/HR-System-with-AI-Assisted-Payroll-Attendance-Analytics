import React, { useState, useEffect } from "react";
import { Box, Modal, InputBase, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { getChapas } from "../../services/ordenProduccion.services";
// import { getOneDatos } from '../../services/productos.services';
import { getOneDatos } from "../../services/pvb.services";

const ModalChapas = ({ open, onClose, registro }) => {
  const [productos, setProductos] = useState([]);
  const [ordenProduccion, setOrdenProduccion] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (open) {
      fetchOrdenProduccion();
    }
    if (registro) {
      setProductos({
        ...registro,
        orden: registro.orden,
        id_producto: registro.cod,
      });
    }
  }, [open, registro]);

  const fetchOrdenProduccion = async () => {
    try {
      // Obtener la respuesta del servicio
      const response = await getChapas(registro.serie);
      // console.log("🚀 ~ fetchOrdenProduccion ~ response:", response)
  
  
      // Verificar que la respuesta sea un objeto válido
      if (typeof response === "object" && response.pvb !== null) {
        // Obtener el producto asociado al id_producto
        const productoResponse = await getOneDatos(response?.pvb);
        // console.log("🚀 ~ fetchOrdenProduccion ~ productoResponse:", productoResponse)
  
        // Añadir el código del producto (`cod`) a la respuesta de la orden
        const dataConProducto = {
          ...response,
          producto: productoResponse.cod_interno || "Desconocido", // Manejo seguro de `cod`
        };
  
        // Actualizar el estado con los datos procesados
        setOrdenProduccion([dataConProducto]); // Envolver en un array para el DataGrid
        setFilteredData([dataConProducto]);
      } else {
        setOrdenProduccion([response]);
        setFilteredData([response]);
        throw new Error("La respuesta no es un objeto válido.");
      }
    } catch (error) {
      console.error("Error al obtener datos del backend:", error);
    }
  };
  
  const handleSearchChange = (event) => {
    const search = event.target.value.toLowerCase();
    setSearchValue(search);

    const filtered = ordenProduccion.filter((orden) =>
      orden.descripcion?.toLowerCase().includes(search)
    );
    setFilteredData(filtered);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "serie", headerName: "Serie", flex: 0.5, cellClassName: "name-column--cell" },
    { field: "chapa1", headerName: "Chapa1", flex: 0.5, cellClassName: "name-column--cell" },
    { field: "chapa2", headerName: "Chapa2", flex: 0.5, cellClassName: "name-column--cell" },
    { field: "producto", headerName: "PVB", flex: 0.5, cellClassName: "name-column--cell" },
    {
      field: "estado",
      headerName: "Estado",
      flex: 0.5,
      cellClassName: (params) => {
        switch (params.value) {
          case 1:
            return "estado-pendiente";
          case 2:
            return "estado-en-proceso";
          case 3:
            return "estado-completo";
          default:
            return "estado-default";
        }
      },
      renderCell: (params) => {
        const estadoMap = { 1: "Programado", 2: "En Proceso", 3: "Concluido" };
        return estadoMap[params.value] || "Desconocido";
      },
    },
  ];
  
  const handleClose = () => {
    onClose();
    setProductos([]);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-OrdenProduccion-title"
      aria-describedby="modal-OrdenProduccion-description"
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary[600],
          padding: "10px",
          zIndex: 1500,
          "& .estado-pendiente": {
            backgroundColor: "#740017",
            color: "white",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important",
            },
          },
          "& .estado-en-proceso": {
            backgroundColor: "#ff6105",
            color: "white !important",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important",
            },
          },
          "& .estado-completo": {
            backgroundColor: "green",
            color: "white",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important",
            },
          },
          "& .estado-default": {
            color: "gray",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important",
            },
          },
        }}
      >
        <Box m="0px">
          <Box display="flex" justifyContent="space-between" p={2}>
            <h1 id="owner-modal-title">Chapa Producido</h1>
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
              checkboxSelection
              rows={filteredData}
              columns={columns}
              getRowClassName={(params) => {
                switch (params.row.estado) {
                  case 1:
                    return "estado-pendiente";
                  case 2:
                    return "estado-en-proceso";
                  case 3:
                    return "estado-completo";
                  default:
                    return "estado-default";
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalChapas;
