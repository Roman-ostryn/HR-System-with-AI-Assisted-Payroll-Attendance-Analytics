import React, { useState } from 'react'
import { tokens } from "../../../theme";
import {  MenuItem, SubMenu } from "react-pro-sidebar";
import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import FactoryIcon from '@mui/icons-material/Factory';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WarningIcon from '@mui/icons-material/Warning';
import InventoryIcon from '@mui/icons-material/Inventory';
import CastConnectedIcon from '@mui/icons-material/CastConnected';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';

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


const Laboratorio = () => {
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
                  title="Vidrio"
                  icon={<FactoryIcon />}
                  style={{ color: colors.grey[300] }}
                >

                <SubMenu
                  title="Almacenamiento"
                  icon={<PrecisionManufacturingIcon />}
                  style={{ color: colors.grey[300] }}
                >
                  <Item
                    title="Stock Monolitico"
                    to="/view/stockMonoliticoview"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Stock Laminado"
                    to="/view/stockLaminadoview"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Stock PVB"
                    to="/view/stockPvb"
                    icon={<CastConnectedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Stock Caballete"
                    to="/view/stockCaballete"
                    icon={<VerticalShadesClosedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
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
              </>
  )
}

export default Laboratorio
