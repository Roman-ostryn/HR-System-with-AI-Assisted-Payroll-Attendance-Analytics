import React, { useState, useEffect } from "react";
import { Box, Modal, InputBase, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { getOrdenOrden } from "../../services/ordenProduccion.services";
import { getOneDatos } from '../../services/productos.services';
import {getOneDatosCaballete} from "../../services/caballete.services"; 
import  ModalChapas  from '../ordenProduccion/modalChapas'


const ModalOrdenProduccion = ({ open, onClose, registro }) => {
  const [openModal, setOpenModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [ordenProduccion, setOrdenProduccion] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [registroModal, setRegistroModal] = useState(null);


  useEffect(() => {
    if (open) {
      fetchOrdenProduccion();
    }

    if (registro) {
      setProductos({
        ...registro,
        orden: registro.orden,
      });
    }
  }, [open, registro]);

  const fetchOrdenProduccion = async () => {
    try {
      // Obtener las ordenes de producción
      const response = await getOrdenOrden(registro.orden);
  
      // Obtener el producto asociado con cada orden
      const ordenConProducto = await Promise.all(response.map(async (orden) => {
        const productoResponse = await getOneDatos(orden.id_producto); // Asumiendo que "id_producto" existe en "orden"
        
        let Caballete = null; // Inicialización de la variable Caballete
  
        if (orden.id_caballete !== null) {
          Caballete = await getOneDatosCaballete(orden.id_caballete); // Asumiendo que "id_caballete" existe en "orden"
        }
  
        return {
          ...orden,
          producto: productoResponse.cod, // O el campo que necesites del producto
          caballete: Caballete ? Caballete.codigo : "Sin Caballete", // Usamos un valor por defecto si Caballete es null
        };
      }));
  
      setOrdenProduccion(ordenConProducto);
      setFilteredData(ordenConProducto);
    } catch (error) {
      console.error("Error al obtener datos del backend:", error);
    }
  };
  
  

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    const filtered = ordenProduccion.filter((orden) =>
      orden.serie
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // const handleRowDoubleClick = (params) => {
  //   const { id, descripcion, monto } = params.row;
  //   onClose();
  // };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    {
      field: "serie",
      headerName: "Serie",
      flex: 0.8,
      cellClassName: "name-column--cell",
    },
    {
      field: "producto",
      headerName: "Producto",
      flex: 1.5,
    },
    {
      field: "caballete",
      headerName: "Caballete",
      flex: 0.6,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 0.6,
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
        const estadoMap = {
          1: "Programado",
          2: "En Proceso",
          3: "Concluido",
        };
        return estadoMap[params.value] || "Desconocido";
      },
    },
  ];

  const handleRowClick = (params) => {
    setRegistroModal(params.row); // Guarda el registro seleccionado
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
            <h1 id="owner-modal-title">Buscar Orden Producción</h1>
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
              // onRowDoubleClick={handleRowDoubleClick}
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
                }}}
                onRowClick={handleRowClick} 
            />
          </Box>
        </Box>
        <ModalChapas
          open={openModal}
          onClose={handleCloseModal}
          registro={registroModal} // Mostrar los datos recibidos
        />
      </Box>
    </Modal>
  );
};

export default ModalOrdenProduccion;
