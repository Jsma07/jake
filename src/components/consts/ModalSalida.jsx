import React, { useState } from "react";
import {
  Modal,
  Typography,
  Button,
  Grid,
  Box,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Swal from "sweetalert2";

const ModalInsumos = ({
  open,
  handleClose,
  title,
  carrito,
  actualizarCarrito,
}) => {
  const [descripcion, setDescripcion] = useState(""); // Estado para la descripción

  const handleCantidadChange = (index, event) => {
    const newCantidad = parseInt(event.target.value, 10) || 1;
    const newCarrito = [...carrito];
    newCarrito[index].cantidad = newCantidad;
    actualizarCarrito(newCarrito);
  };

  const handleEliminarInsumo = (index) => {
    const newCarrito = carrito.filter((_, i) => i !== index);
    actualizarCarrito(newCarrito);
  };

  const GuardarSalidaInsumos = () => {
    if (carrito.length === 0) {
      toast.error(
        "El carrito está vacío. No se puede registrar la salida de insumos."
      );
      return; // Sale de la función si el carrito está vacío
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres registrar la salida de insumos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, registrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleGuardarSalidaConDescripcion();
      }
    });
  };

  const handleGuardarSalidaConDescripcion = async () => {
    // Verificar si el carrito está vacío
    if (carrito.length === 0) {
      toast.error(
        "El carrito está vacío. No se puede registrar la salida de insumos."
      );
      return; // Sale de la función si el carrito está vacío
    }

    // Validar la descripción
    if (!descripcion.trim()) {
      toast.error("La descripción no puede estar vacía.");
      return; // Sale de la función si la descripción está vacía
    }

    // Validar la longitud mínima de la descripción (por ejemplo, mínimo 10 caracteres)
    if (descripcion.length < 10) {
      toast.error("La descripción debe tener al menos 10 caracteres.");
      return; // Sale de la función si la descripción es demasiado corta
    }

    // Opcional: Validar caracteres especiales (ejemplo: solo letras y números permitidos)
    const invalidChars = /[^a-zA-Z0-9\s.,]/;
    if (invalidChars.test(descripcion)) {
      toast.error("La descripción contiene caracteres no permitidos.");
      return; // Sale de la función si hay caracteres no permitidos
    }

    // Busca el primer insumo cuya cantidad excede el stock
    const itemExcedido = carrito.find((item) => item.cantidad > item.Cantidad);

    if (itemExcedido) {
      toast.error(
        `La cantidad para el insumo "${itemExcedido.NombreInsumos}" excede el stock disponible.`
      );
      return; // Sale de la función para evitar enviar datos incorrectos
    }

    try {
      const fechaSalida = new Date().toISOString(); // Fecha actual en formato ISO
      const salidaInsumos = carrito.map((item) => ({
        Idinsumos: item.IdInsumos,
        Cantidad: item.cantidad,
        Fecha_salida: fechaSalida,
        Estado: "Terminado", // Puedes cambiar esto si es necesario
        Descripcion: descripcion, // Añade la descripción
      }));

      console.log("Insumos en el carrito:", salidaInsumos); // Imprime los datos antes de enviar

      // Enviar la solicitud POST a la API para registrar la salida de insumos
      const response = await axios.post(
        "http://localhost:5000/salidasInsumos",
        salidaInsumos
      );

      console.log("Respuesta recibida del servidor:", response);

      if (response.status === 201) {
        console.log("Salida de insumos creada:", response.data);

        // Actualizar la cantidad en los insumos
        const updatePromises = carrito.map((item) => {
          const nuevaCantidad = item.Cantidad - item.cantidad; // Calcular la nueva cantidad
          return axios.put(
            `http://localhost:5000/api/existenciainsumos/editar/${item.IdInsumos}`,
            { Cantidad: nuevaCantidad }
          );
        });

        // Esperar a que todas las solicitudes PUT se completen
        await Promise.all(updatePromises);

        toast.success(
          "Salida de insumos creada y existencias actualizadas con éxito"
        );

        // Limpiar el carrito y cerrar el modal
        actualizarCarrito([]);
        setDescripcion(""); // Limpiar la descripción
        handleClose();
      } else {
        console.error("Error al crear salida de insumos:", response);
        toast.error("Hubo un problema al crear la salida de insumos.");
      }
    } catch (error) {
      console.error("Error al crear salida de insumos:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.mensaje
      ) {
        // Mostrar mensaje específico del error si está disponible
        toast.error(error.response.data.mensaje);
      } else {
        toast.error(
          "Error al crear salida de insumos. Por favor, intente de nuevo."
        );
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center">
        <div  style={{ width: '40%' }} className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-[65%] h-full max-h-[95%] flex flex-col relative ml-auto">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-2 text-white hover:text-gray-400"
          >
            <CloseIcon />
          </button>
          <Typography variant="h5" gutterBottom className="text-center mb-6">
            {title}
          </Typography>
          <Divider sx={{ mt: 2 }} />
          <Typography variant="h6" className="mt-4">
            Carrito de Insumos
          </Typography>
          <div className="flex-grow overflow-auto">
            {carrito.map((item, index) => (
              <div
                key={index}
                className="flex justify-between mt-4 items-center p-4"
                style={{ borderBottom: "1px solid #555" }}
              >
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  <Grid item xs={12} md={3}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100px",
                        padding: "0 1rem",
                      }}
                    >
                      <img
                        src={`http://localhost:5000${item.imagen}`}
                        alt={item.NombreInsumos}
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          width: "3rem",
                          height: "3rem",
                          borderRadius: "20%",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>
                      {item.NombreInsumos}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Precio: $
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      Cantidad:{item.Cantidad}
                    </Typography>
                    <div className="flex items-center">
                      <IconButton
                        onClick={() =>
                          handleCantidadChange(index, {
                            target: { value: item.cantidad - 1 },
                          })
                        }
                        sx={{
                          backgroundColor: "white",
                          color: "black",
                          borderRadius: "50%",
                          "&:hover": {
                            backgroundColor: "lightgray",
                          },
                        }}
                      >
                        <i className="bx bx-minus"></i>
                      </IconButton>
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => handleCantidadChange(index, e)}
                        className="mx-2 w-16 text-center bg-transparent border-none text-white"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "4px",
                          color: "white",
                          padding: "4px 8px",
                          border: "none",
                          outline: "none",
                        }}
                      />
                      <IconButton
                        onClick={() =>
                          handleCantidadChange(index, {
                            target: { value: item.cantidad + 1 },
                          })
                        }
                        sx={{
                          backgroundColor: "white",
                          color: "black",
                          borderRadius: "50%",
                          "&:hover": {
                            backgroundColor: "lightgray",
                          },
                        }}
                      >
                        <i className="bx bx-plus"></i>
                      </IconButton>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={2} className="text-right">
                    <IconButton
                      onClick={() => handleEliminarInsumo(index)}
                      sx={{
                        backgroundColor: "white",
                        color: "black",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "lightgray",
                        },
                      }}
                    >
                      <i className="bx bx-trash"></i>
                    </IconButton>
                  </Grid>
                </Grid>
              </div>
            ))}
          </div>
          <TextField
            label="Descripción"
            multiline
            rows={3}
            variant="outlined"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            sx={{ mt: 2, backgroundColor: "#fff", borderRadius: "4px" }}
            fullWidth
          />
          <Button
            onClick={GuardarSalidaInsumos}
            sx={{
              mt: 2,
              backgroundColor: "#EF5A6F",
              color: "#fff",
              "&:hover": { backgroundColor: "#e6455c" },
            }}
            fullWidth
          >
            Sacar insumos
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalInsumos;
