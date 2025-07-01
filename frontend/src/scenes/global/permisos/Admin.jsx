import React, { useState } from 'react'
import { tokens } from "../../../theme";
import {  MenuItem, SubMenu } from "react-pro-sidebar";
import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCardIcon from '@mui/icons-material/AddCard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AddchartIcon from '@mui/icons-material/Addchart';
import FactoryIcon from '@mui/icons-material/Factory';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SummarizeIcon from '@mui/icons-material/Summarize';
import WarningIcon from '@mui/icons-material/Warning';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import TvIcon from '@mui/icons-material/Tv';
import InventoryIcon from '@mui/icons-material/Inventory';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import CastConnectedIcon from '@mui/icons-material/CastConnected';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import VerticalShadesClosedIcon from '@mui/icons-material/VerticalShadesClosed';
import EditIcon from '@mui/icons-material/Edit';


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};


const Adminis = () => {
  const [selected, setSelected] = useState("Dashboard");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
              
                <Item
                  title="Dashboard"
                  to="/dashboard"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <SubMenu
                  title="Recursos Humanos"
                  icon={<Diversity1Icon />}
                  style={{ color: colors.grey[300] }}
                >
                  {/* Consultas */}
                  <SubMenu
                    title="Consultas"
                    icon={<ReceiptOutlinedIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                      title="Grupos"
                      to="/view/grupos"
                      icon={<Diversity3Icon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Horarios"
                      to="/view/horarios"
                      icon={<AccessTimeIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Salarios"
                      to="/view/salarios"
                      icon={<AddCardIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Usuarios"
                      to="/view/usuarios"
                      icon={<PersonAddIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Horas Extras"
                      to="/view/horasExtras"
                      icon={<AccessTimeIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                     <Item
                      title="Pagos"
                      to="/view/pagos"
                      icon={<MonetizationOnIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  {/* Relatorios */}
                  <SubMenu
                    title="Relatorios"
                    icon={<DescriptionIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                      title="Resumen Funcionarios"
                      to="/resumen"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Historial de Marcaciones"
                      to="/lista/marcaciones"
                      icon={<DescriptionIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Historial de Descuentos"
                      to="/view/descuento"
                      icon={<DescriptionIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                     <Item
                      title="Aguinaldo Externo"
                      to="/view/aguinaldoIps"
                      icon={<DescriptionIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                     <Item
                      title="Aguinaldo Interno"
                      to="/view/aguinaldoInterno"
                      icon={<DescriptionIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Resumen Plus"
                      to="/view/plusView"
                      icon={<DescriptionIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Relatorio Plus"
                      to="/view/metasView"
                      icon={<DescriptionIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  {/* Registros */}
                  <SubMenu
                    title="Registros"
                    icon={<PersonAddIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                      title="Registro Grupos"
                      to="/registro/grupos"
                      icon={<Diversity3Icon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registro Usuario"
                      to="/form"
                      icon={<PersonAddIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registro Salarios"
                      to="/registro/salarios"
                      icon={<AddCardIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registro Horarios"
                      to="/registro/horarios"
                      icon={<AccessTimeIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registro Descuentos"
                      to="/registro/descuento"
                      icon={<MoneyOffIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registro Horas Extras"
                      to="/registro/horasExtras"
                      icon={<AccessTimeIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registro Metas"
                      to="/registro/metas"
                      icon={<AddchartIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registro Pagos"
                      to="/registro/pagos"
                      icon={<AddchartIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                </SubMenu>
                <SubMenu
                  title="Vidrio"
                  icon={<FactoryIcon />}
                  style={{ color: colors.grey[300] }}
                >
                  <SubMenu
                    title="Registro"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <SubMenu
                      title="Productos"
                      icon={<FactoryIcon />}
                      style={{ color: colors.grey[300] }}
                    >
                      <Item
                        title="Registro Producto"
                        to="/registro/productos"
                        icon={<InventoryIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Consumo"
                        to=""
                        icon={<InventoryIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="PVB"
                        to="/registro/pvb"
                        icon={<ReceiptOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                    <Item
                      title="Registro Usuario"
                      to="/form"
                      icon={<PersonAddIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registro Cliente"
                      to="/registro/cliente"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registro Proveedor"
                      to="/registro/proveedor"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registro Vehiculo"
                      to="/registro/vehiculo"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registro Caballete"
                      to="/registro/caballete"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    {/* <Item
                      title="Lista de Precios"
                      to="/view/precio"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    /> */}
                    <Item
                    title="Precio"
                    to="/registro/precio"
                    icon={<MonetizationOnIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  </SubMenu>
                {/*Compra */}
                <SubMenu
                  title="Compra"
                  icon={<FactoryIcon />}
                  style={{ color: colors.grey[300] }}
                >
                  <Item
                    title="Entrada Nota Fiscal Vidrio"
                    to="/registro/entradaNotaFiscal"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Entrada Nota Fiscal PVB"
                    to="/registro/pvbNotaFiscal"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Notas Fiscales"
                    to="/view/notasFiscalesView"
                    icon={<LocalShippingIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="En Transito"
                    to="/view/liberarStock"
                    icon={<LocalShippingIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  
                </SubMenu>  
                {/*Venta */}
                <SubMenu
                  title="Venta"
                  icon={<FactoryIcon />}
                  style={{ color: colors.grey[300] }}
                >
                  
                  <Item
                    title="Pedido de venta"
                    to="/registro/pedidoVenta"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  
                  {/* <Item
                    title="Entrada Nota Fiscal PVB"
                    to="/registro/pvbNotaFiscal"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                   */}
                  
                  <Item
                    title="Liberar Financiero"
                    to="/view/liberarFinanciero"
                    icon={<LocalShippingIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Liberar Camiones"
                    to="/view/liberarCamiones"
                    icon={<LocalShippingIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Cargamento"
                    to="/view/cargamento"
                    icon={<LocalShippingIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Historial de Ventas"
                    to="/view/historialVentas"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>  

                <SubMenu
                  title="Almacenamiento"
                  icon={<PrecisionManufacturingIcon />}
                  style={{ color: colors.grey[300] }}
                >
                  <SubMenu
                    title="Movimientos"
                    icon={<PrecisionManufacturingIcon />}
                    style={{ color: colors.grey[300] }}
                    >
                      <Item
                        title="Translado"
                        to="/registro/descarga"
                        icon={<MoveUpIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Transferiencia Chapas"
                        to="/registro/transladoChapas"
                        icon={<MoveUpIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Transferencia de Empresa"
                        to="/registro/transferenciaEmpresas"
                        icon={<ReceiptOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Historial de Translados"
                        to="/view/translados"
                        icon={<AccessTimeIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                  
                   <SubMenu
                    title="Stock"
                    icon={<ReceiptOutlinedIcon />}
                    style={{ color: colors.grey[300] }}
                    >
                      <Item
                        title="Monolitico"
                        to="/view/stockMonoliticoview"
                        icon={<ReceiptOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Laminado"
                        to="/view/stockLaminadoview"
                        icon={<ReceiptOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Vetropar"
                        to="/view/stockCoinvertir"
                        icon={<ReceiptOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="PVB"
                        to="/view/stockPvb"
                        icon={<CastConnectedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Caballete"
                        to="/view/stockCaballete"
                        icon={<VerticalShadesClosedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                  
                  <Item
                    title="Lista de Productos"
                    to="/view/listaProducto"
                    icon={<InventoryIcon/>}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </SubMenu>
                
                {/*Produccion */}
                <SubMenu
                  title="Produccion"
                  icon={<FactoryIcon />}
                  style={{ color: colors.grey[300] }}
                >
                  <SubMenu
                    title="Consultas"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                      title="Orden de Produccion"
                      to="/view/ordenProduccionView"
                      icon={<AccessTimeIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Numero de Serie"
                      to="/view/numeroSerie"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    {/* <Item
                      title="Test"
                      to="/view/premiumView"
                      icon={<AccessTimeIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    /> */}
                  </SubMenu>
                  <SubMenu
                    title="Registros"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                      title="Entrada Nota Fiscal"
                      to="/registro/entraNotaFiscal"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Orden Produccion"
                      to="/registro/ordenProduccion"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    
                  </SubMenu>
                    {/*Quiebra */}
                    <SubMenu
                    title="Quiebra"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                     <SubMenu
                    title="Consultas"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                    title="Quiebres"
                    to="/view/quiebra"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  </SubMenu>
                     <SubMenu
                    title="Registros"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                     <Item
                    title="Quiebra"
                    to="/registro/quiebra"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  </SubMenu>
                  </SubMenu>
                  </SubMenu>
                

                {/*Linea de Produccion */}
                <SubMenu
                  title="Linea de Produccion"
                  icon={<FactoryIcon />}
                  style={{ color: colors.grey[300] }}
                >
                {/*Lavadora */}
                <SubMenu
                  title="Lavadora"
                  icon={<FactoryIcon />}
                  style={{ color: colors.grey[300] }}
                >
                  <SubMenu
                      title="Reporte"
                      icon={<SummarizeIcon />}
                      style={{ color: colors.grey[300] }}
                    >
                      <Item
                        title="ReporteLavadora"
                        to="/registro/reporteLavadora"
                        icon={<ReceiptOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                  </SubMenu>
                  {/* <SubMenu
                    title="Defectos"
                    icon={<WarningIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    
                  </SubMenu> */}
                </SubMenu>
                {/*Sala Limpia */}
                <SubMenu
                  title="Sala Limpia"
                  icon={<FactoryIcon />}
                  style={{ color: colors.grey[300] }}
                >
                  <SubMenu
                    title="Reporte"
                    icon={<SummarizeIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                   <Item
                      title="Reporte Sala Limpia"
                      to="/registro/reporteSalaLimpia"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Reporte Ambiente"
                      to="/registro/sala"
                      icon={<EnergySavingsLeafIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  <SubMenu
                    title="Consultas"
                    icon={<ChecklistRtlIcon/>}
                    style={{ color: colors.grey[300] }}
                  >
                   <Item
                    title="Ambiente"
                    to="/view/sala"
                    icon={<InvertColorsIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  </SubMenu>
                  <SubMenu
                    title="Defectos"
                    icon={<WarningIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                   <Item
                    title="Lavadora->SalaLimpia"
                    to="/view/vistaLavadoraCalandra"
                    icon={<CastConnectedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  </SubMenu>
                </SubMenu>
                {/* Calandra */}
                
                <SubMenu
                  title="Calandra"
                  icon={<FactoryIcon />}
                  style={{ color: colors.grey[300] }}
                >
                  <SubMenu
                    title="Consultas"
                    icon={<ReceiptOutlinedIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                      title="Consulta Calandra"
                      to="/view/calandraRegistro"
                      icon={<TvIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />

                    <Item
                      title="SalaLimpia->Calandra"
                      to="/view/reporteCalandra"
                      icon={<CastConnectedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  <SubMenu
                    title="Registros"
                    icon={<SummarizeIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                      title="Registro Calandra"
                      to="/registro/calandra"
                      icon={<PrecisionManufacturingIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    
                    </SubMenu>
                    <SubMenu
                      title="Reportar Problemas"
                      icon={<WarningIcon />}
                      style={{ color: colors.grey[300] }}
                    >
                      
                      <Item
                        title="Reportar Calandra"
                        to="/registro/reporteCalandra"
                        icon={<PrecisionManufacturingIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                  
                  </SubMenu>

                  <SubMenu
                    title="AutoClave"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                      title="Historial"
                      to="/view/historial"
                      icon={<AccessTimeIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registro Recetas"
                      to="/registro/receta"
                      icon={<PrecisionManufacturingIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registrar Entrada"
                      to="/registro/autoClave"
                      icon={<PrecisionManufacturingIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Salida AutoClave"
                      to="/registro/salidaAutoclave"
                      icon={<PrecisionManufacturingIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Interfoliacion"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                      title="Registro Interfoliacion"
                      to="/registro/interfoliacion"
                      icon={<PrecisionManufacturingIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Reporte Interfoliacion"
                      to="/registro/reporteInterfoliacion"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <SubMenu
                      title="Defectos"
                      icon={<WarningIcon />}
                      style={{ color: colors.grey[300] }}
                    >
                      <Item
                        title="Calandra->Interfoliacion"
                        to="/view/vistaCalandraInterfoliacion"
                        icon={<CastConnectedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Reporte Interfoliacion"
                        to="/view/vistaInter"
                        icon={<CastConnectedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      
                    </SubMenu>
                  </SubMenu>
                  <SubMenu
                    title="Stock"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >      
                    <Item
                      title="Stock"
                      to="/view/stockview"
                      icon={<Diversity3Icon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  {/*Descarga */}
                    <SubMenu
                      title="Descarga"
                      icon={<FactoryIcon />}
                      style={{ color: colors.grey[300] }}
                    >
                      <SubMenu
                        title="Reporte"
                        icon={<SummarizeIcon />}
                        style={{ color: colors.grey[300] }}
                      >
                        <Item
                          title="Reporte Descarga"
                          to="/registro/reporteStock"
                          icon={<ReceiptOutlinedIcon />}
                          selected={selected}
                          setSelected={setSelected}
                        />
                        <Item
                          title="STOCK"
                          to="/view/vistaStock"
                          icon={<Diversity3Icon />}
                          selected={selected}
                          setSelected={setSelected}
                        />
                      </SubMenu>
                      
                    </SubMenu>
                
                     {/* <Item
                      title="Aprovechamiento"
                      to="/registro/aprovechamiento"
                      icon={<ImageSearchIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    /> */}
                  </SubMenu>
                  <SubMenu
                    title="Expedicion"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                      title="Venta"
                      to="/view/venta"
                      icon={<Diversity3Icon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <SubMenu
                      title="Informes"
                      icon={<FactoryIcon />}
                      style={{ color: colors.grey[300] }}
                    >
                      <Item
                        title="Produccion Calandra"
                        to="/graficos"
                        icon={<DonutLargeIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                     
                      <Item
                        title="Evento Stock"
                        to="/view/vistaStock"
                        icon={<Diversity3Icon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Eventos Cargadora"
                        to="/view/vistaLavadoraCalandra"
                        icon={<CastConnectedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Eventos Sala Limpia"
                        to="/view/reporteCalandra"
                        icon={<CastConnectedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Eventos Calandra"
                        to="/view/vistaCalandraInterfoliacion"
                        icon={<CastConnectedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Eventos Interfoliacion"
                        to="/view/vistaInter"
                        icon={<CastConnectedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Productos Laminados(falta)"
                        to="/graficos"
                        icon={<DonutLargeIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                  
                  </SubMenu>
                </SubMenu>
                  {/* </SubMenu> */}
                  <SubMenu
                    title="Pantallas"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >

                    <Item
                      title="Cargadora"
                      to="/lavadora"
                      icon={<CastConnectedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Sala Limpia"
                      to="/salalimpia"
                      icon={<CastConnectedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Calandra"
                      to="/calandraTrue"
                      icon={<CastConnectedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    </SubMenu>
                    <SubMenu
                      title="Palitero"
                      icon={<VerticalShadesClosedIcon />}
                      style={{ color: colors.grey[300] }}
                    >
                      <Item
                        title="Palitero"
                        to="/view/palitero"
                        icon={<VerticalShadesClosedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Reembalar"
                        to="/view/reembalar"
                        icon={<EditIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                    <SubMenu
                      title="Graficos"
                      icon={<AssessmentIcon />}
                      style={{ color: colors.grey[300] }}
                    >
                      <Item
                        title="Graficos Produccion"
                        to="/graficos"
                        icon={<DonutLargeIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                       <Item
                        title="Historial Chapa"
                        to="/view/historialChapa"
                        icon={<InventoryIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                    
                </SubMenu>
                <SubMenu
                      title="Contabilidad"
                      icon={<PointOfSaleIcon />}
                      style={{ color: colors.grey[300] }}
                    >
                      <Item
                        title="Exportacion ZD"
                        to="/view/exportacionZd"
                        icon={<LocalShippingIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Exportacion Argentina"
                        to="/view/exportacionA"
                        icon={<LocalShippingIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                       <Item
                        title="Exportacion Ventana"
                        to="/view/exportacionVentana"
                        icon={<LocalShippingIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
              </>
  )
}

export default Adminis
