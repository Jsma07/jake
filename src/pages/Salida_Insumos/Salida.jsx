import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tabla from "../../components/consts/Tabla";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Modal,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Salida = () => {
  const [salidas, setSalidas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [detalleSalida, setDetalleSalida] = useState({});

  useEffect(() => {
    const fetchSalidas = async () => {
      try {
        const response = await axios.get("http://localhost:5000/ListarSalidas");
        const salidasConDetalles = response.data.map((salida) => {
          let estadoButton;
          if (salida.Estado === "Terminado") {
            estadoButton = (
              <button className="px-3 py-1.5 text-white text-sm font-medium rounded-lg shadow-md focus:outline-none bg-green-500">
                Terminado
              </button>
            );
          } else if (salida.Estado === "Anulado") {
            estadoButton = (
              <button className="px-3 py-1.5 text-white text-sm font-medium rounded-lg shadow-md focus:outline-none bg-red-500">
                Anulado
              </button>
            );
          } else {
            estadoButton = (
              <Button
                className="px-3 py-1.5 text-white text-sm font-medium rounded-lg shadow-md focus:outline-none bg-gray-500"
                variant="contained"
                style={{ backgroundColor: "#9e9e9e", color: "white" }}
              >
                Desconocido
              </Button>
            );
          }

          return {
            id: salida.IdSalida,
            categoria: salida.insumo.categoria.nombre_categoria,
            idInsumo: (
              <div>
                <img
                  src={`http://localhost:5000${salida.insumo.Imagen}`}
                  alt={salida.insumo.NombreInsumos}
                  style={{
                    maxWidth: "3rem",
                    height: "3rem",
                    borderRadius: "50%",
                  }}
                />
              </div>
            ),
            NombreInsumo: salida.insumo.NombreInsumos,
            Fecha: salida.Fecha_salida,
            Cantidad: salida.Cantidad,
            Estado: estadoButton,
            Acciones: (
              <div className="flex space-x-2">
                <Fab
                  size="small"
                  aria-label="view"
                  onClick={() => handleOpenModal(salida)}
                  style={{ backgroundColor: "#3b82f6", color: "white" }}
                >
                  <RemoveRedEyeIcon />
                </Fab>

                {salida.Estado !== "Anulado" && (
                  <Fab
                    size="small"
                    aria-label="anular"
                    onClick={() => handleAnular(salida)}
                    style={{ backgroundColor: "#ef4444", color: "white" }}
                  >
                    <DeleteIcon />
                  </Fab>
                )}
              </div>
            ),
            estiloFila: salida.Estado === "Terminado" ? "bg-gray-200" : "",
          };
        });
        setSalidas(salidasConDetalles);
      } catch (error) {
        console.error("Error al obtener los datos de salidas:", error);
      }
    };

    fetchSalidas();
  }, []);

  const handleAnular = async (salida) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres anular esta salida?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Anula la salida
          await axios.patch(
            `http://localhost:5000/salidas/${salida.IdSalida}`,
            { nuevoEstado: "Anulado" }
          );

          // Restaura la cantidad en los insumos
          await axios.put(
            `http://localhost:5000/api/existenciainsumos/editar/${salida.insumo.IdInsumos}`,
            { Cantidad: salida.insumo.Cantidad + salida.Cantidad }
          );

          // Actualiza el estado local con los nuevos detalles y elimina el botón de anular
          setSalidas((prevSalidas) =>
            prevSalidas.map((item) =>
              item.id === salida.IdSalida
                ? {
                    ...item,
                    Estado: (
                      <button className="px-3 py-1.5 text-white text-sm font-medium rounded-lg shadow-md focus:outline-none bg-red-500">
                        Anulado
                      </button>
                    ),
                    Acciones: (
                      <div className="flex space-x-2">
                        <Fab
                          size="small"
                          aria-label="view"
                          onClick={() => handleOpenModal(salida)}
                          style={{ backgroundColor: "#3b82f6", color: "white" }}
                        >
                          <RemoveRedEyeIcon />
                        </Fab>
                      </div>
                    ),
                    estiloFila: "bg-gray-200",
                  }
                : item
            )
          );

          toast.success(
            "La salida se ha anulado y la cantidad ha sido restaurada.",
            {
              position: "bottom-right",
              autoClose: 3000,
            }
          );
        } catch (error) {
          console.error("Error al anular la salida:", error);
          Swal.fire("Error!", "No se pudo anular la salida.", "error");
        }
      }
    });
  };

  const handleOpenModal = (salida) => {
    setDetalleSalida(salida);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const columns = [
    { field: "categoria", headerName: "Categoría" },
    { field: "idInsumo", headerName: "Insumo" },
    { field: "NombreInsumo", headerName: "Nombre Insumo" },
    { field: "Fecha", headerName: "Fecha" },
    { field: "Cantidad", headerName: "Cantidad" },
    { field: "Estado", headerName: "Estado" },
    { field: "Acciones", headerName: "Acciones" },
  ];

  return (
    <div>
      <Tabla
        title="Gestión de Salidas de Insumos"
        columns={columns}
        data={salidas}
        rowClassName={(row) => row.estiloFila}
      />

      <Link to="/Registrarsalida">
        <Fab
          aria-label="add"
          style={{
            border: "0.5px solid grey",
            backgroundColor: "#94CEF2",
            position: "fixed",
            bottom: "16px",
            right: "16px",
            zIndex: 1000,
          }}
        >
          <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
        </Fab>
      </Link>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div
            className="bg-white text-black rounded-lg shadow-lg p-6 w-[90%] max-w-4xl"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            {/* Encabezado centrado */}
            <div className="text-center mb-4">
              <Typography variant="h6" gutterBottom>
                Detalle de la Salida
              </Typography>
            </div>

            {/* Contenedor de tarjeta y tabla en la misma fila */}
            <div className="flex flex-wrap gap-6">
              {/* Card para mostrar la información del insumo */}
              <div
                className="bg-white border border-gray-200 rounded-lg shadow-md"
                style={{
                  maxWidth: "220px",
                  flex: "1 1 auto",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px", // Borde suavizado
                }}
              >
                <div className="relative">
                  <img
                    src={`http://localhost:5000${detalleSalida.insumo?.Imagen}`}
                    alt={
                      detalleSalida.insumo?.NombreInsumos || "Imagen del insumo"
                    }
                    className="w-full object-cover rounded-t-lg"
                    style={{
                      height: "300px", // Ajusta esta altura según sea necesario
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  />
                  {/* Agrega un padding para más espacio debajo de la imagen */}
                  <div className="absolute inset-x-0 bottom-0 h-6 bg-white"></div>
                </div>
                <div className="p-4">
                  <div className="flex flex-col gap-2">
                    <h5 className="text-lg font-semibold text-gray-800">
                      {detalleSalida.insumo?.NombreInsumos ||
                        "Nombre no disponible"}
                    </h5>
                    <span className="font-bold text-md text-gray-900">
                      $
                      {detalleSalida.insumo?.PrecioUnitario ||
                        "Precio no disponible"}
                    </span>
                    <p className="font-medium text-xs text-gray-600">
                      Cantidad en stock:{" "}
                      {detalleSalida.insumo?.Cantidad ||
                        "Cantidad no disponible"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabla para la información adicional */}
              <Box mb={4} flex="1">
                <Typography variant="h6" gutterBottom>
                  Información Adicional
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Campo</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Valor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Fecha de Salida</TableCell>
                        <TableCell>
                          {detalleSalida.Fecha_salida || "Fecha no disponible"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>
                          {detalleSalida.Cantidad || "Cantidad no disponible"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Estado</TableCell>
                        <TableCell>
                          {detalleSalida.Estado === "Terminado"
                            ? "Terminado"
                            : detalleSalida.Estado === "Anulado"
                            ? "Anulado"
                            : "Desconocido"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Descripción</TableCell>
                        <TableCell>
                          {detalleSalida.Descripcion ||
                            "Descripción no disponible"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </div>

            {/* Botón de cerrar en la parte inferior derecha */}
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleCloseModal}
                sx={{
                  backgroundColor: "#EF5A6F",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#e6455c" },
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Salida;
