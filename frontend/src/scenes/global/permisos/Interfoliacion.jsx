import React, { useState } from 'react'
import { tokens } from "../../../theme";
import {  MenuItem, SubMenu } from "react-pro-sidebar";
import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import FactoryIcon from '@mui/icons-material/Factory';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CastConnectedIcon from '@mui/icons-material/CastConnected';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import WarningIcon from '@mui/icons-material/Warning';
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


const Interfoliacion = () => {
  const [selected, setSelected] = useState("Dashboard");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
            <SubMenu
                  title="Interfoliacion"
                  icon={<FactoryIcon />}
                  style={{ color: colors.grey[300] }}
                >
                <SubMenu
                    title="Registros"
                    icon={<SummarizeIcon />}
                    style={{ color: colors.grey[300] }}
                  >
                      <Item
                      title="Registro Interfoliacion"
                      to="/registro/interfoliacion"
                      icon={<AutoStoriesIcon />}
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
                    </SubMenu>
                
              </>
  )
}

export default Interfoliacion
