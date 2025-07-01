import { Box, Button, IconButton, Typography, useTheme, FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import LineChartPresion from "../../components/LineChartPresion";
import LineChartSalaLimpia from "../../components/LineChartSalaLimpia";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {getDatosAutoClave} from "../../services/autoClave.services";
import useNumeroSeleccionada from "../../customHooks/parseAutoClaveHook";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [recipes, setRecipes] = useState([]);
  // const [selectedRecipe, setSelectedRecipe] = useState("");
  // const [chartData, setChartData] = useState([]);
  const { numeroSeleccionada, setNumeroSeleccionada } = useNumeroSeleccionada();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDatosAutoClave();
        
        // Verificamos que response sea un array antes de asignarlo
        if (Array.isArray(response)) {
          setRecipes(response);
        } else {
          console.error("Los datos obtenidos no son un array:", response);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
  
    fetchData();
  }, []);

  
    useEffect(() => {
      if (numeroSeleccionada) {
        setNumeroSeleccionada(numeroSeleccionada);  // Pasar la fecha formateada al hook personalizado
      }
    }, [numeroSeleccionada]);
  

  // useEffect(() => {
  //   if (selectedRecipe) {
  //     const fetchData = async () => {
  //       try {
  //         const response = await getOneProceso(selectedRecipe);
  //       } catch (error) {
  //         console.error("Error al obtener los datos:", error);
  //       }
  //     };  
  //     fetchData();
  //   }
  // }, [selectedRecipe]);



  const generatePDF = () => {
    const chartElement = document.getElementById("lineChart");
  
    if (chartElement) {
  
      // Usar html2canvas para capturar el gráfico como imagen
      html2canvas(chartElement, { scale: 3 }).then((canvas) => { // Aumentar la escala para mejorar la resolución
        const imgData = canvas.toDataURL("image/png"); // Convertir el canvas a imagen en formato base64
        const pdf = new jsPDF('landscape', 'mm', 'a4'); // Cambiar la orientación a horizontal ('landscape')
  
        // Agregar la imagen al PDF
        pdf.addImage(imgData, "PNG", 10, 10, 280, 160); // Ajusta las dimensiones y posición según sea necesario
  
        // Guardar el PDF
        pdf.save("grafico_autoclave.pdf");
      }).catch((error) => {
        console.error("Error al capturar el gráfico:", error);
      });
    } else {
      console.error("No se pudo encontrar el gráfico con id='lineChart'");
    }
  };
  
  return (
    <Box m="20px" height="100vh" >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      <Box m="20px" height="95vh" sx={{ marginTop: "-1vh", overflowY: "auto", maxHeight: "84vh", '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb:hover': { backgroundColor: 'rgba(0, 0, 0, 0.4)' } }}>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="12,361"
            subtitle="Emails Sent"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="431,225"
            subtitle="Sales Obtained"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="32,441"
            subtitle="New Clients"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >

            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                AutoClave
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Temperatura
              </Typography>
            </Box>
            <Box mb={2} sx={{ display: "flex", padding: "0 0px" }}>
              <FormControl fullWidth sx={{ minWidth: 300 }}>
                <InputLabel id="recipe-select-label">Seleccionar Receta</InputLabel>
                <Select
                  labelId="recipe-select-label"
                  value={numeroSeleccionada}
                  onChange={(e) => setNumeroSeleccionada(e.target.value)}
                >
                  {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                      <MenuItem key={recipe.id} value={recipe.id}>
                        {recipe.id + " --- " + recipe.create_at} 
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No hay recetas disponibles</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
            <Box>
            <IconButton onClick={generatePDF}>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} selectedRecipe={numeroSeleccionada}/>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Monitoreo
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Sala Limpia
              </Typography>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChartSalaLimpia isDashboard={true}/>
          </Box>
          {/* {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))} */}
        </Box>


        {/* ROW 2.5 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                AutoClave
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Presion
              </Typography>
            </Box>
            <Box>
            <IconButton onClick={generatePDF}>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChartPresion isDashboard={true} selectedRecipe={numeroSeleccionada}/>
          </Box>
        </Box>
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        > */}
          {/* <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box> */}
          {/* {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              {/* <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box> */}
              {/* <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box> */}
            {/* </Box> */}
          {/* ))}  */}
        {/* </Box> */}

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
    </Box>
  );
};

export default Dashboard;
