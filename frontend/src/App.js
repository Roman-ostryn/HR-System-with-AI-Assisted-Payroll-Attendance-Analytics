import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Work from "./queries/works";
import Registration from "./registration";
import Queries from "./queries";
import Activity from "./registration/activity";
import Owner from "./registration/owner";
import OwnerQuery from "./queries/owners";
import { Login } from "./login";
// import Inventario from "./queries/inventario/index";
// import useFetchDataPeriodically from "./customHooks/autoClave";
import useInactivityTimeout from "./customHooks/inactivityHook";
import ProtectedRoute from "./components/ProtectedRoute";
// import Products from "./registration/Products";
// import Truks from "./queries/list Truk";
// import Hangar2 from "./queries/Pantallas/hangar2";
// import Hangar1 from "./queries/Pantallas/hangar1";
// import Porteria from "./queries/Pantallas/porteria";
// import Portero from "./queries/porteria view";
// import Camiones from "./registration/camiones";
import Dracena from "./dracena/dracena";
import Resumen from "./queries/resumen/index";
import Grupos from "./registration/grupos";
import Salarios from "./registration/salarios";
import Horarios from "./registration/horarios";
import ListaMarcaciones from "./queries/resumen/lista marcaciones";
import RegistroDescuento from "./registration/descuento";
import RegistroAdelanto from "./registration/adelanto";
import DescuentoView from "./queries/descuento";
import HorasExtras from "./queries/horasExtras";
import HorariosView from "./queries/horarios";
import GruposView from "./queries/grupos";
import Salariosview from "./queries/salarios";
import Usuarioview from "./queries/usuarios";
import HorasExtrasR from "./registration/horasExtras";
import PlusView from "./queries/plus";
import MetasView from "./queries/metas";
import MetasR from "./registration/metas";
import Calandra from "./registration/calandra";
import Interfoliacion from "./registration/interfoliacion";
import Graficos from "./scenes/graficos";
import ReporteCalandra from "./queries/reporteCalandra";
import ReporteDescarga from "./queries/reporteDescarga";
import ReporteLavadora from "./queries/reporteLavadora";
import ReporteSalaLimpia from "./queries/reporteSalaLimpia";
// import ReporteviewInterView from "./queries/reporteInterView";
import ReporteviewStock from "./queries/reporteStock";
import ReporteviewCalandra from "./queries/reporteCalandra";
import LavadoraCalandraView from "./queries/LavadoraCalandraView";
import CalandraInterfoliacionView from "./queries/CalandraInterfoliacionView";
import ReporteviewInter from "./queries/reporteInterView";
import Stock from "./registration/stock";
import ReporteStock from "./registration/reporteStock";
import ReporteCalandrar from "./registration/reporteCalandra";
import ReporteDescargar from "./registration/reporteDescarga";
import ReporteLavadorar from "./registration/reporteLavadora";
import ReporteSalaLimpiar from "./registration/reporteSalaLimpia";
import ReporteInterfoliacion from "./registration/reporteInterfoliacion";
import ProduccionPie from "./components/ProduccionPie";
import CalandraRegistroView from "./queries/Calandra Registro View";
import OrdenProduccionView from "./queries/ordenProduccionView";
// import CalandrTest from "./registration/calandratestticket";
import Productos from "./registration/productos";
import Loading from "./loadingSpinner/refresh";
// import '@fortawesome/fontawesome-free/css/all.min.css';
import InterfoliacionR from "./registration/interfoliacion";
import Aprovechamiento from "./registration/aprovechamiento";
import Ventas from "./registration/ventas";
import OrdenProduccion from "./registration/ordenProduccion";
import Proveedor from "./registration/proveedor";
import Pagos from "./registration/pagos";
import NumeroSerie from "./queries/numeroSerie";
import AguinaldoIps from "./queries/aguinaldoIps";
import AguinaldoInterno from "./queries/aguinaldo Interno";
import PagosView from "./queries/pagos";
import LoadingBar from 'react-top-loading-bar';
import TopLoadingBar from "./loadingSpinner/topLoading";
import Lavadora from "./queries/lavadora";
import SalaLimpia from "./queries/salalimpia";
import StockView from "./queries/stock";
import StockMonoliticoView from "./queries/stock/stockMonolitico";
import StockLaminadoView from "./queries/stock/stockLaminado.jsx";
import StockPVBView from "./queries/stock/stockPVB";
import CalandraTrue from "./queries/calandraTrue";
import PVB from "./registration/pvb";
import Vehiculo from "./registration/vehiculo";
import Caballete from "./registration/caballete";
import Cliente from "./registration/cliente";
import EntradaNotaFiscal from "./registration/entradaNotaFiscal";
import PvbNotaFiscal from "./registration/pvbNotaFiscal";
import { ToastContainer } from 'react-toastify';
import LiberarStock from "./queries/liberarStock";
import NotasFiscales from "./queries/notasFiscales";
import Quiebra from "./registration/quiebra";
import AntiguoRp from "./queries/rpInterBase64";
import Translados from "./queries/translados";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Descarga from "./registration/descarga";
import Transferencia from "./registration/transferenciaEmpresas";
import TransladoChapas from "./registration/transladoChapa";
import Receta from "./registration/receta";
import QuiebraV from "./queries/quiebra";
import SalaLimpiaT from "./registration/salaLimpia";
import SalaLimpiaView from "./queries/salaLimpiaT";
import ExportacionZD from "./registration/contabilidad/facturacion";
import ExportacionA from "./registration/contabilidad/facturacion/FacturaArgentina";
import AutoClave from "./registration/autoClave";
import SalidaAutoClave from "./registration/salidaAutoClave";
import HistorialVentas from "./queries/historial_venta/index.jsx";
import PedidoVenta from "./registration/pedidoVenta";
import Precio from "./registration/precio";
import PrecioView from "./queries/listaPrecio";
import Historial from "././queries/historial";
import LiberarFinanciero from "././queries/liberarFinanciero";
import LiberarCamiones from "././queries/liberarCamiones";
import Cargamento from "./queries/cargamento";
import ExportacionVentana from "./registration/contabilidad/ventana/index.jsx";
import Palitero from "./queries/palitero/index.jsx";
import StockCaballete from "./queries/stockCaballete/index.jsx";
import ListaProducto from "./queries/producto/index.jsx";
import HistorialChapa from "./queries/historialChapa/index.jsx";
import StockCoinvertir from "./queries/stock/stockCoinvertir.jsx";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Reembalar from "./queries/reembalar";
// ...existing code...
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// ...existing code...

