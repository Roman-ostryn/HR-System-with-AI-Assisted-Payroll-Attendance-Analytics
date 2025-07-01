import React, { useState } from "react";
import { tokens } from "../../../theme";
import { MenuItem, SubMenu } from "react-pro-sidebar";
import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import FactoryIcon from "@mui/icons-material/Factory";
import SummarizeIcon from "@mui/icons-material/Summarize";
import WarningIcon from "@mui/icons-material/Warning";
import CastConnectedIcon from "@mui/icons-material/CastConnected";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import InvertColorsIcon from "@mui/icons-material/InvertColors";

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

const SalaLimpia = () => {
  const [selected, setSelected] = useState("Dashboard");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <Item
        title="Sala Limpia"
        to="/salalimpia"
        icon={<CastConnectedIcon />}
        selected={selected}
        setSelected={setSelected}
      />
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
    </>
  );
};

export default SalaLimpia;
