import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Fab,
  Tooltip,
  Box,
  Avatar,
  Input,
  Pagination,
  CardActionArea,
  IconButton,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import ModalInactivarFecha from "../../components/consts/ModalInactivarFecha";
import UpdateDisabledIcon from "@mui/icons-material/UpdateDisabled";
import DeleteIcon from "@mui/icons-material/Delete";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import InactivarHorasModal from "../../components/InactivarHorasModal"; // Ajusta la ruta según sea necesario
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import EventBusyIcon from '@mui/icons-material/EventBusy';

dayjs.locale("es");

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const FechasTrabajo = () => {
  const [modalInactivarHorasOpen, setModalInactivarHorasOpen] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [fechasConHorasInactivas, setFechasConHorasInactivas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroSeleccionado, setFiltroSeleccionado] = useState("todos"); // Nuevo estado
  const [selectedEstado, setSelectedEstado] = useState("");
  const [page, setPage] = useState(1);
  const [cardsPerPage] = useState(9);
  const navigate = useNavigate();
  useEffect(() => {
    fetchHorarios();
    fetchFechasConHorasInactivas();
  }, []);

  const fetchHorarios = () => {
    axios
      .get("http://localhost:5000/api/horarios")
      .then((response) => {
        const horariosWithColors = response.data.map((horario) => ({
          ...horario,
          color: getRandomColor(),
        }));
        setHorarios(horariosWithColors);
      })
      .catch((error) => {
        console.error("Error al obtener los horarios:", error);
      });
  };

  const fetchFechasConHorasInactivas = () => {
    axios
      .get("http://localhost:5000/api/horarios/listarFechasConHorasInactivas")
      .then((response) => {
        setFechasConHorasInactivas(response.data);
      })
      .catch((error) => {
        console.error(
          "Error al obtener las fechas con horas inactivas:",
          error
        );
      });
  };

  const handleOpenInactivarHorasModal = () => {
    setModalInactivarHorasOpen(true);
  };

  const handleCloseInactivarHorasModal = () => {
    setModalInactivarHorasOpen(false);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFechaInactivada = async () => {
    await fetchHorarios();
    await fetchFechasConHorasInactivas();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEstadoFilterChange = (event) => {
    setSelectedEstado(event.target.value);
  };

  const handleEliminarHorario = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres eliminar este horario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/api/horarios/${id}`)
          .then(() => {
            setHorarios(horarios.filter((horario) => horario.id !== id));
            Swal.fire("Eliminado!", "El horario ha sido eliminado.", "success");
            fetchHorarios();
            fetchFechasConHorasInactivas();
          })
          .catch((error) => {
            console.error("Error al eliminar el horario:", error);
            Swal.fire(
              "Error",
              "Hubo un error al eliminar el horario. Por favor, inténtalo de nuevo más tarde.",
              "error"
            );
          });
      }
    });
  };

  const handleViewHorasInactivas = (fecha) => {
    axios
      .get(`http://localhost:5000/api/horarios/listarHorasInactivas/${fecha}`)
      .then((response) => {
        const horasInactivas = response.data.horas_inactivas.join(", ");
        Swal.fire({
          title: `Horas inactivas para ${fecha}`,
          text: horasInactivas,
          icon: "info",
          confirmButtonText: "Cerrar",
        });
      })
      .catch((error) => {
        console.error("Error al obtener horas inactivas:", error);
      });
  };

  const filteredHorarios = horarios.filter((horario) => {
    const matchesSearchTerm = dayjs(horario.fecha)
      .format("DD/MM/YYYY")
      .includes(searchTerm);
    const matchesEstado = selectedEstado
      ? horario.estado === selectedEstado
      : true;

    if (filtroSeleccionado === "diasInactivos") {
      return (
        matchesSearchTerm && matchesEstado && horario.estado === "inactivo"
      );
    } else if (filtroSeleccionado === "horasInactivas") {
      return (
        matchesSearchTerm &&
        matchesEstado &&
        fechasConHorasInactivas.some((f) => f.fecha === horario.fecha)
      );
    } else {
      return matchesSearchTerm && matchesEstado;
    }
  });

  const indexOfLastCard = page * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredHorarios.slice(
    indexOfFirstCard,
    indexOfLastCard
  );

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <section>
      <div
        style={{
          paddingTop: "5px",
          margin: "0 auto",
          borderRadius: "40px",
          marginTop: "20px",
          boxShadow: "0 4px 12px rgba(128, 0, 128, 0.1)",
          position: "fixed",
          left: "90px",
          top: "80px",
          width: "calc(100% - 100px)",
        }}
      >
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-4">
            <h4
              style={{
                textAlign: "left",
                fontSize: "23px",
                fontWeight: "bold",
              }}
              className="text-3xl"
            >
              Inhabilitacion De Fechas y Horarios
            </h4>
            <div className="relative w-80">
              <Input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por fecha (DD/MM/YYYY)"
                fullWidth
              />
            </div>
          </div>


          <Box display="flex" justifyContent="space-between" mb={2}>
            <Button
              variant={
                filtroSeleccionado === "diasInactivos"
                  ? "contained"
                  : "outlined"
              }
              onClick={() => setFiltroSeleccionado("diasInactivos")}
              startIcon={<EventBusyIcon/>}
            >
              Días Inactivos
            </Button>
            <Button
              variant={
                filtroSeleccionado === "horasInactivas"
                  ? "contained"
                  : "outlined"
              }
              onClick={() => setFiltroSeleccionado("horasInactivas")}
              startIcon={<AlarmOffIcon/>}
            >
              Días con Horas Inactivas
            </Button>
            <Button
              variant={
                filtroSeleccionado === "todos" ? "contained" : "outlined"
              }
              onClick={() => setFiltroSeleccionado("todos")}
              startIcon={<StoreMallDirectoryIcon/>}
            >
              Mostrar Todo
            </Button>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            gap={2}
            mb={2}
          >
            {currentCards.map((horario) => (
              <motion.div
                key={horario.id}
                initial={{ opacity: 0, y: 50 }} // Comienza invisible y desplazado hacia abajo
                animate={{ opacity: 1, y: 0 }} // Aparece con opacidad 1 y sin desplazamiento
                transition={{ duration: 0.5, }} // Duración y retardo para crear un efecto de escalonamiento
                whileHover={{ scale: 1.05 }} // Efecto de hover (ya lo tenías implementado)
                whileTap={{ scale: 1.0 }} // Efecto al hacer clic (ya lo tenías implementado)
              >
                <Card sx={{ backgroundColor: "#E3F2FD", borderRadius: 2 }}>
                  <CardActionArea>
                    <CardContent>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Avatar
                          sx={{
                            backgroundColor: horario.color,
                            marginRight: 2,
                          }}
                        >
                          {dayjs(horario.fecha).format("DD")}
                        </Avatar>
                        <Box textAlign="center" flexGrow={1}>
                          <Typography variant="h6" component="div">
                            {dayjs(horario.fecha).format("D MMMM")}
                          </Typography>
                          <Typography variant="body2">
                            Estado: {horario.estado}
                          </Typography>
                        </Box>
                        {fechasConHorasInactivas.some(
                          (f) => f.fecha === horario.fecha
                        ) && (
                          <IconButton
                            aria-label="view-hours"
                            onClick={() =>
                              handleViewHorasInactivas(horario.fecha)
                            }
                            sx={{ marginLeft: 2 }}
                          >
                            <VisibilityIcon style={{ fontSize: "2.0rem" }} />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleEliminarHorario(horario.id)}
                          sx={{
                            backgroundColor: "#f6cdf3",
                            "&:hover": {
                              backgroundColor: "#ed9187",
                            },
                            borderRadius: "50%",
                            padding: 1,
                          }}
                        >
                          <DeleteIcon
                            color="error"
                            style={{ fontSize: "2.3rem" }}
                          />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            ))}
          </Box>

          <Box display="flex" justifyContent="center" mb={2}>
            <Pagination
              count={Math.ceil(filteredHorarios.length / cardsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>

          <Tooltip
            title="Inactivar Días"
            placement="top"
            TransitionProps={{ timeout: 500 }}
          >
            <Fab
              aria-label="inactivate"
              style={{
                border: "0.9px solid grey",
                backgroundColor: "#94CEF2",
                position: "fixed",
                bottom: "48px",
                right: "50px",
                zIndex: 1000,
              }}
              onClick={handleOpenModal}
            >
              <PendingActionsIcon style={{ fontSize: "2.3rem" }} />
            </Fab>
          </Tooltip>
          <ModalInactivarFecha
            open={modalOpen}
            handleClose={handleCloseModal}
            onFechaInactivada={handleFechaInactivada}
          />

          <Tooltip
            title="Inactivar Horas"
            placement="top"
            TransitionProps={{ timeout: 500 }}
          >
            <Fab
              aria-label="inactivate"
              style={{
                border: "0.9px solid grey",
                backgroundColor: "#94CEF2",
                position: "fixed",
                bottom: "120px",
                right: "50px",
                zIndex: 1000,
              }}
              onClick={handleOpenInactivarHorasModal}
            >
              <UpdateDisabledIcon style={{ fontSize: "2.3rem" }} />
            </Fab>
          </Tooltip>

          <InactivarHorasModal
            open={modalInactivarHorasOpen}
            onClose={() => setModalInactivarHorasOpen(false)}
            onHoursInactivated={handleFechaInactivada}
          />
        </div>
      </div>
    </section>
  );
};

export default FechasTrabajo;
