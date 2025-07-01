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


const Contabilidad = () => {
  const [selected, setSelected] = useState("Dashboard");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>

                <SubMenu
                      title="Contabilidad"
                      icon={<PointOfSaleIcon />}
                      style={{ color: colors.grey[300] }}
                    >
                      <Item
                        title="Exportacion ZD"
                        to="/view/exportacionZd"
                        icon={<LocalShippingIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Exportacion Argentina"
                        to="/view/exportacionA"
                        icon={<LocalShippingIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                     {/* <Item
                        title="Exportacion Ventana"
                        to="/view/exportacionVentana"
                        icon={<LocalShippingIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      /> */}
                    </SubMenu>
              </>
  )
}

export default Contabilidad
