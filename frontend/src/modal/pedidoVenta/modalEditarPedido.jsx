import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import ModalCharge from "../../modal/modalCharge";
// import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalProducto from "../../modal/producto/modalProducto";
import {putDatosLiberacion } from "../../services/pedidoVenta.services.js"
import ModalCliente from "../../modal/cliente/modalCliente";
import ModalCamion from "../../modal/camiones/modalCamion";


const ModalEditarPedido = ({ open, onClose, dataNota }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [notaEditada, setNotaEditada] = useState({});
  const [productos, setProductos] = useState([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [productoIndexSeleccionado, setProductoIndexSeleccionado] = useState(null);
  const [modalClienteOpen, setModalClienteOpen] = useState(false);
  const [modalCamionOpen, setModalCamionOpen] = useState(false);
  const [pais, setPais] = useState(null);
  
  const User = parseInt(localStorage.getItem("id"));
  

  useEffect(() => {
    if (dataNota) {
      // console.log("🚀 ~ useEffect ~ dataNota:", dataNota)
      setProductos([...dataNota]);
      setNotaEditada({ ...dataNota[0] });
    }
  }, [dataNota]);

  
const handleProductoChange = (index, field, value) => {
  const nuevosProductos = [...productos];
  nuevosProductos[index][field] =
    field === "cantidad" ? parseInt(value, 10) || 0 : value;

  setProductos(nuevosProductos);

  if (field === "cantidad") {
    const total = nuevosProductos.reduce((acc, prod) => {
      const cantidad = parseInt(prod.cantidad);
      return acc + (isNaN(cantidad) ? 0 : cantidad);
    }, 0);

    setNotaEditada((prev) => ({
      ...prev,
      cantidad_total: total,
      id_usuario: User,
    }));
  }
};

  const handleNotaChange = (field, value) => {
    setNotaEditada(prev => ({ ...prev, [field]: value }));
  };
  

  const handleGuardarCambios = async () => {
    // setIsLoading(true);

    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Productos actualizados:", productos);
      const response2 = await putDatosLiberacion(productos);

      // setRegistrationSuccess(true);
      // onClose();
    } catch (error) {
      console.error("Error al enviar los datos", error);
      setRegistrationError(true);
      setIsLoading(false);
      setError(error.message);
    }finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }

  };


  const handleCloseModal = () => {
    setRegistrationSuccess(false);
  };

  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const openModalCliente = () => {
    setModalClienteOpen(true); // Abrir modal de productos
  };

  const handleSelectCliente = (cliente) => {
    // console.log("🚀 ~ handleSelectCliente ~ cliente:", cliente)
    setNotaEditada(prev => ({
      ...prev,
      id_cliente: cliente.id,
      descripcion_cliente: cliente.descripcion,
    }));

    setPais(cliente.pais);

    setModalClienteOpen(false); // Cerrar el modal de productos
  };


  const openModalCamion = () => {
    setModalCamionOpen(true); // Abrir modal de productos
  };

const handleSelectCamion = (camion) => {
  console.log("🚀 ~ handleSelectCamion ~ Camion:", camion);

  // Asignar id_vehiculo a cada producto
  const productosActualizados = productos.map((producto) => ({
    ...producto,
    id_vehiculo: camion.id, // asegurate que sea 'camion.id'
    chapa: camion.chapa, // asignar el chofer al producto
  }));

  setProductos(productosActualizados);

  // También podés asignar el vehículo al encabezado si es necesario
  setNotaEditada(prev => ({
    ...prev,
    id_vehiculo: camion.id,
    chapa: camion.chapa,
  }));

  setModalCamionOpen(false);
};

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-nota-fiscal"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <Box
        sx={{
          backgroundColor: colors.primary[600],
          padding: "20px",
          maxHeight: "90vh",
          overflowY: "auto",
          width: "90%",
          maxWidth: "1200px",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h2" mb={2} color={colors.grey[100]}>
          Pedido de Venta - Editar Nota Fiscal 
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              label="Cliente"
              value={notaEditada?.cliente || ""}
              onChange={(e) => handleNotaChange("cliente", e.target.value)}
              // onClick={openModalCliente}
              InputProps={{ readOnly: true }}

            />
            
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              label="Vehículo"
              value={notaEditada?.chapa || ""}
              onChange={(e) => handleNotaChange("id_vehiculo", e.target.value)}
              InputProps={{ readOnly: true }}
              onClick={openModalCamion}
            />
          </Grid>

        </Grid>

        {/* Productos */}
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2, marginTop: 4 }}>
          <Typography variant="h3" color={colors.grey[100]}>
            Productos
          </Typography>
        </Box>

        <Box mt={4}>
          
          {productos.map((producto, index) => (
            <Grid
              container
              spacing={2}
              key={producto.id}
              sx={{ mb: 2, pb: 1}}
            >
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Código"
                  value={producto.producto || ""}
                  onChange={(e) =>
                    handleProductoChange(index, "cod", e.target.value)
                  }
                  onClick={() => {
                    setProductoIndexSeleccionado(index); // guardás el índice seleccionado
                    setModalProductoOpen(true); // abrís el modal
                  }}
                  InputProps={{ readOnly: true }} 

                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Cantidad"
                  value={producto.cantidad || ""}
                  onChange={(e) =>
                    handleProductoChange(index, "cantidad", e.target.value)
                  }
                />
              </Grid>
            </Grid>
          ))}
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            onClick={onClose}
            color="secondary"
            variant="contained"
            sx={{
              border: "none",
              color: "black",
              height: "7vh",
              width: "10vw",
              borderRadius: "20px",
              cursor: "pointer",
              marginRight: "1vw",
            }}
          >
            Cerrar
          </Button>
          <Button
            onClick={handleGuardarCambios}
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: "rgb(206, 220, 0)",
              border: "none",
              color: "black",
              height: "7vh",
              width: "10vw",
              borderRadius: "20px",
              cursor: "pointer",
              marginRight: "1vw",

              "&:hover": { backgroundColor: "#bac609" },
            }}
          >
            Guardar Cambios
          </Button>
        </Box>
        <ModalCharge isLoading={isLoading} />

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
        
        <ModalProducto
          open={modalProductoOpen} // Estado del modal de productos
          onClose={() => setModalProductoOpen(false)} // Cerrar el modal de productos
          onSelectProduct={(producto) => {
            console.log("🚀 ~ ModalEditarPedido ~ producto:", producto)
            if (productoIndexSeleccionado !== null) {
              handleProductoChange(productoIndexSeleccionado, "cod", producto.cod);
              handleProductoChange(productoIndexSeleccionado, "producto_id", producto.id); 
              handleProductoChange(productoIndexSeleccionado, "descripcion", producto.descripcion);
              handleProductoChange(productoIndexSeleccionado, "medidas", producto.medidas);
              setModalProductoOpen(false);
            }
          }}
        />
        <ModalCliente
          open={modalClienteOpen} // Estado del modal de clientes
          onClose={() => setModalClienteOpen(false)} // Cerrar el modal de clientes
          onSelect={(cliente) =>
            handleSelectCliente(cliente, setNotaEditada)
          } // Lógica para seleccionar productos
        />

        <ModalCamion
          open={modalCamionOpen} // Estado del modal de Camions
          onClose={() => setModalCamionOpen(false)} // Cerrar el modal de Camions
          onSelectVehiculos={(Camion) =>
            handleSelectCamion(Camion, setNotaEditada)
          } // Lógica para seleccionar productos
        />
      </Box>
    </Modal>
  );
};

export default ModalEditarPedido;
