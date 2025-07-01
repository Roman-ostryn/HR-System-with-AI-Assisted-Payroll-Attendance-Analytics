import React, { useState } from "react";
import { tokens } from "../../../theme";
import { MenuItem, SubMenu } from "react-pro-sidebar";
import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FactoryIcon from '@mui/icons-material/Factory';


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

const PuenteGrua = () => {
  const [selected, setSelected] = useState("Dashboard");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
        <SubMenu
          title="Movimientos"
          icon={<PrecisionManufacturingIcon />}
          style={{ color: colors.grey[300] }}
        >
          <Item
            title="Translado"
            to="/registro/descarga"
            icon={<MoveUpIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Transferencia de Empresa"
            to="/registro/transferenciaEmpresas"
            icon={<ReceiptOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
        </SubMenu>

        <Item
          title="Cargamento"
          to="/view/cargamento"
          icon={<LocalShippingIcon />}
          selected={selected}
          setSelected={setSelected}
        />
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
                    <Item
                      title="Registro Recetas"
                      to="/registro/receta"
                      icon={<PrecisionManufacturingIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Registrar Entrada"
                      to="/registro/autoClave"
                      icon={<PrecisionManufacturingIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Salida AutoClave"
                      to="/registro/salidaAutoclave"
                      icon={<PrecisionManufacturingIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
    </>
  );
};

export default PuenteGrua;