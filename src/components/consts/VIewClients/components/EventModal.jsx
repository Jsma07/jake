import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const EventModal = ({ open, handleClose, event }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2, textAlign: "center" }}>
          {event.title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="body1">
            <strong>Servicio:</strong> {event.extendedProps.servicio}
          </Typography>
          <Typography variant="body1">
            <strong>Hora:</strong> {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Empleado:</strong> {event.extendedProps.empleado}
        </Typography>
        <Box
          sx={{
            mt: 2,
            textAlign: "center",
          }}
        >
          <img
            src={event.extendedProps.imgServicio}
            alt={event.extendedProps.servicio}
            style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }}
          />
        </Box>
        <Button
          onClick={handleClose}
          sx={{ mt: 3, display: "block", width: "100%" }}
          variant="contained"
          color="primary"
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default EventModal;
