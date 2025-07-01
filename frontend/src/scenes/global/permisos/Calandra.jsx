import React, { useState } from "react";
import { tokens } from "../../../theme";
import { MenuItem, SubMenu } from "react-pro-sidebar";
import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import FactoryIcon from "@mui/icons-material/Factory";
import WarningIcon from "@mui/icons-material/Warning";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import InventoryIcon from "@mui/icons-material/Inventory";
import TvIcon from "@mui/icons-material/Tv";
import CastConnectedIcon from "@mui/icons-material/CastConnected";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";


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

const Calandra = () => {
  const [selected, setSelected] = useState("Dashboard");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <Item
        title="Calandra"
        to="/calandraTrue"
        icon={<CastConnectedIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <SubMenu
        title="Calandra"
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
          title="Transferiencia Chapas"
          to="/registro/transladoChapas"
          icon={<MoveUpIcon />}
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
        <Item
          title="SalaLimpia->Calandra"
          to="/view/reporteCalandra"
          icon={<CastConnectedIcon />}
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
          <Item
            title="Numero de Serie"
            to="/view/numeroSerie"
            icon={<ReceiptOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
        </SubMenu>
      </SubMenu>
    </>
  );
};

export default Calandra;