// const columns = [
//   {
//     field: "menu",
//     headerName: "",
//     flex: 0.2,
//     renderCell: (params) => (
//       <IconButton onClick={(event) => handleMenuClick(event, params.row)}>
//         <MenuIcon />
//       </IconButton>
//     ),
//   },
//   { field: "id", headerName: "ID", flex: 0.5 },
//   { field: "descripcion", headerName: "Descripcion", flex: 2, cellClassName: "name-column--cell"},
//   { field: "colar", headerName: "Colar", flex: 1.5 },
//   { field: "caballete", headerName: "Caballete", flex: 0.5 },
//   {
//     field: "acciones",
//     headerName: "Acciones",
//     flex: 0.5,
//     sortable: false,
//     filterable: false,
//     renderCell: (params) => (
//       <Box>
//         <IconButton
//           color="primary"
//           onClick={() => handleEdit(params.row)}
//           size="small"
//         >
//           <EditIcon />
//         </IconButton>
//         <IconButton
//           color="error"
//           onClick={() => handleDelete(params.row)}
//           size="small"
//         >
//           <DeleteIcon />
//         </IconButton>
//       </Box>
//     ),
//   },
//   // ...otras columnas...
// ];
// ...existing code...

// Agrega estas funciones en tu componente:
// const handleEdit = (row) => {
//   // Lógica para editar el registro
//   setRegistro(row);
//   setOpen(true); // O abre tu modal de edición
// };

