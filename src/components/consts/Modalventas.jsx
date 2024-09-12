import React, { useState } from "react";
import { Modal, Typography, Button, Divider } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const ModalAdiciones = ({
  open,
  handleClose,
  title = "",
  adiciones,
  setAdicionesSeleccionadas,
  adicionesSeleccionadas,
}) => {
  const [adicionesAgregadas, setAdicionesAgregadas] = useState([]);

  const handleAdd = (id) => {
    const adicionSeleccionada = adiciones.find(
      (adicion) => adicion.IdAdiciones === id
    );
    if (adicionSeleccionada) {
      setAdicionesSeleccionadas([...adicionesSeleccionadas, adicionSeleccionada]);
      setAdicionesAgregadas([...adicionesAgregadas, id]);
    }
  };

  const isAdicionAgregada = (id) => {
    return adicionesAgregadas.includes(id);
  };

  // Verificar si el botón debe estar deshabilitado
  const isDisabled = (estado) => estado !== 1;

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
          <div style={{ width: '40%' }} className="bg-white text-black rounded-lg shadow-lg p-6 max-w-[1600px] h-full max-h-[90%] flex flex-col relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-2 text-black hover:text-gray-600"
            >
              <CloseIcon />
            </button>
            <Typography variant="h5" gutterBottom className="text-center mb-6">
              {title}
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
                          {/* Mostrar botón solo si el estado es 1 */}
                          {!isDisabled(adicion.Estado) && (
                            <button
                              onClick={() => handleAdd(adicion.IdAdiciones)}
                              className={`w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full ${
                                isAdicionAgregada(adicion.IdAdiciones) ? 'disabled-button' : ''
                              }`}
                              disabled={isAdicionAgregada(adicion.IdAdiciones)}
                            >
                              <i
                                className={`bx bxs-plus-circle text-xl ${isAdicionAgregada(adicion.IdAdiciones) ? 'text-gray-500' : 'text-white'}`}
                                style={{ fontSize: '24px' }}
                              ></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                variant="contained"
                onClick={handleClose}
                className="w-1/2 text-sm"
                style={{
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
    </>
  );
};

export default ModalAdiciones;
