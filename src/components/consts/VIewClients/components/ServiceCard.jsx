import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";

const ServiceImage = styled("img")(({ isSelected }) => ({
  width: "100px",
  height: "110px",
  borderRadius: "14px",
  border: isSelected ? "2px solid #8e24aa" : "2px solid #ddd",
  marginRight: "16px",
}));

const ServiceCard = ({ service, onAddToCart, isSelected }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    onAddToCart(service);
  };

  return (
    <>
      <Paper
        elevation={3}
        className="mb-4 p-4 shadow-md"
        onClick={handleClickOpen}
        sx={{
          borderRadius: "12px",
          border: isSelected ? "2px solid #8e24aa" : "2px solid #ddd",
          backgroundColor: isSelected ? "#f0eaff" : "#ffffff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-start",
          cursor: "pointer",
          height: "auto",
          width: "calc(100% - 195px)",
          margin: "0 auto 16px",
          position: "relative",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#f0f0f0",
            transform: "scale(1.02)",
          },
        }}
      >
        <ServiceImage
          src={`http://localhost:5000${service.ImgServicio}`}
          alt={service.Nombre_Servicio}
          isSelected={isSelected}
        />
        <Box>
          <Typography
            variant="subtitle1"
            component="h2"
            sx={{
              fontWeight: "700",
              color: "#333",
              fontSize: "1.2rem",
              marginBottom: "8px",
            }}
          >
            {service.Nombre_Servicio}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: "400",
              color: "#666",
              marginBottom: "8px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "560px", // Ajusta este valor según sea necesario
            }}
          >
            {service.Descripcion_Servicio}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#333",
              marginBottom: "8px",
            }}
          >
            {service.Tiempo_Servicio} minutos
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "700",
              color: "#0D0D0D",
              fontSize: "1.2rem",
            }}
          >
            ${service.Precio_Servicio}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleAddClick}
          sx={{
            position: "absolute",
            bottom: "60px",
            right: "16px",
            backgroundColor: isSelected ? "#8e24aa" : "#f0f0f0",
            color: isSelected ? "#ffffff" : "#0D0D0D",
            borderRadius: "26%",
            width: "30px",
            height: "29px",
            minWidth: "auto",
            padding: "0",
            "&:hover": {
              backgroundColor: isSelected ? "#7b1fa2" : "#A6A6A6",
            },
          }}
        >
          {isSelected ? (
            <CheckIcon fontSize="small" />
          ) : (
            <AddIcon fontSize="small" />
          )}
        </Button>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.6rem",
            color: "#333",
          }}
        >
          {service.Nombre_Servicio}
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center" }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "600",
              color: "#555",
              fontSize: "1.0rem",
              marginBottom: "6px",
            }}
          >
            {service.Tiempo_Servicio}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "700",
              color: "#0D0D0D",
              fontSize: "1.4rem",
              marginBottom: "10px",
            }}
          >
            ${service.Precio_Servicio}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#666", textAlign: "justify" }}
          >
            {service.Descripcion_Servicio}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            sx={{ margin: "0 auto", display: "block", borderRadius: '20px'}}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ServiceCard;
