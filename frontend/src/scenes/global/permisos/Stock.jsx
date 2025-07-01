import React, { useState } from "react";
import { tokens } from "../../../theme";
import { MenuItem, SubMenu } from "react-pro-sidebar";
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

const Stock = () => {
  const [selected, setSelected] = useState("Dashboard");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
<>
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
                              {/*Sala Limpia */}
                              <SubMenu
                                title="Sala Limpia"
                                icon={<FactoryIcon />}
                                style={{ color: colors.grey[300] }}
                              >
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
                                </SubMenu>
                              </SubMenu>
                              {/* AutoClave */}
              
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
                                </SubMenu>
              
                              </SubMenu>
                                {/* </SubMenu> */}
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
                                  </SubMenu>
                                  <SubMenu
                                    title="Historial"
                                    icon={<AssessmentIcon />}
                                    style={{ color: colors.grey[300] }}
                                  >
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
                  title="Stock"
                  icon={<FactoryIcon />}
                  style={{ color: colors.grey[300] }}
                >
                  <Item
                    title="Registro Calandra"
                    to="/registro/calandra"
                    icon={<PrecisionManufacturingIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  
                  <Item
                      title="Registro Producto"
                      to="/registro/productos"
                      icon={<InventoryIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Consulta Calandra"
                      to="/view/calandraRegistro"
                      icon={<TvIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
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
              </>
  )
}

export default Stock;
