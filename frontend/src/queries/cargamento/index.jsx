import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import ProgressCircle from "../../components/ProgressCircle"; // Importa el componente ProgressCircle
import { getCargamento } from "../../services/pedidoVenta.services";
import ModalCargamento from "../../modal/cargamento/modalCargamento"; // Importa el modal
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';


const Cargamento = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [registroLavadora, setRegistroLavadora] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fetchPrueba = async () => {
    try {
      const response = await getCargamento();
      setData(response);
    } catch (error) {
      console.error("Error al obtener los datos del backend:", error);
    }
  };

  useEffect(() => {
    if (!open) {
      fetchPrueba();
    }
  }, [open]);

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpen(false);
    fetchPrueba();
  };
  
  const handleOpenModal = (pedido) => {
    if(pedido.cantidad == pedido.total_cargas){
      toast.success(`Pedido ${pedido.n_pedido} completado`, {
        position: "top-center",
        autoClose: 5000, // Tiempo de cierre automático
        hideProgressBar: true, // Oculta la barra de progreso
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        
      });
    }else{
      setRegistroLavadora(pedido)
      setOpen(true);
    }
    
  };

  return (
    <Box m="20px"  sx={{
      overflowY: "auto",
      maxHeight: "90vh",
      '&::-webkit-scrollbar': {
        width: '8px',
        backgroundColor: 'transparent', // Asegura que el fondo del scrollbar sea transparente
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent', // Fondo del track también transparente
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Color del thumb (parte que puedes arrastrar)
        borderRadius: '10px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0)', // El color cuando el thumb está en hover se vuelve completamente transparente
      },
    }}>
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="Cargamento" subtitle="Orden de Carga" />
      </Box>
      {/* Estilo de presentación en columnas */}
      <Box display="flex" flexDirection="column" gap="20px">
        {data.map((pedido) => (
          <Box
            key={pedido.id} // Usamos la propiedad 'id' para asegurar que cada pedido tenga una clave única
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="flex-start" // Cambiado a "flex-start" para alinear el contenido a la izquierda
            sx={{ width: "100%", height: "170px", padding: "20px", }}
          >
            <Box display="flex" width="100%" alignItems="center" justifyContent="flex-start">
              {/* ProgressCircle para cada pedido */}
              <Box>
                <ProgressCircle
                  progress={Math.min(1, Math.max(0, pedido.total_cargas / pedido.cantidad))}// Progreso basado en la cantidad de cada pedido
                  size="90"
                />
              </Box>
              {/* Detalles de cada pedido alineados a la izquierda */}
              <Box ml={2} textAlign="left" width={"60vw"} sx={{paddingBottom:"0.5vh"}}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: colors.grey[100] }}>
                  {pedido.producto} {/* Muestra la cantidad de cada pedido */}
                </Typography>
                <Typography variant="h6" sx={{ color: colors.grey[200] }}>
                  Vehiculo: {pedido.chapa} {/* Muestra el nombre del producto */}
                </Typography>
                <Typography variant="h6" sx={{ color: colors.grey[200] }}>
                  Cantidad: {pedido.cantidad} {/* Muestra el nombre del producto */}
                </Typography>
                <Typography variant="h6" sx={{ color: colors.grey[200] }}>
                  Cargados: {pedido.total_cargas} {/* Muestra el nombre del producto */}
                </Typography>
                <Typography variant="h6" sx={{ color: colors.grey[200] }}>
                  Proceso: {((pedido.total_cargas / pedido.cantidad) * 100).toFixed(2)}%
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => handleOpenModal(pedido)} 
                  sx={{
                    backgroundColor: "rgb(206, 220,0)", // Color del subtítulo
                    color: colors.primary[900], // Texto oscuro para contraste
                    mt: 0.5, // Margen superior
                    "&:hover": {
                      backgroundColor: colors.grey[300], // Color más claro al pasar el mouse
                    },
                    
                  }}
                >
                  Seleccionar
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <ModalCargamento
        open={open}
        onClose={handleCloseModal}
        registro={registroLavadora} // Mostrar los datos recibidos
        //  sector="lavadora"
      />
    </Box>
  );
};

export default Cargamento;
