import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import ProduccionPie from "../../components/ProduccionPie";

const Pie = () => {
  return (
    <Box m="20px">
      <Header
        title="Producción del Día"
        subtitle="Clasificación de Laminados"
      />

      <Box
        m="10px"
        sx={{
          display: "flex",
          justifyContent: "space-evenly", // Espaciado igual entre los gráficos
          alignItems: "center", // Alineación vertical centrada
          height: "100%",
          width: "100%",
          margin:"0",
          boxSizing:"border-box",

        }}
      >
        <Box height="45vh" width="45%"> {/* Ajusta el ancho para que ambos gráficos ocupen el 45% */}
          <PieChart />
        </Box>
        <Box height="45vh" width="45%">
          <ProduccionPie />
        </Box>
      </Box>
    </Box>
  );
};

export default Pie;