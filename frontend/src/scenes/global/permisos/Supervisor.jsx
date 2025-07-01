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
import InvertColorsIcon from '@mui/icons-material/InvertColors';

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


const Supervisor = () => {
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
                  {/* <SubMenu
                    title="Registros"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                      title="Orden Produccion"
                      to="/registro/ordenProduccion"
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
                  </SubMenu> */}
                  </SubMenu>
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
                {/*Lavadora */}
                {/* <SubMenu
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

                  </SubMenu> */}
                  {/* <SubMenu
                    title="Defectos"
                    icon={<WarningIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                   
                  </SubMenu> */}
                {/* </SubMenu> */}
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
                  </SubMenu>
                  <SubMenu
                    title="Defectos"
                    icon={<WarningIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                    title="Ambiente"
                    to="/view/sala"
                    icon={<InvertColorsIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
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
                      {/* <Item
                      title="Consulta Calandra"
                      to="/view/calandraRegistro"
                      icon={<TvIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    /> */}

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
                    {/* <Item
                      title="Registro Calandra"
                      to="/registro/calandra"
                      icon={<PrecisionManufacturingIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    /> */}
                    <Item
                      title="Registro Producto"
                      to="/registro/productos"
                      icon={<InventoryIcon />}
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
                    {/* <Item
                    title="Registro Calandra"
                    to="/prod"
                    icon={<PrecisionManufacturingIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  /> */}
                  </SubMenu>
                </SubMenu>
                
                  <SubMenu
                    title="Interfoliacion"
                    icon={<FactoryIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                   {/* <Item
                      title="Registro Interfoliacion"
                      to="/registro/interfoliacion"
                      icon={<PrecisionManufacturingIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    /> */}
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
                  {/* <SubMenu
                  title="Stock"
                  icon={<FactoryIcon />}
                  style={{ color: colors.grey[300] }}
                >
                  <Item
                      title="Stock"
                      to="/registro/stock"
                      icon={<LocalShippingRoundedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    /> */}
                     {/* <Item
                      title="Aprovechamiento"
                      to="/registro/aprovechamiento"
                      icon={<ImageSearchIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    /> */}
                  {/* </SubMenu> */}
                {/* </SubMenu> */}
              </>
  )
}

export default Supervisor
