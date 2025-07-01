import * as React from 'react';
import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCardIcon from '@mui/icons-material/AddCard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
// import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
import PersonalVideoOutlinedIcon from '@mui/icons-material/PersonalVideoOutlined';
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
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import CastConnectedIcon from '@mui/icons-material/CastConnected';
import RecursosHumanos from './permisos/RH';
import Adminis from './permisos/Admin';
import Lavadora from './permisos/Lavadora';
import SalaLimpia from './permisos/SalaLimpia';
import Interfoliacion from './permisos/Interfoliacion';
import Calandra from './permisos/Calandra';
import Stock from './permisos/Stock';
import Supervisor from './permisos/Supervisor';
import Mantenimiento from './permisos/Mantenimiento';
import RecursosHumanosA from './permisos/AuxRh';
import PuenteGrua from './permisos/PuenteGrua';
import Directivos from './permisos/Directivos';
import Laboratorio from './permisos/Laboratorio';





import ClearIcon from '@mui/icons-material/Clear';
import Contabilidad from './permisos/Contabilidad';

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
// img.src = "../../assets/zd.jpg";
const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [userLevel, setUserLevel] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const level = localStorage.getItem('userLevel');
    const user = localStorage.getItem('user');
    if (level) {
      setUserLevel(parseInt(level));
    }
    if (user) {
      setUser(user.toUpperCase());
    }
  }, []);

  const logoSrc = theme.palette.mode === "dark" ? "../../assets/dracenaS.png" : "../../assets/dracenaC.png";

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          borderRight: "1px solid rgb(61, 66, 84)"
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          fontSize:"16px",
          borderLeft: "5px solid rgb(206, 220, 0)",
          color: `${colors.primary[100]} !important`,
        },
        "& .pro-menu-item.active": {
          color: `${colors.primary[100]} !important`,
          fontSize:"16px",
          background: `${colors.primary[450]} !important`,
          
          // background: "rgb(61 66 85)",
          borderLeft: "5px solid rgb(206, 220, 0)"

        },
        "& .css-17w9904-MuiTypography-root ": {
          fontSize:"16px",
        },

        " & .css-1musjwt .pro-inner-item": {
          padding: "0 !important",
        },
        "& .pro-sidebar .pro-menu .pro-menu-item.pro-sub-menu .pro-inner-list-item .pro-inner-item":
          {
            padding: "8px 30px 8px 5px !important",
          },
      }}
    >
      
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[300],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[300]}>
                  <IconButton sx={{ marginTop: "-5%" }}>
                    <img
                      src="../../assets/boton.png"
                      alt=""
                      style={{
                        width: "20px",
                      }}
                    />
                  </IconButton>
                  {user}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="5px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="250px"
                  height="90px"
                  src={logoSrc}
                  style={{ cursor: "pointer", borderRadius: "0%" }}
                />
              </Box>
              <Box textAlign="center"></Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "1%"}>

  {/* ADMIN */}
            {userLevel === 1 && (
              <>
              <Adminis selected={selected} setSelected={setSelected}/>

              </>
            )}

            {userLevel === 2 && (
              <>
                   <Supervisor selected={selected} setSelected={setSelected}/>
              </>
            )}

{/* Contabilidad */}
            {userLevel === 13 && (
              <Contabilidad selected={selected} setSelected={setSelected}/>
            )}
          
 {/* Rh */}
            {userLevel === 4 && (
              <RecursosHumanos selected={selected} setSelected={setSelected}/>
            )}

            
 {/* calandra */}
            {userLevel === 5 && (
              <>
              <Calandra selected={selected} setSelected={setSelected}/>
              </>
            )}

 {/* Stock */}
 {userLevel === 6 && (
              <>
              <Stock selected={selected} setSelected={setSelected}/>
              </>
            )}


          {/* Lavadora */}
          {userLevel === 7 && (
              <>
                <Lavadora selected={selected} setSelected={setSelected}/>
              </>
            )}

              {/* SalaLimpia */}
          {userLevel === 8 && (
              <>
                <SalaLimpia selected={selected} setSelected={setSelected}/>
              </>
            )}

            {/* Interfoliacion */}
          {userLevel === 9 && (
              <>
              <Interfoliacion selected={selected} setSelected={setSelected}/> 
              </>
            )}

          {userLevel === 10 && (
              <>
              <Mantenimiento selected={selected} setSelected={setSelected}/> 
              </>
            )}

          {userLevel === 11 && (
              <>
              <RecursosHumanosA selected={selected} setSelected={setSelected}/> 
              </>
            )}

          {userLevel === 12 && (
              <>
              <PuenteGrua selected={selected} setSelected={setSelected}/> 
              </>
            )}
            
            {userLevel === 14 && (
              <>
              <Laboratorio selected={selected} setSelected={setSelected}/> 
              </>
            )}

            
                      {/* Directivos */}
                      {userLevel === 15 && (
              <>
                <Directivos selected={selected} setSelected={setSelected}/>
              </>
            )}
            
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
