import React, { useState } from "react";
import { Modal, Typography, TextField, Button, Grid } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LockIcon from "@mui/icons-material/Lock";

const ModalContrasena = ({ open, handleClose, handleSubmit }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(newPassword, confirmPassword);
    setNewPassword(""); // Vacía el estado de nueva contraseña
    setConfirmPassword("");
  };

  const handleChangeNewPassword = (e) => {
    const value = e.target.value;
    setNewPassword(value);
  };

  const handleChangeConfirmPassword = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            minWidth: "300px",
            maxWidth: "400px",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            style={{ textAlign: "center", marginBottom: "1.5rem" }}
          >
            <LockIcon
              fontSize="large"
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            />
            Cambiar Contraseña
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="newPassword"
                  name="newPassword"
                  label="Nueva Contraseña"
                  variant="outlined"
                  fullWidth
                  type="password"
                  value={newPassword}
                  onChange={handleChangeNewPassword}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  variant="outlined"
                  fullWidth
                  type="password"
                  value={confirmPassword}
                  onChange={handleChangeConfirmPassword}
                  required
                />
              </Grid>
            </Grid>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1.5rem",
              }}
            >
              <Button
                color="secondary"
                variant="contained"
                onClick={handleClose}
                style={{ width: "45%", marginRight: "10px" }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ width: "45%" }}
                startIcon={<SendIcon />}
              >
                Enviar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ModalContrasena;
