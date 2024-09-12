import React, { useEffect, useState } from "react";
import axios from "axios";
import TablePrueba from "../../components/consts/Tabla";
import ModalAgregarAdicion from "../../components/consts/Modaladi";
import { toast } from "react-toastify";
import Fab from "@mui/material/Fab";
import Swal from "sweetalert2";

const ListarAdiciones = () => {
  const [adiciones, setAdiciones] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchAdiciones = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/Jackenail/Listarventas/adiciones"
      );
      setAdiciones(response.data);
    } catch (error) {
      toast.error("Error al obtener las adiciones");
    }
  };

  useEffect(() => {
    fetchAdiciones();
  }, []); // Dependencias vacías para que se ejecute solo una vez al montar el componente

  const handleModalClose = () => {
    setOpenModal(false);
    fetchAdiciones(); // Refresca la lista de adiciones
  };

  const columns = [
    { field: "IdAdiciones", headerName: "ID" },
    {
      field: "Imagen",
      headerName: "Imagen",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img
            src={`http://localhost:5000${params.row.Img}`}
            alt={params.row.NombreAdiciones}
            style={{
              maxWidth: "100%",
              height: "auto",
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
            }}
          />
        </div>
      ),
    },
    { field: "NombreAdiciones", headerName: "Nombre" },
    { field: "Precio", headerName: "Precio", type: "number" },
    {
      field: "Estado",
      headerName: "Estado",
      renderCell: (params) =>
        renderEstadoButton(params.row.Estado, params.row.IdAdiciones),
    },
  ];

  const renderEstadoButton = (estado, adicionId) => {
    let buttonClass, estadoTexto;

    switch (estado) {
      case 1:
        buttonClass = "bg-green-500";
        estadoTexto = "Activo";
        break;
      case 2:
        buttonClass = "bg-red-500";
        estadoTexto = "Inactivo";
        break;
      default:
        buttonClass = "bg-gray-500";
        estadoTexto = "Desconocido";
    }

    return (
      <button
        className={`px-3 py-1.5 text-white text-sm font-medium rounded-lg shadow-md focus:outline-none ${buttonClass}`}
        onClick={() => handleEstadoClick(adicionId, estado)}
      >
        {estadoTexto}
      </button>
    );
  };

  const handleEstadoClick = (adicionId, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 2 : 1;

    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas cambiar el estado de la adición a ${nuevoEstado}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://localhost:5000/Jackenail/CambiaEstado/${adicionId}`, {
            Estado: nuevoEstado,
          })
          .then((response) => {
            setAdiciones((prevAdiciones) =>
              prevAdiciones.map((adicion) =>
                adicion.IdAdiciones === adicionId
                  ? { ...adicion, Estado: nuevoEstado }
                  : adicion
              )
            );
            toast.success("Estado actualizado correctamente");
          })
          .catch((error) => {
            toast.error(
              `Error al actualizar el estado: ${
                error.response ? error.response.data.mensaje : error.message
              }`
            );
          });
      }
    });
  };

  return (
    <div>
      <TablePrueba
        title="Gestión de Adiciones"
        columns={columns}
        data={adiciones}
      />
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
        onClick={() => setOpenModal(true)}
      >
        <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
      </Fab>
      <ModalAgregarAdicion
        open={openModal}
        handleClose={handleModalClose}
        adiciones={adiciones}
        setAdiciones={setAdiciones}
      />
    </div>
  );
};

export default ListarAdiciones;
