import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TablePrueba from "../../components/consts/Tabla";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkHistoryTwoToneIcon from '@mui/icons-material/WorkHistoryTwoTone';
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box'; // Importar Box
import Pagination from '@mui/material/Pagination'; // Importar Pagination
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';

const Agendamientos = () => {
  const [agendamientos, setAgendamientos] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5); // Número de filas por página
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgendamientos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/agendas");
        const agendamientosConDetalles = response.data.map((agendamiento) => ({
          id: agendamiento.IdAgenda,
          cliente: `${agendamiento.cliente.Nombre} ${agendamiento.cliente.Apellido}`,
          nombreServicio: agendamiento.servicio.Nombre_Servicio,
          imagenServicio: `http://localhost:5000${agendamiento.servicio.ImgServicio}`,
          empleado: `${agendamiento.empleado.Nombre} ${agendamiento.empleado.Apellido}`,
          Fecha: dayjs(agendamiento.Fecha).format('DD/MM/YYYY'),
          Hora: agendamiento.Hora,
          HoraFin: agendamiento.HoraFin, // Aquí
          EstadoAgenda: renderEstadoButton(agendamiento.EstadoAgenda, agendamiento.IdAgenda), // Asegúrate de usar renderEstadoButton aquí
          Acciones: agendamiento.EstadoAgenda !== 2 && agendamiento.EstadoAgenda !== 3 && agendamiento.EstadoAgenda !== 4 && ( // Verificar que el estado no sea "Desconocido"
            <div className="flex space-x-2">
              <Fab
                size="small"
                aria-label="delete"
                onClick={() => AnularAgenda(agendamiento.IdAgenda)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white"
              >
                <DeleteIcon />
              </Fab>
            </div>
          ),
          estiloFila: agendamiento.EstadoAgenda === 3 ? "bg-gray-200" : "",
        }));
        setAgendamientos(agendamientosConDetalles);
        toast.success("Agendamientos cargados exitosamente");
      } catch (error) {
        console.error("Error al obtener los datos de agendamientos:", error);
        toast.error("Error al cargar los agendamientos");
      }
    };
  
    fetchAgendamientos();
  }, []);

  const renderEstadoButton = (estado, agendamientoId) => {
    let buttonClass, estadoTexto;
  
    switch (estado) {
      case 1:
        buttonClass = "bg-blue-500";
        estadoTexto = "En Proceso";
        break;
      case 2:
        buttonClass = "bg-red-500"; // Color para "Cancelado"
        estadoTexto = "Cancelado";   // Texto actualizado a "Cancelado"
        break;
      case 3:
        buttonClass = "bg-green-500";
        estadoTexto = "Terminado";
        break;
      default:
        buttonClass = "bg-gray-500"; // Cambié el color a gris para el estado desconocido
        estadoTexto = "Desconocido";
    }
  
    return (
      <button
        className={`px-3 py-1.5 text-white text-sm font-medium rounded-lg shadow-md focus:outline-none ${buttonClass}`}
        onClick={() => estado === 1 && handleEstadoClick(agendamientoId, estado)} // Cambia solo si está en "En Proceso"
        disabled={estado === 2 } // Deshabilitado si el estado es "Cancelado"
      >
        {estadoTexto}
      </button>
    );
  };

  const handleEstadoClick = async (agendamientoId, estadoActual) => {
    if (estadoActual === 1) {
      const confirmacion = await Swal.fire({
        title: "¿Estás seguro de cambiar el estado a Terminado?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      });
  
      if (confirmacion.isConfirmed) {
        cambiarEstadoAgendamiento(agendamientoId, 3); // Cambia el estado a "Terminado" (3)
      }
    } else if (estadoActual === 3) {
      toast.info("Ya no puedes cambiar el estado de una agenda que está terminada", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } else {
      toast.info("Estado no permite cambios adicionales", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };
  
  const cambiarEstadoAgendamiento = async (agendamientoId, nuevoEstado) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/agendas/editar/${agendamientoId}`,
        { EstadoAgenda: nuevoEstado },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      if (response.status === 200) {
        setAgendamientos((prevAgendamientos) =>
          prevAgendamientos.map((agendamiento) =>
            agendamiento.id === agendamientoId
              ? {
                  ...agendamiento,
                  EstadoAgenda: renderEstadoButton(nuevoEstado, agendamientoId),
                  Acciones: null,
                  // Renderiza el botón con el nuevo estado

                }
              : agendamiento
          )
        );
        toast.success("Estado cambiado con éxito", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error al cambiar el estado:", error.response?.data || error);
      toast.error("Hubo un problema al cambiar el estado", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const AnularAgenda = async (IdAgenda) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: '¿Quieres anular esta agenda?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/api/agendas/anular/${IdAgenda}`);
        setAgendamientos((prevAgendamientos) =>
          prevAgendamientos.map((agendamiento) =>
            agendamiento.id === IdAgenda
              ? {
                  ...agendamiento,
                  EstadoAgenda: renderEstadoButton(2, IdAgenda),
                  Acciones: null,
                  estiloFila: "bg-gray-200"
                }
              : agendamiento
          )
        );
        Swal.fire({
          icon: 'success',
          title: 'Agenda anulada',
          text: 'La agenda ha sido anulada correctamente.',
        });
      } catch (error) {
        console.error('Error al anular la agenda:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al anular la agenda. Por favor, inténtalo de nuevo más tarde.',
        });
      }
    }
  };

  const columns = [
    {
      field: "Imagen",
      headerName: "IMAGEN",
      width: "w-32",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Tooltip title='Imagen del Servicio'>
            <img
              src={params.row.imagenServicio}
              alt="Imagen"
              style={{ maxWidth: "100%", height: "auto", width: "3rem", height: "3rem", borderRadius: "50%" }}
            />
          </Tooltip>
        </div>
      ),
    },
    { field: "nombreServicio", headerName: "Servicio" },
    { field: "Fecha", headerName: "Fecha" },
    { field: "Hora", headerName: "Hora" },
    { field: "HoraFin", headerName: "Hora Fin" }, // Nueva columna
    { field: "empleado", headerName: "Empleado" },
    { field: "cliente", headerName: "Cliente" },
    { field: "EstadoAgenda", headerName: "Estado" },
    { field: "Acciones", headerName: "Acciones" },
  ];

  return (
    <div>
      <TablePrueba
        title="Gestión de Agendamientos"
        columns={columns}
        data={agendamientos} // Datos filtrados y paginados
        rowClassName={(row) => row.estiloFila}
      />

      <Tooltip title="Crear Cita" placement="top" TransitionProps={{ timeout: 500 }}>
        <Fab
          aria-label="add"
          style={{
            border: "0.9px solid grey",
            backgroundColor: "#94CEF2",
            position: "fixed",
            bottom: "50px",
            right: "50px",
            zIndex: 1000
          }}
          onClick={() => navigate('/RegistrarAgendamiento')}
        >
          <AddIcon style={{ fontSize: "2.5rem" }} />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default Agendamientos;
