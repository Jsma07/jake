import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  FormControl,
  FormControlLabel,
  Box,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Flag from "react-flagkit";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import { Box } from "@mui/system";
import { useDropzone } from "react-dropzone";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { toast } from "react-toastify";

const ModalDinamico = ({
  open,
  handleClose,
  title = "",
  fields,
  onSubmit,
  seleccionado,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (seleccionado) {
      setFormData(seleccionado);
      setAvatar(seleccionado.avatar || null);
      setAvatarFile(seleccionado.avatarFile || null);
    } else {
      setFormData({});
      setAvatar(null);
      setAvatarFile(null);
    }
  }, [seleccionado]);

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    // Validaciones por campo
    if (!/^[0-9]{10,15}$/.test(formData.Documento || "")) {
      newErrors.Documento = "El documento debe contener entre 10 y 15 números.";
      isValid = false;
    }

    if (!/^[0-9]{7,15}$/.test(formData.Telefono || "")) {
      newErrors.Telefono = "El teléfono debe contener entre 7 y 15 números.";
      isValid = false;
    }

    if (!/^[a-zA-ZñÑ\s]*$/.test(formData.Nombre || "")) {
      newErrors.Nombre = "El nombre solo puede contener letras y la letra ñ.";
      isValid = false;
    }

    if (!/^[a-zA-ZñÑ\s]*$/.test(formData.Apellido || "")) {
      newErrors.Apellido =
        "El apellido solo puede contener letras y la letra ñ.";
      isValid = false;
    }

    const validacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validacionCorreo.test(formData.Correo || "")) {
      newErrors.Correo = "Ingrese un correo electrónico válido.";
      isValid = false;
    }

    if (
      fields.some((field) => field.name === "Contrasena") &&
      formData.Contrasena
    ) {
      const validacionContrasena = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!validacionContrasena.test(formData.Contrasena)) {
        newErrors.Contrasena =
          "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula y un número.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    console.log("Form Valid:", isValid);
    console.log("Form Data:", formData);
    console.log("Errors:", errors);

    if (isValid) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      BackdropProps={{
        style: {
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          width: "70%",
          maxWidth: "40rem",
          maxHeight: "80%",
          overflow: "auto",
          padding: "1.5rem",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          {title}
        </Typography>
        <Grid container spacing={2}>
          {fields &&
            fields.length > 0 &&
            fields.map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                {field.type === "text" && (
                  <TextField
                    id={field.name}
                    name={field.name}
                    label={field.label}
                    variant="outlined"
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    type="text"
                    style={{ marginBottom: "0.5rem" }}
                    value={formData[field.name] || ""}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                  />
                )}
                {field.type === "password" && (
                  <TextField
                    id={field.name}
                    name={field.name}
                    label={field.label}
                    variant="outlined"
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    type="password"
                    style={{ marginBottom: "0.5rem" }}
                    value={formData[field.name] || ""}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                  />
                )}
                {field.type === "select" && (
                  <Box>
                    <InputLabel id={`${field.name}-label`}>
                      {field.label}
                    </InputLabel>
                    <Select
                      labelId={`${field.name}-label`}
                      id={field.name}
                      name={field.name}
                      variant="outlined"
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      value={formData[field.name] || ""}
                      label={field.label}
                      style={{ marginBottom: "0.5rem" }}
                    >
                      {field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors[field.name] && (
                      <Typography color="error" variant="body2">
                        {errors[field.name]}
                      </Typography>
                    )}
                  </Box>
                )}
                {field.type === "switch" && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData[field.name] || false}
                        onChange={handleChange}
                        name={field.name}
                        color="primary"
                      />
                    }
                    label={field.label}
                    style={{ marginBottom: "0.5rem" }}
                  />
                )}
              </Grid>
            ))}
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Button
            onClick={handleCancel}
            color="secondary"
            variant="contained"
            style={{ marginRight: "1rem" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            endIcon={<SendIcon />}
          >
            Enviar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDinamico;
