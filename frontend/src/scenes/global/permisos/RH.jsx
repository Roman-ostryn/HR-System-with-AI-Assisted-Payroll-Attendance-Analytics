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


const RecursosHumanos = () => {
  const [selected, setSelected] = useState("Dashboard");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
                {/* Pantallas */}
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
                    title="Registro Adelanto"
                    to="/registro/adelanto"
                    icon={<MoneyOffIcon />}
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
              </>
  )
}

export default RecursosHumanos
