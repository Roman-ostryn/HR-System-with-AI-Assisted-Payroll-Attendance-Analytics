import React, { useState } from 'react'
import { tokens } from "../../../theme";
import {  MenuItem, SubMenu } from "react-pro-sidebar";
import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import AddchartIcon from '@mui/icons-material/Addchart';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCardIcon from '@mui/icons-material/AddCard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Diversity1Icon from '@mui/icons-material/Diversity1';

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


const RecursosHumanosA = () => {
  const [selected, setSelected] = useState("Dashboard");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
                <SubMenu
                  title="Recursos Humanos"
                  icon={<Diversity1Icon />}
                  style={{ color: colors.grey[300] }}
                >
                  <SubMenu
                    title="Consultas"
                    icon={<ReceiptOutlinedIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                    <Item
                      title="Usuarios"
                      to="/view/usuarios"
                      icon={<PersonAddIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  <SubMenu
                  title="Relatorios"
                  icon={<DescriptionIcon />}
                  style={{ color: colors.grey[300] }}
                >
                
                  <Item
                    title="Historial de Marcaciones"
                    to="/lista/marcaciones"
                    icon={<DescriptionIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  
                </SubMenu>
                </SubMenu>            
              </>
  )
}

export default RecursosHumanosA