// const handleDelete = (row) => {
//   // Lógica para eliminar el registro
//   if (window.confirm(`¿Seguro que deseas eliminar el registro ${row.id}?`)) {
//     // Aquí llamas a tu servicio de borrado y refrescas la tabla
//     // await deleteRegistro(row.id);
//     // fetchPrueba();
//   }
// };
// ...existing code...
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Usar useNavigate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const ref = useRef(null);
  const [loading, setLoading] = useState(true); // Estado de carga para evitar renderizado prematuro
  const [isLoading, setIsLoading] = useState(false);
  // useFetchDataPeriodically(); 
  useInactivityTimeout(18000000); 
  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");

  //   // Introducir un retraso de 1 segundo antes de actualizar el estado
  //   const timer = setTimeout(() => {
  //     if (token) {
  //       setIsAuthenticated(true); // El token existe, autenticar
  //     } else {
  //       setIsAuthenticated(false); // No hay token, no autenticar
  //     }
  //     setLoading(false); // Estado de carga completado
  //   }, 2000); // Retraso de 1 segundo

  //   return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
  // }, []);




  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const isTokenExpired = (token) => {
      if (!token) return true; // Si no hay token, se considera expirado

      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        return decoded.exp < currentTime; // Retorna true si ya expiró
      } catch (error) {
        return true; // Si hay un error al decodificar, el token es inválido
      }
    };
 
    const checkAuth = () => {
      if (token && !isTokenExpired(token)) {
        setIsAuthenticated(true); // Token válido
      } else {
        setIsAuthenticated(false); // Token inválido o inexistente
        localStorage.removeItem("authToken"); // Eliminar token expirado
        toast.error(`Token Vencido Vuelve a Iniciar Sesion`, { position: "top-center", autoClose: 9000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: true });
        // navigate("/login"); // ✅ Redirigir sin recargar la página
      }
      setLoading(false);
    };

    setTimeout(checkAuth, 2000); // Retraso de 2 segundos

  }, [navigate]); // ✅ Dependencia agregada para evitar bucles infinitos






  // Si estamos cargando, mostramos un loader o mensaje de "Loading..."
  if (loading) { return <TopLoadingBar /> }



  const isLoginRoute = location.pathname === "/login";
  const isHangar1Route = location.pathname === "/hangar1";
  const isHangar2Route = location.pathname === "/hangar2";
  const isPorteriaRoute = location.pathname === "/porteria";
  const isLavadoraRoute = location.pathname === "/lavadora";
  const isSalaLimpia = location.pathname === "/salalimpia";
  const isCalandraTrue = location.pathname === "/calandraTrue";
  const isTransladoChapa = location.pathname === "/registro/transladoChapas";
  const isInterfoliacion = location.pathname === "/registro/interfoliacion";
  const isSalida = location.pathname === "/registro/salidaAutoclave";
  const isDescarga = location.pathname === "/registro/descarga";
  const isTransEmpresa = location.pathname === "/registro/transferenciaEmpresas";
  const isCargamento = location.pathname === "/view/cargamento";



  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginRoute && !isAuthenticated && <Navigate to="/login" replace />}
          {!isLoginRoute && !isHangar1Route && !isLavadoraRoute && !isCargamento && !isDescarga && !isInterfoliacion && !isTransEmpresa && !isTransladoChapa && !isSalida && !isSalaLimpia && !isCalandraTrue && !isHangar2Route &&  !isPorteriaRoute && isAuthenticated && <Sidebar isSidebar={isSidebar} />}
          <main className={isHangar1Route ? "full-screen-content" : "content"}>
            {!isLoginRoute && !isHangar1Route && !isPorteriaRoute && !isCargamento && !isLavadoraRoute && !isTransEmpresa && !isInterfoliacion &&!isDescarga && !isSalida &&  !isTransladoChapa && !isSalaLimpia && !isCalandraTrue && !isHangar2Route && isAuthenticated && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dracena /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/work" element={<ProtectedRoute><Work /></ProtectedRoute>} />
              <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
              <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
              <Route path="/form" element={<ProtectedRoute><Form /></ProtectedRoute>} />
              <Route path="/registration" element={<ProtectedRoute><Registration /></ProtectedRoute>} />
              <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
              <Route path="/owner" element={<ProtectedRoute><Owner /></ProtectedRoute>} />
              <Route path="/owner/query" element={<ProtectedRoute><OwnerQuery /></ProtectedRoute>} />
              <Route path="/queries" element={<ProtectedRoute><Queries /></ProtectedRoute>} />
              <Route path="/bar" element={<ProtectedRoute><Bar /></ProtectedRoute>} />
              <Route path="/pie" element={<ProtectedRoute><Pie /></ProtectedRoute>} />
              <Route path="/line" element={<ProtectedRoute><Line /></ProtectedRoute>} />
              <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
              <Route path="/geography" element={<ProtectedRoute><Geography /></ProtectedRoute>} />
              {/* <Route path="/Inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} />
              <Route path="/Products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/truks" element={<ProtectedRoute><Truks /></ProtectedRoute>} />
              <Route path="/hangar2" element={<ProtectedRoute><Hangar2 /></ProtectedRoute>} />
              <Route path="/hangar1" element={<ProtectedRoute><Hangar1 /></ProtectedRoute>} />
              <Route path="/porteria" element={<ProtectedRoute><Porteria /></ProtectedRoute>} />
              <Route path="/portero" element={<ProtectedRoute><Portero /></ProtectedRoute>} />
              <Route path="/camiones" element={<ProtectedRoute><Camiones /></ProtectedRoute>} /> */}
              <Route path="/resumen" element={<ProtectedRoute><Resumen /></ProtectedRoute>} />
              <Route path="/registro/grupos" element={<ProtectedRoute><Grupos /></ProtectedRoute>} />
              <Route path="/registro/salarios" element={<ProtectedRoute><Salarios /></ProtectedRoute>} />
              <Route path="/registro/horarios" element={<ProtectedRoute><Horarios /></ProtectedRoute>} />
              <Route path="/lista/marcaciones" element={<ProtectedRoute><ListaMarcaciones /></ProtectedRoute>} />
              <Route path="/registro/descuento" element={<ProtectedRoute><RegistroDescuento /></ProtectedRoute>} />
              <Route path="/registro/adelanto" element={<ProtectedRoute><RegistroAdelanto /></ProtectedRoute>} />
              <Route path="/view/descuento" element={<ProtectedRoute><DescuentoView /></ProtectedRoute>} />
              <Route path="/view/horasExtras" element={<ProtectedRoute><HorasExtras /></ProtectedRoute>} />
              <Route path="/view/grupos" element={<ProtectedRoute><GruposView /></ProtectedRoute>} />
              <Route path="/view/horarios" element={<ProtectedRoute><HorariosView /></ProtectedRoute>} />
              <Route path="/view/salarios" element={<ProtectedRoute><Salariosview /></ProtectedRoute>} />
              <Route path="/view/usuarios" element={<ProtectedRoute><Usuarioview /></ProtectedRoute>} />
              <Route path="/registro/horasExtras" element={<ProtectedRoute><HorasExtrasR /></ProtectedRoute>} />
              <Route path="/view/plusView" element={<ProtectedRoute><PlusView /></ProtectedRoute>} />
              <Route path="/view/metasView" element={<ProtectedRoute><MetasView /></ProtectedRoute>} />
              <Route path="/registro/metas" element={<ProtectedRoute><MetasR /></ProtectedRoute>} />
              <Route path="/registro/calandra" element={<ProtectedRoute><Calandra /></ProtectedRoute>} />
              <Route path="/registro/interfoliacion" element={<ProtectedRoute><Interfoliacion /></ProtectedRoute>} />
              <Route path="/graficos" element={<ProtectedRoute><Graficos /></ProtectedRoute>} />
              <Route path="/view/reporteCalandra" element={<ProtectedRoute><ReporteCalandra /></ProtectedRoute>} />
              <Route path="/view/reporteDescarga" element={<ProtectedRoute><ReporteDescarga /></ProtectedRoute>} />
              <Route path="/view/reporteLavadora" element={<ProtectedRoute><ReporteLavadora /></ProtectedRoute>} />
              <Route path="/view/reporteSalaLimpia" element={<ProtectedRoute><ReporteSalaLimpia /></ProtectedRoute>} />
              <Route path="/registro/reporteStock" element={<ProtectedRoute><ReporteStock /></ProtectedRoute>} />
              <Route path="/registro/reporteCalandra" element={<ProtectedRoute><ReporteCalandrar /></ProtectedRoute>} />
              <Route path="/registro/reporteDescarga" element={<ProtectedRoute><ReporteDescargar/></ProtectedRoute>} />
              <Route path="/registro/reporteLavadora" element={<ProtectedRoute><ReporteLavadorar/></ProtectedRoute>} />
              <Route path="/registro/reporteSalaLimpia" element={<ProtectedRoute><ReporteSalaLimpiar/></ProtectedRoute>} />
              <Route path="/registro/reporteInterfoliacion" element={<ProtectedRoute><ReporteInterfoliacion/></ProtectedRoute>} />
              <Route path="/prod" element={<ProtectedRoute><ProduccionPie/></ProtectedRoute>} />
              <Route path="/view/calandraRegistro" element={<ProtectedRoute><CalandraRegistroView/></ProtectedRoute>} />
              <Route path="/registro/productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
              <Route path="/registro/interfoliacion" element={<ProtectedRoute><InterfoliacionR /></ProtectedRoute>} />
              <Route path="/registro/aprovechamiento" element={<ProtectedRoute><Aprovechamiento /></ProtectedRoute>} />
              <Route path="/view/vistaStock" element={<ProtectedRoute><ReporteviewStock /></ProtectedRoute>} />
              <Route path="/view/vistaLavadoraCalandra" element={<ProtectedRoute><LavadoraCalandraView /></ProtectedRoute>} />
              <Route path="/view/vistaCalandraInterfoliacion" element={<ProtectedRoute><CalandraInterfoliacionView /></ProtectedRoute>} />
              <Route path="/view/reporteCalandra" element={<ProtectedRoute><ReporteviewCalandra /></ProtectedRoute>} />
              <Route path="/view/vistaInter" element={<ProtectedRoute><ReporteviewInter /></ProtectedRoute>} />
              <Route path="/view/ordenProduccionView" element={<ProtectedRoute><OrdenProduccionView /></ProtectedRoute>} />
              <Route path="/view/numeroSerie" element={<ProtectedRoute><NumeroSerie /></ProtectedRoute>} />
              <Route path="/view/stockview" element={<ProtectedRoute><StockView/></ProtectedRoute>} />
              <Route path="/view/stockMonoliticoview" element={<ProtectedRoute><StockMonoliticoView/></ProtectedRoute>} />
              <Route path="/view/stockLaminadoview" element={<ProtectedRoute><StockLaminadoView/></ProtectedRoute>} />
              <Route path="/registro/reporteStock" element={<ProtectedRoute><ReporteStock /></ProtectedRoute>} />
              <Route path="/registro/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
              <Route path="/registro/reporteInterfoliacion" element={<ProtectedRoute><ReporteInterfoliacion /></ProtectedRoute>} />
              <Route path="/registro/ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} />              <Route path="/registro/ordenProduccion" element={<ProtectedRoute><OrdenProduccion /></ProtectedRoute>} />
              <Route path="/registro/proveedor" element={<ProtectedRoute><Proveedor /></ProtectedRoute>} />
              <Route path="/registro/pagos" element={<ProtectedRoute><Pagos/></ProtectedRoute>} />
              <Route path="/view/aguinaldoIps" element={<ProtectedRoute><AguinaldoIps/></ProtectedRoute>} />
              <Route path="/view/aguinaldoInterno" element={<ProtectedRoute><AguinaldoInterno/></ProtectedRoute>} />
              <Route path="/view/pagos" element={<ProtectedRoute><PagosView/></ProtectedRoute>} />
              <Route path="/lavadora" element={<ProtectedRoute><Lavadora/></ProtectedRoute>} />
              <Route path="/salaLimpia" element={<ProtectedRoute><SalaLimpia/></ProtectedRoute>} />
              <Route path="/calandraTrue" element={<ProtectedRoute><CalandraTrue/></ProtectedRoute>} />
              <Route path="/registro/pvb" element={<ProtectedRoute><PVB /></ProtectedRoute>} />
              <Route path="/registro/vehiculo" element={<ProtectedRoute><Vehiculo /></ProtectedRoute>} />
              <Route path="/registro/caballete" element={<ProtectedRoute><Caballete /></ProtectedRoute>} />
              <Route path="/registro/cliente" element={<ProtectedRoute><Cliente /></ProtectedRoute>} />
              <Route path="/registro/entradaNotaFiscal" element={<ProtectedRoute><EntradaNotaFiscal /></ProtectedRoute>} />
              <Route path="/registro/pvbNotaFiscal" element={<ProtectedRoute><PvbNotaFiscal /></ProtectedRoute>} />
              <Route path="/view/liberarStock" element={<ProtectedRoute><LiberarStock/></ProtectedRoute>} />
              <Route path="/view/notasFiscalesView" element={<ProtectedRoute><NotasFiscales/></ProtectedRoute>} />
              <Route path="/view/stockPvb" element={<ProtectedRoute><StockPVBView/></ProtectedRoute>} />
              <Route path="/view/rpInterBase64" element={<ProtectedRoute><AntiguoRp/></ProtectedRoute>} />
              <Route path="/view/translados" element={<ProtectedRoute><Translados/></ProtectedRoute>} />
              <Route path="/view/translados" element={<ProtectedRoute><Translados/></ProtectedRoute>} />
              <Route path="/registro/transladoChapas" element={<ProtectedRoute><TransladoChapas/></ProtectedRoute>} />
              {/* <Route path="/registro/quiebra" element={<ProtectedRoute><Quiebra /></ProtectedRoute>} /> */}
              <Route path="/registro/transferenciaEmpresas" element={<ProtectedRoute><Transferencia /></ProtectedRoute>} />
              <Route path="/registro/receta" element={<ProtectedRoute><Receta/></ProtectedRoute>} />
              <Route path="/registro/autoClave" element={<ProtectedRoute><AutoClave/></ProtectedRoute>} />
              <Route path="/registro/salidaAutoclave" element={<ProtectedRoute><SalidaAutoClave/></ProtectedRoute>} />
              <Route path="/view/quiebra" element={<ProtectedRoute><QuiebraV/></ProtectedRoute>} />
              <Route path="/registro/sala" element={<ProtectedRoute><SalaLimpiaT/></ProtectedRoute>} />
              <Route path="/view/sala" element={<ProtectedRoute><SalaLimpiaView/></ProtectedRoute>} />
              <Route path="/view/exportacionZd" element={<ProtectedRoute><ExportacionZD/></ProtectedRoute>} />
              <Route path="/view/exportacionA" element={<ProtectedRoute><ExportacionA/></ProtectedRoute>} />
              <Route path="/view/historial" element={<ProtectedRoute><Historial/></ProtectedRoute>} />
              <Route path="/view/liberarFinanciero" element={<ProtectedRoute><LiberarFinanciero/></ProtectedRoute>} />
              <Route path="/view/liberarCamiones" element={<ProtectedRoute><LiberarCamiones/></ProtectedRoute>} />
              <Route path="/view/cargamento" element={<ProtectedRoute><Cargamento/></ProtectedRoute>} />
              {/* <Route path="/registro/ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} /> */}
              <Route path="/registro/quiebra" element={<ProtectedRoute><DndProvider backend={HTML5Backend}><Quiebra/></DndProvider></ProtectedRoute>}/>
              <Route path="/registro/descarga" element={<ProtectedRoute><Descarga /></ProtectedRoute>} />
              <Route path="/registro/pedidoVenta" element={<ProtectedRoute><PedidoVenta /></ProtectedRoute>} />
              <Route path="/registro/precio" element={<ProtectedRoute><Precio/></ProtectedRoute>} />
              <Route path="/view/precio" element={<ProtectedRoute><PrecioView/></ProtectedRoute>} />
              <Route path="/view/exportacionVentana" element={<ProtectedRoute><ExportacionVentana/></ProtectedRoute>} />
              <Route path="/view/palitero" element={<ProtectedRoute><Palitero/></ProtectedRoute>} />
              <Route path="/view/reembalar" element={<ProtectedRoute><Reembalar/></ProtectedRoute>} />
              <Route path="/view/historialChapa" element={<ProtectedRoute><HistorialChapa/></ProtectedRoute>} />
              <Route path="/view/historialVentas" element={<ProtectedRoute><HistorialVentas/></ProtectedRoute>} />
              <Route path="/view/stockCaballete" element={<ProtectedRoute><StockCaballete/></ProtectedRoute>} />
              <Route path="/view/listaProducto" element={<ProtectedRoute><ListaProducto/></ProtectedRoute>} />
              <Route path="/view/stockCoinvertir" element={<ProtectedRoute><StockCoinvertir/></ProtectedRoute>} />


            </Routes>
          </main>
        </div>
        <ToastContainer />
      </ThemeProvider>
    </ColorModeContext.Provider>
    
  );
}

export default App;

