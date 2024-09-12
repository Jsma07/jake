import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Divider } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const ModalAdiciones = ({
  open,
  handleClose,
  title = "",
  adiciones,
  setAdicionesSeleccionadas,
  adicionesSeleccionadas,
  idVentas,
  totalVenta,
  setVentas,
}) => {
  const [adicionesAgregadas, setAdicionesAgregadas] = useState([]);
  const [totalConAdiciones, setTotalConAdiciones] = useState(totalVenta);

  // Recalcular el total cada vez que cambien las adiciones agregadas
  useEffect(() => {
    const calcularTotal = () => {
      const totalAdiciones = adicionesAgregadas.reduce((acc, id) => {
        const adicion = adiciones.find((ad) => ad.IdAdiciones === id);
        return adicion ? acc + adicion.Precio : acc;
      }, 0);
      setTotalConAdiciones(totalVenta + totalAdiciones);
    };

    calcularTotal();
  }, [adicionesAgregadas, adiciones, totalVenta]);

  const handleAdd = (id) => {
    const adicionSeleccionada = adiciones.find(
      (adicion) => adicion.IdAdiciones === id
    );
    if (adicionSeleccionada) {
      setAdicionesSeleccionadas([
        ...adicionesSeleccionadas,
        adicionSeleccionada,
      ]);
      setAdicionesAgregadas([...adicionesAgregadas, id]);
      toast.success("Adición agregada con éxito");
    }
  };

  const isAdicionAgregada = (id) => {
    return adicionesAgregadas.includes(id);
  };

  const isDisabled = (estado) => estado !== 1;

  const cambiarEstadoVenta = async (ventaId, nuevoEstado) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/Jackenail/CambiarEstado/${ventaId}`,
        { Estado: nuevoEstado }
      );
      setVentas((prevVentas) =>
        prevVentas.map((venta) =>
          venta.id === ventaId ? { ...venta, Estado: nuevoEstado } : venta
        )
      );
      console.log("Estado cambiado con éxito:", response.data);
      toast.success("Estado cambiado con éxito", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      toast.error("Hubo un problema al cambiar el estado", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSave = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas guardar los detalles de venta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        // Actualizar el total de la venta
        await axios.put(`http://localhost:5000/Jackenail/Totales/${idVentas}`, {
          Subtotal: totalVenta,
          Descuento: 0,
          Total: totalConAdiciones,
        });

        // Verificar los datos antes de enviarlos
        console.log("Adiciones seleccionadas:", adicionesSeleccionadas);

        // Guardar los detalles de la venta
        const response = await fetch(
          "http://localhost:5000/Jackenail/Detalleregistrar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Idventa: idVentas,
              IdAdiciones: adicionesSeleccionadas.map(
                (adicion) => adicion.IdAdiciones
              ),
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          await cambiarEstadoVenta(idVentas, 1);
          toast.success("Detalles de venta guardados con éxito");
          handleClose();
        } else {
          toast.error(`Error: ${data.mensaje}`);
        }
      } catch (error) {
        toast.error("Error al guardar los detalles de venta");
        console.error("Error al guardar detalles de venta:", error);
      }
    }
  };

  return (
    <>
      <style>
        {`
          .disabled-button {
            background-color: rgba(255, 255, 255, 0.5) !important;
            cursor: not-allowed;
          }
          .disabled-button i {
            color: rgba(0, 0, 0, 0.2) !important;
          }
        `}
      </style>
      <Modal open={open} onClose={handleClose}>
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center">
          <div
            style={{ width: "40%" }}
            className="bg-white text-black rounded-lg shadow-lg p-6 max-w-[1600px] h-full max-h-[90%] flex flex-col relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-2 text-black hover:text-gray-600"
            >
              <CloseIcon />
            </button>
            <Typography variant="h5" gutterBottom className="text-center mb-6">
              {title}
            </Typography>

            <Typography
              variant="body1"
              gutterBottom
              className="text-center mb-6"
            >
              ID de la Venta: {idVentas}
            </Typography>

            <Divider sx={{ mt: 2 }} />
            <div className="flex-grow overflow-auto">
              <div className="flex flex-col space-y-4">
                {adiciones &&
                  adiciones.map((adicion) => (
                    <div
                      key={adicion.IdAdiciones}
                      className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <img
                            className="w-20 h-20 rounded-full"
                            src={`http://localhost:5000${adicion.Img}`}
                            alt={adicion.NombreAdiciones}
                          />
                          <div className="flex-1 min-w-0 ms-4">
                            <p className="text-lg font-bold text-gray-900 truncate">
                              {adicion.NombreAdiciones}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              Precio: ${adicion.Precio}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center mt-6">
                          {!isDisabled(adicion.Estado) && (
                            <button
                              onClick={() => handleAdd(adicion.IdAdiciones)}
                              className={`w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full ${
                                isAdicionAgregada(adicion.IdAdiciones)
                                  ? "disabled-button"
                                  : ""
                              }`}
                              disabled={isAdicionAgregada(adicion.IdAdiciones)}
                            >
                              <i
                                className={`bx bxs-plus-circle text-xl ${
                                  isAdicionAgregada(adicion.IdAdiciones)
                                    ? "text-gray-500"
                                    : "text-white"
                                }`}
                                style={{ fontSize: "24px" }}
                              ></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <Divider sx={{ mt: 2 }} />
            <Typography variant="h6" gutterBottom className="text-center mt-4">
              Total con Adiciones: ${totalConAdiciones.toFixed(2)}
            </Typography>
            <div className="flex justify-center mt-4">
              <Button
                variant="contained"
                onClick={handleSave}
                className="w-1/2 text-sm"
                style={{
                  backgroundColor: "#EF5A6F",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#e6455e" },
                }}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalAdiciones;
