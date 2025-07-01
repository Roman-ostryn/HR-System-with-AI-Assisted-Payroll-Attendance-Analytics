import React, { useState, useEffect } from "react";
import { Box, Button, Modal, TextField, useTheme, Switch, FormControlLabel } from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import ModalCharge from "../modalCharge";
import LoadingSpinner from "../../loadingSpinner";
import ModalSucces from "../modalSucces";
import ModalError from "../modalError";
import ModalPermiso from "../login/modalPermiso";
import { PostCargaPedido, getOnePedidoVenta, updateVentaStock, getOneProducto } from "../../services/pedidoVenta.services";
import { getOne } from "../../services/stock.services";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ModalCargamento = ({ open, onClose, registro }) => {
  const [data, setData] = useState(0);
  const [datos, setDatos] = useState([]);
  const [descripcion, setDescripcion]= useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  const [codProducto, setCodProducto] = useState(""); // Nuevo estado para almacenar el `cod` del servicio `getOne`
  const [switchState, setSwitchState] = useState(true); // Estado para el switch
  const [switchState2, setSwitchState2] = useState(false); // Estado para el switch
  const [showSecondSerie, setShowSecondSerie] = useState(false); // Estado para mostrar el segundo input
  const [userData, setUserData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const USER = localStorage.getItem('id');
  const Cod_empresa = parseInt(localStorage.getItem('cod_empresa'));

  const [initialValues, setInitialValues] = useState({
    serie: "",
    serie2: "",
  });

  
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Obtener datos de pedido
  const fetchPrueba = async () => {
    try {
      if (registro) {
        const response = await getOnePedidoVenta(registro?.id);
        setData(response);
      }
    } catch (error) {
      console.error("Error al obtener los datos del backend:", error);
    }
  };

  useEffect(() => {
    fetchPrueba();
  }, [registro?.id]);


  useEffect(() => {
    if (switchState2) {
      setOpenModal(true);
    }
  }, [switchState2]);

  // Nuevo useEffect para obtener el `cod` cuando cambia `serie` y `serie2` y se selecciona el switch individual
  useEffect(() => {
    const fetchCodigo = async () => {
      if (switchState2 && initialValues.serie?.trim().length > 5 && initialValues.serie2?.trim().length > 5) {
        try {
          if (descripcion === 1) {
            const response = await getOne(initialValues.serie);
            response.cantidad = 1;
            response.cantidad_entrada = 1;
            response.descripcion = "Monolitico";
            setDatos(response);
          } else {
            const response = await getOneProducto(initialValues.serie, initialValues.serie2);
            response.cantidad = 1;
            response.cantidad_entrada = 1;
            setDatos(response);

            if (response && response.cod) {
            const formattedCod = response.cod.replace(/^[A-Z]-/, "");
            setCodProducto(formattedCod);
            }
          }
        } catch (error) {
          console.error("Error al obtener la comparación del producto:", error);
          toast.error("Error al obtener la comparación del producto", { position: "top-center" });
        }
      } else if (initialValues.serie?.trim().length > 5 && !switchState2) {
        try {
          const response = await getOne(initialValues.serie);
          if (response.descripcion && response.descripcion.startsWith('VIDRO MONOLITICO')) {
            response.descripcion = "Monolitico"; // Aplicar la descripción correcta
            setDescripcion(1); // Guardar en el estado
          }
          setDatos(response);
          if (response && response.cod) {
            const formattedCod = response.cod.replace(/^[A-Z]-/, "");
            setCodProducto(formattedCod);

            const formattedCodNormalized = formattedCod.trim().toUpperCase();
            const registroProductoNormalized = (registro?.producto || "").trim().toUpperCase();

            if (formattedCodNormalized !== registroProductoNormalized) {
              toast.error("El código del producto no coincide con el pedido", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            }
          }
        } catch (error) {
          console.error("Error al obtener el código del producto:", error);
        }
      }
    };

    fetchCodigo();
  }, [initialValues.serie, initialValues.serie2, switchState2, registro?.producto]); 


  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    const { serie, serie2 } = values;
  
    const formattedCod = codProducto.replace(/^[A-Z]-/, "");
    const formattedCodNormalized = formattedCod.trim().toUpperCase();
    const registroProductoNormalized = (registro?.producto || "").trim().toUpperCase();
  
    if (formattedCodNormalized !== registroProductoNormalized) {
      toast.error("El código del producto no coincide con el pedido", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsLoading(false);
      return;
    }
  
    // Validar cantidad según el estado del switch
    if (switchState && datos.cantidad <= 1) {
      toast.error("Para registrar un paquete, la cantidad debe ser mayor a 1", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsLoading(false);
      return;
    }
  
    if (switchState2 && datos.cantidad !== 1) {
      toast.error("Para registrar individualmente, la cantidad debe ser 1", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsLoading(false);
      return;
    }
  
    if (parseInt(parseInt(data.total_cargas)) == data.cantidad) {
      toast.error("Error al registrar, el pedido esta completado", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsLoading(false);
      return;
    }

    // Validar si la cantidad total supera la cantidad del pedido
    if (parseInt(data.total_cargas) + datos.cantidad_entrada > parseInt(registro.cantidad)) {
      const cantidadRestante = parseInt(registro.cantidad) - parseInt(data.total_cargas);
      datos.cantidad = cantidadRestante;
      toast.warning("La cantidad del Paquete supera la cantidad total del pedido. Se registrará la diferencia.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  
    const edit = {
      id_pedidoVenta: data.id_vehiculo,
    };
  
    const valuesToSend = {
      id_pedido: registro.id,
      cod_empresa: Cod_empresa,
      id_usuario: parseInt(USER),
      n_pedido: registro.n_pedido,
      cantidad: datos.cantidad_entrada,
      serie: switchState2 ? serie2 : serie,
      descripcion:datos.descripcion,
      id_vehiculo: registro.id_vehiculo,
    };
  
    try {
      if (parseInt(data.cantidad) === parseInt(data.total_cargas)) {
        toast.warning(`Pedido ${registro.n_pedido} ya está completo`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIsLoading(false);
        handleClose()
      } else {
        console.log("🚀 ~ handleFormSubmit ~ valuesToSend:", valuesToSend)

        await new Promise((resolve) => setTimeout(resolve, 3000));
        await PostCargaPedido(valuesToSend);
        await updateVentaStock(datos.id, edit);
        setIsLoading(false);
        
        if (switchState2) {
          setInitialValues((prev) => ({ ...prev, serie2: "" })); // Vaciar serie2 solo si switchState2 está activado
        } else {
          setInitialValues((prev) => ({ ...prev, serie: "" })); // Vaciar serie solo si switchState está activado
        }
        setRegistrationSuccess(true);
      }
    } catch (error) {
      setIsLoading(false);
      // setRegistrationError(true);
      toast.warn(error.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      // setError(error.message);
    }
  
    fetchPrueba();
  };
  
  const handleCloseModalError = () => {
    setRegistrationError(false);
  };

  const handleCloseModal = () => {
    setRegistrationSuccess(false);
    // setInitialValues({ serie: "" });
  };

  const handleClose = () => {
    setInitialValues({ serie: "" });
    onClose();
  };

  const handleClosePermiso = () => {
    if (userData !== 1) { // Verifica si el usuario no tiene el nivel 1
      setSwitchState(true);
      setShowSecondSerie(false);
      
    }
    setSwitchState2(false);

  };

  const handleSuccess = (data) => {
    setUserData(data); // Guardar los datos del usuario en el estado

    if (data !== 1) { // Verifica si el usuario no tiene el nivel 1
      setSwitchState(true);
      setShowSecondSerie(false);
      
    }else{
      setSwitchState(false);
      setShowSecondSerie(true);
      setSwitchState2(true);
    }
    setOpenModal(false);
  
  };

  const handleCloseModalPermiso = () => {
    if (userData !== 1) { // Verifica si el usuario no tiene el nivel 1
      setSwitchState(true);
      setSwitchState2(false);
      setShowSecondSerie(false);
      setOpenModal(false);
    }else{
      setSwitchState(false);
      setSwitchState2(true);
      setShowSecondSerie(true);
      setOpenModal(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="registration-success-modal-title"
      aria-describedby="registration-success-modal-description"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        }}
      >
        <Box m="0px">
          <Box display="flex" justifyContent="space-between" p={2}>
            <h1>Bipear Producto</h1>
          </Box>
          <h2>{registro?.producto}</h2>
          <Box
            m="10px 0"
            height="30vh"
            width="40vh"
            sx={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {isLoading && <LoadingSpinner />}

            <Formik
              onSubmit={handleFormSubmit}
              initialValues={initialValues}
              validationSchema={checkoutSchema}
              context={{ showSecondSerie }}
              enableReinitialize
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Box display="grid" gap="30px">
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Serie"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        setInitialValues((prev) => ({ ...prev, serie: e.target.value }));
                      }}
                      value={values.serie}
                      name="serie"
                      error={!!touched.serie && !!errors.serie}
                      helperText={touched.serie && errors.serie}
                    />
                    {showSecondSerie && <TextField 
                      label="Chapa" onBlur={handleBlur} 
                      onChange={(e) => {
                        handleChange(e);
                        setInitialValues((prev) => ({ ...prev, serie2: e.target.value }));
                      }} 
                      value={values.serie2 || ""} 
                      name="serie2" 
                      fullWidth error={!!touched.serie2 && !!errors.serie2}
                      helperText={touched.serie2 && errors.serie2}
                    />}
                    <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={switchState}
                          onChange={() => {
                            setSwitchState(true);
                            setSwitchState2(false);
                            setShowSecondSerie(false);
                          }}
                          color="secondary"
                        />
                      }
                      label="Paquete"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={switchState2}
                          onChange={() => {
                            setSwitchState2(true);
                            setSwitchState(false);
                            setShowSecondSerie(true);
                          }}
                          color="secondary"
                        />
                      }
                      label="Individual"
                    />
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="end" mt="20px">
                    <Button type="submit" color="secondary" variant="contained" sx={{ width: "100%", backgroundColor: "rgb(206, 220,0)"}}>
                      Registrar
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
        {switchState2 && <ModalPermiso open={openModal} onClose={handleCloseModalPermiso} onSuccess={handleSuccess} />}
        <ModalCharge isLoading={isLoading} />
        <ModalSucces open={registrationSuccess} onClose={handleCloseModal} />
        <ModalError open={registrationError} onClose={handleCloseModalError} error={error} />
      </Box>
    </Modal>
  );
};

const checkoutSchema = yup.object().shape({
  serie: yup.string().required("Campo requerido"),
  serie2: yup.string().when("$showSecondSerie", {
    is: true,
    then: yup.string().required("Campo requerido para individual"),
    otherwise: yup.string().notRequired(),
  }),
  
});

export default ModalCargamento