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
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalProducto from "../../modal/producto/modalProveedorProducto";
import {putForNote} from "../../services/stock.services.js";
import {ActualizarEntradaNotaFiscal} from "../../services/entradaNotaFiscal.services.js";
const ModalNotaFiscal = ({ open, onClose, dataNota, dataStock, numeroNota }) => {
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
  const User = parseInt(localStorage.getItem("id"));
  
  useEffect(() => {
    if (dataStock) {
      setProductos([...dataStock]);
    }
  }, [dataStock]);

  useEffect(() => {
    if (dataNota) {
      setNotaEditada({ ...dataNota });
    }
  }, [dataNota]);

  
  const handleProductoChange = (index, field, value) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index][field] = value;
    setProductos(nuevosProductos);

    if (field === "cantidad") {
      const total = nuevosProductos.reduce((acc, prod) => {
        const cantidad = parseFloat(prod.cantidad);
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
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Nota Editada:", notaEditada);
      console.log("Productos actualizados:", productos);
      const response = putForNote(productos);
      const response2 = await ActualizarEntradaNotaFiscal(notaEditada);

      setRegistrationSuccess(true);
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
        <Typography variant="h4" mb={2} color={colors.grey[100]}>
          Detalles de Nota Fiscal
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              label="Proveedor"
              value={notaEditada?.id_proveedor || ""}
              onChange={(e) => handleNotaChange("id_proveedor", e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              label="Nota Fiscal N°"
              value={numeroNota}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              label="Modelo"
              value={notaEditada?.modelo || ""}
              onChange={(e) => handleNotaChange("modelo", e.target.value)}
              select
            >
              <MenuItem value="Documento No Fiscal">Documento No Fiscal</MenuItem>
              <MenuItem value="Nota Fiscal Electronica">Nota Fiscal Electronica</MenuItem>
              <MenuItem value="Nota Fiscal Electronica Consumidor">
                Nota Fiscal Electronica Consumidor
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              label="Operación"
              value={notaEditada?.operacion || ""}
              onChange={(e) => handleNotaChange("operacion", e.target.value)}
              select
            >
              <MenuItem value="Entrada materia prima">Entrada Materia prima</MenuItem>
              <MenuItem value="Sim Entrada">Sin Entrada</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              label="Forma de Pago"
              value={notaEditada?.formaDePago || ""}
              onChange={(e) => handleNotaChange("formaDePago", e.target.value)}
              select
            >
              <MenuItem value="Efectivo">Efectivo</MenuItem>
              <MenuItem value="Cheque">Cheque</MenuItem>
              <MenuItem value="Transferencia Internacional">Transferencia Internacional</MenuItem>
              <MenuItem value="Transferencia Bancaria">Transferencia Bancaria</MenuItem>
              <MenuItem value="Pagare">Pagare</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              label="Condición de Pago"
              value={notaEditada?.condicionPago || ""}
              onChange={(e) => handleNotaChange("condicionPago", e.target.value)}
              select
            >
              <MenuItem value="Contado">Contado</MenuItem>
              <MenuItem value="30 dias">30 días</MenuItem>
              <MenuItem value="30/60 dias">30/60 días</MenuItem>
              <MenuItem value="90 dias">90 días</MenuItem>
              <MenuItem value="180 dias">180 días</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              label="Vehículo"
              value={notaEditada?.id_vehiculo || ""}
              onChange={(e) => handleNotaChange("id_vehiculo", e.target.value)}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              label="Cantidad Total"
              value={notaEditada?.cantidad_total || ""}
              onChange={(e) => handleNotaChange("cantidad_total", e.target.value)}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        {/* Productos */}

        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2, marginTop: 4 }}>
          <Typography variant="h6" color={colors.grey[100]}>
            Productos
          </Typography>
          {/* <Typography variant="h6" color={colors.grey[100]} sx={{ marginRight: "10vw" }}> 
            Cantidad total: {dataNota?.cantidad_total}
          </Typography> */}
        </Box>

        <Box mt={4}>
          
          {productos.map((producto, index) => (
            <Grid
              container
              spacing={2}
              key={producto.id}
              sx={{ mb: 2, pb: 1 }}
            >
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Código"
                  value={producto.cod || ""}
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
                  label="Serie"
                  value={producto.serie || ""}
                  onChange={(e) =>
                    handleProductoChange(index, "serie", e.target.value)
                  }
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
            if (productoIndexSeleccionado !== null) {
              handleProductoChange(productoIndexSeleccionado, "cod", producto.cod);
              handleProductoChange(productoIndexSeleccionado, "descripcion", producto.descripcion);
              handleProductoChange(productoIndexSeleccionado, "medidas", producto.medidas);
              setModalProductoOpen(false);
            }
          }}
          serviceType={notaEditada?.id_proveedor}
        />
      </Box>
    </Modal>
  );
};

export default ModalNotaFiscal;
