import React, { useState, useEffect } from "react";
import { Box, Modal, InputBase, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
// import { getChapas } from "../../services/ordenProduccion.services";
import { getOne } from '../../services/stock.services';
import {getOneChapas} from "../../services/pedidoVenta.services"
import { getOneDatosInterfoliacion } from "../../services/interfoliacion.services";
import ModalChapasColar from "./modalChapasCargadasColar"


const ModalChapas = ({ open, onClose, registro }) => {
  const [productos, setProductos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [registroColarModal, setRegistroColarModal] = useState(null);
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

  useEffect(() => {
    if (onClose) {
      setFilteredData({});
      setOrdenProduccion({});
    }
  }, [onClose]);
  
  const fetchOrdenProduccion = async () => {
    try {
      const response = await getOneChapas(registro?.id);
  
      if (Array.isArray(response) && response.length > 0) {
        const dataConProducto = await Promise.all(
          response.map(async (orden) => {
            let productoResponse;
  
            try {
              productoResponse = await getOne(orden?.serie);
            } catch (error) {
              console.warn(`getOne failed for serie ${orden?.serie}, calling getOneDatosInterfoliacion.`);
              productoResponse = await getOneDatosInterfoliacion(orden?.serie);
            }
  
            return {
              ...orden,
              producto: productoResponse?.cod || "Desconocido",
              medidas: productoResponse?.medidas || "Desconocido",
            };
          })
        );
  
        setOrdenProduccion(dataConProducto);
        setFilteredData(dataConProducto);
      } else {
        console.warn("La respuesta de getOneChapas no es válida o está vacía.");
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
    { field: "id", headerName: "ID", flex: 0.1 },
    {
      field: "serie",
      headerName: "Serie",
      flex: 0.3,
      cellClassName: "name-column--cell",
    },
    {
      field: "producto" ,
      headerName: "Codigo",
      flex: 0.8,
      cellClassName: "name-column--cell",
    },
    {
      field: "cantidad" ,
      headerName: "Cantidad",
      flex: 0.3,
      cellClassName: "name-column--cell",
    },
    {
      field: "medidas" || "Pendiente",
      headerName: "Medidas",
      flex: 0.3,
      cellClassName: "name-column--cell",
    },
  ];

    const handleRowClick = (params) => {
    setRegistroColarModal(params.row); // Guarda el registro seleccionado
    setOpenModal(true); // Abre el modal
  };

    const handleCloseModal = () => {
    setOpenModal(false);
  };

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
            <h1 id="owner-modal-title">Productos Cargados </h1>
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
              // checkboxSelection
              rows={Array.isArray(filteredData) ? filteredData : []}
              columns={columns}
              onRowClick={handleRowClick} // Maneja el evento de clic en la fila
              getRowId={(row) => row.id}
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
        <ModalChapasColar
          open={openModal}
          onClose={handleCloseModal}
          registro={registroColarModal} // Mostrar los datos recibidos
        />
      </Box>
    </Modal>
  );
};

export default ModalChapas;
