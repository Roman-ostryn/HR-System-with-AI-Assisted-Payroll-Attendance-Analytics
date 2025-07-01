

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Header from "../../components/Header";
import { Box, Button, TextField, Grid, useMediaQuery, useTheme, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { putChapas, putChapaOrden } from '../../services/stock.services';
import { getOneDatos } from '../../services/interfoliacion.services';
import { getChapas, getCaballeteView } from '../../services/ordenProduccion.services';
import ModalCaballete from '../../modal/caballete/modalCaballete';
import ModalSucces from "../../modal/modalSucces";
import ModalError from "../../modal/modalError";
import ModalCharge from "../../modal/modalCharge";
import { tokens } from "../../theme";

const validationSchema = yup.object({
  id_caballete: yup.string().required('Caballete es requerido'),
  cod_interno: yup.string().required('Serie requerido'),
});

const TransladoChapas = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [xd, setXd] = useState("");
  const [cab, setCab] = useState("");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [modalOpen, setModalOpen] = useState(false);
  const USER = localStorage.getItem('id');
  const EMPRESA = localStorage.getItem('cod_empresa') || 1;

  const formik = useFormik({
    initialValues: {
      id: '',
      id_caballete: '',
      descripcion: '',
      cod_interno: '',
    },
    validationSchema,

    
    onSubmit: async (values, { setFieldValue }) => {
      setIsLoading(true);
      const { id_caballete, cod_interno } = values;
    
      if (!cod_interno) {
        setRegistrationError(true);
        setError("El código interno es requerido");
        setIsLoading(false);
        return;
      }
    
      try {
        // Obtener datos antes de enviar
        const result = await getOneDatos(cod_interno);
        const xd = await getChapas(cod_interno);
        setXd(xd);
        setData(result);
    
        if (!result || !xd) {
          throw new Error("No se encontraron datos para el código interno");
        }
    
        const valuesToSend = {
          id: result.id,
          caballete_origen: cab.id,
          id_usuario: USER,
          cod_empresa: 1,
          id_caballete,
        };
    
        const edit = {
          id_caballete: cab.id,
        };
    
        // Simulación de retraso
        await new Promise((resolve) => setTimeout(resolve, 2000));
    
        if (result.id_caballete === id_caballete) {
          throw new Error(`La chapa ${xd.serie} ya se encuentra en este caballete`);
        }
    
        // Enviar datos
        await putChapas(result.id, valuesToSend);
        await putChapaOrden(xd.id, edit);
        fetchPrueba();
        setRegistrationSuccess(true);
        setFieldValue("cod_interno", "");
    
      } catch (error) {
        console.error("Error en el proceso:", error);
        setRegistrationError(true);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (formik.values.cod_interno) {
  //       try {
  //         const result = await getOneDatos(formik.values.cod_interno);
  //         const xd = await getChapas(formik.values.cod_interno);
  //         setXd(xd);
  //         setData(result);
  //       } catch (error) {
  //         console.error('Error al obtener los datos:', error);
  //         setRegistrationError(true);
  //         setError(error.message);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [formik.values.cod_interno]);

  const fetchPrueba = async () => {
    try {
      const response = await getCaballeteView();
      setData(response);
      setFilteredData(response);
    } catch (error) {
      console.error("Error al obtener los datos del backend:", error);
    }
  };

  useEffect(() => {
    fetchPrueba();
  }, []);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    const filtered = data.filter((item) =>
      item.orden.toLowerCase().includes(value.toLowerCase()) ||
      item.cod_interno.toString().includes(value) ||
      item.cod.toString().includes(value) ||
      item.Estado.toString().includes(value)
    );
    setFilteredData(filtered);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "descripcion",
      headerName: "Caballete",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "total_registros",
      headerName: "Productos",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
  ];


  return (
    <Box m="20px" sx={{ overflowY: "auto", maxHeight: "100vh", '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb:hover': { backgroundColor: 'rgba(0, 0, 0, 0.4)' } }}>
    {/* <Box m="20px"> */}
      <Box display="flex" justifyContent="space-between" p={0}>
        <Header title="Translado de Chapas" subtitle="Transladar Chapas" />
        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            height={"40%"}
            width={"90%"}
            ml={1}
            sx={{ overflowY: "auto", maxHeight: "100vh" }}
          >
            {/* <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Buscar"
              value={searchValue}
              onChange={handleSearchChange}
            /> */}
            {/* <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton> */}
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
          "& .estado-pendiente": {
            backgroundColor: "#740017",
            textShadow: "2px 2px 2px 2px #ffffff",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important",
            },
          },
          "& .estado-completo": {
            backgroundColor: "green",
            textShadow: "2px 2px 2px 2px #ffffff",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important",
            },
          },
          "& .estado-en-proceso": {
            backgroundColor: "#ff6105",
            textShadow: "2px 2px 2px 2px #ffffff",
            color: "white !important",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important",
            },
          },
          "& .estado-default": {
            color: "gray",
            textShadow: "2px 2px 2px 2px #ffffff",
            "&:hover": {
              backgroundColor: "rgb(27 33 54) !important",
            },
          },
        }}
      >
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Caballete" 
                name="id_caballete"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.id_caballete && Boolean(formik.errors.id_caballete)}
                helperText={formik.touched.id_caballete && formik.errors.id_caballete}
                onClick={() => setModalOpen(true)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Serie"
                name="cod_interno"
                value={formik.values.cod_interno}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cod_interno && Boolean(formik.errors.cod_interno)}
                helperText={formik.touched.cod_interno && formik.errors.cod_interno}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="end" mt="-3vh">
                <Button type="submit" color="secondary" variant="contained" sx={{ background: "#cedc00",
                  marginBottom: "5vh",
                  height: "6vh",
                  width: isNonMobile ? 'auto' : '100%',
                  marginTop: "2vh"
                }}>
                  Transladar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        
        {registrationSuccess && <ModalSucces open={registrationSuccess} onClose={() => setRegistrationSuccess(false)} />}
        {registrationError && <ModalError open={registrationError} onClose={() => setRegistrationError(false)} error={error} />}
        <ModalCharge isLoading={isLoading} />
        <ModalCaballete
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={(data) => {
            setCab(data)
            formik.setFieldValue("descripcion", data.descripcion);
            formik.setFieldValue("id_caballete", data.id);
            setModalOpen(false);
          }}
          serviceType={0}
        />
  
        {/* Tabla de datos */}
        {filteredData && (
          <DataGrid
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row.id}
            components={{ Toolbar: GridToolbar }}
            // getRowClassName={getRowClassName}
            disableMultipleSelection={true}
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
              "& .estado-pendiente": {
                backgroundColor: "#740017",
                textShadow: "2px 2px 2px 2px #ffffff",
                "&:hover": {
                  backgroundColor: "rgb(27 33 54) !important",
                },
              },
              "& .estado-completo": {
                backgroundColor: "green",
                textShadow: "2px 2px 2px 2px #ffffff",
                "&:hover": {
                  backgroundColor: "rgb(27 33 54) !important",
                },
              },
              "& .estado-en-proceso": {
                backgroundColor: "#ff6105",
                textShadow: "2px 2px 2px 2px #ffffff",
                color: "white !important",
                "&:hover": {
                  backgroundColor: "rgb(27 33 54) !important",
                },
              },
              "& .estado-default": {
                color: "gray",
                textShadow: "2px 2px 2px 2px #ffffff",
                "&:hover": {
                  backgroundColor: "rgb(27 33 54) !important",
                },
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
  };
  
  export default TransladoChapas;
  