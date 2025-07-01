import React, { useState } from "react";
import { tokens } from "../../../theme";
import { MenuItem, SubMenu } from "react-pro-sidebar";
import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import FactoryIcon from "@mui/icons-material/Factory";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CastConnectedIcon from "@mui/icons-material/CastConnected";

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

const Lavadora = () => {
  const [selected, setSelected] = useState("Dashboard");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <Item
        title="Cargadora"
        to="/lavadora"
        icon={<CastConnectedIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      {/*Lavadora */}
      <SubMenu
        title="Lavadora"
        icon={<FactoryIcon />}
        style={{ color: colors.grey[300] }}
      >
        <SubMenu
          title="Produccion"
          icon={<SummarizeIcon />}
          style={{ color: colors.grey[300] }}
        ></SubMenu>
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
    </>
  );
};

export default Lavadora;
