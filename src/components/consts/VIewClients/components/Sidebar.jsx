import React, { useState, useContext } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Importa el icono de calendario
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Importa el icono de reloj
import { UserContext } from "../../../../context/ContextoUsuario"; // Ajusta la ruta según sea necesario
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { motion } from "framer-motion"; // Importa framer-motion


// Define un tema personalizado con tipografía
const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
    h6: {
      fontSize: "16px",
      fontWeight: 600,
    },
    body2: {
      fontSize: "14px",
      fontWeight: 500,
    },
  },
});

const SelectedDayText = styled(Typography)({
  fontSize: "14px",
  fontWeight: 500,
  color: "#666",
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
});

const SelectedHourText = styled(Typography)({
  fontSize: "14px",
  fontWeight: 500,
  color: "#666",
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
});

const SidebarContainer = styled(Paper)({
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
  maxWidth: "440px",
  width: "100%",
  margin: "16px -10px",
  marginTop: "-55px",
  minHeight: "600px",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  border: "1px solid #0D0D0D",
});

const CartItem = styled(Box)(({ selected }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: "8px",
  padding: "8px",
  fontSize: selected ? "16px" : "14px",
  fontWeight: selected ? 700 : 400,
  color: selected ? "#000" : "#666",
}));

const ItemDetails = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

const ItemHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const NoServiceText = styled(Typography)({
  fontSize: "15px",
  fontWeight: 400,
  color: "#666",
  marginBottom: "10px",
  marginTop: "0px",
  marginLeft: "0px",
});

const TimeText = styled(Typography)({
  fontSize: "14px",
  fontWeight: 400,
  color: "#666",
  marginTop: "4px",
});

const ServiceText = styled(Typography)({
  fontSize: "15px",
  fontWeight: 800,
  color: "#0D0D0D",
  marginBottom: "4px",
  marginTop: "0px",
});

const PriceText = styled(Typography)({
  fontSize: "15px",
  fontWeight: 800,
  color: "#0D0D0D",
});

const CustomButton = styled(Button)(({ theme, disabled }) => ({
  backgroundColor: disabled ? "#b0b0b0" : "#000",
  color: disabled ? "#666" : "#fff",
  fontSize: "16px",
  padding: "12px 155px",
  borderRadius: "8px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: disabled ? "#b0b0b0" : "#333",
    color: disabled ? "#666" : "#f0f0f0",
  },
}));

const BusinessName = styled(Typography)({
  fontWeight: 700,
  fontSize: "18px",
  color: "#000",
  marginBottom: "8px",
});

const BusinessAddress = styled(Typography)({
  fontWeight: 600,
  fontSize: "14px",
  color: "#333",
  marginBottom: "16px",
});

const ImageContainer = styled(Box)({
  border: "1px solid #2626269",
  borderRadius: "8px",
  overflow: "hidden",
  marginBottom: "16px",
  width: "110px",
  height: "69px",
});

const WelcomeText = styled(Typography)({
  fontSize: "14px",
  fontWeight: 700,
  color: "#666",
  display: "flex",
  alignItems: "center",
  marginBottom: "-19px",
  marginTop: "-30px", // Añade margen superior para ajustar la posición
});

const Sidebar = ({
  business,
  cart,
  total,
  onCancel,
  onContinue,
  disabled,
  selectedEmployee,
  selectedDay,
  selectedHour,
}) => {
  const { user } = useContext(UserContext); // Obtén el usuario del contexto

  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const navigate = useNavigate();

  const handleContinueClick = () => {
    if (cart.length > 0) {
      onContinue();
    }
  };

  const handleImageClick = () => {
    navigate("/vistaInicio");
  };

  return (
    <ThemeProvider theme={theme}>
      <SidebarContainer elevation={3}>
        <Box flex={1}>
          <Box display="flex" alignItems="center" mb={3}>
            <ImageContainer>
              <img
                src={business.image}
                alt="Business Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={handleImageClick}
              />
            </ImageContainer>
            <Box ml={2}>
              <BusinessName variant="h9" component="h1">
                {business.name}
              </BusinessName>
              <BusinessAddress variant="body2" color="textSecondary">
                {business.address}
              </BusinessAddress>
            </Box>
          </Box>

          {user && (
            <WelcomeText variant="h6" component="h3">
              <PermIdentityIcon sx={{ mr: 1 }} />
              Tu: {user.nombre || user.Nombre}
            </WelcomeText>
          )}

          <Box mt={3}>
            {cart.length === 0 ? (
              <>
                <NoServiceText variant="body1" color="textSecondary">
                  No hay un servicio seleccionado
                </NoServiceText>
                <Box
                  sx={{
                    borderTop: "1px solid #ddd",
                    marginTop: "16px",
                    paddingTop: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" component="h3">
                    Total
                  </Typography>
                  <Typography variant="h6" component="h3">
                    Gratis
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    selected={item.id === selectedServiceId}
                    onClick={() => setSelectedServiceId(item.id)}
                  >
                    {selectedDay && (
                      <SelectedDayText
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 2 }}
                        transition={{ duration: 2.5 }}
                        variant="h6"
                        component="h3"
                      >
                        <CalendarTodayIcon sx={{ mr: 1 }} />
                        {dayjs(selectedDay).format("dddd D MMMM")}
                      </SelectedDayText>
                    )}
                    {selectedHour && (
                      <SelectedHourText
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        variant="h6"
                        component="h3"
                      >
                        <AccessTimeIcon sx={{ mr: 1 }} />
                        Hora seleccionada: {selectedHour}
                      </SelectedHourText>
                    )}

                    <ItemHeader>
                      <ServiceText variant="body2">
                        {item.Nombre_Servicio}
                      </ServiceText>
                      <PriceText variant="body2">
                        ${item.Precio_Servicio}
                      </PriceText>
                    </ItemHeader>
                    <ItemDetails>
                      <TimeText variant="body2">
                        {item.Tiempo_Servicio} con {selectedEmployee?.Nombre}{" "}
                        {selectedEmployee?.Apellido}
                      </TimeText>
                    </ItemDetails>
                  </CartItem>
                ))}
                <Box
                  sx={{
                    borderTop: "1px solid #ddd",
                    marginTop: "16px",
                    paddingTop: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" component="h3">
                    Total
                  </Typography>
                  <Typography variant="h6" component="h3">
                    ${total}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
        <Box mt={2} display="flex" flexDirection="column">
          <Box mt={1}>
            <CustomButton
              onClick={handleContinueClick}
              disabled={cart.length === 0}
            >
              Continuar
            </CustomButton>
          </Box>
        </Box>
      </SidebarContainer>
    </ThemeProvider>
  );
};

export default Sidebar;
