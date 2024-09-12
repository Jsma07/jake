import React, { useState } from "react";
import { Modal, Typography, Button, Divider, FormControl, Select, MenuItem } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const ModalInsumos = ({
  open,
  handleClose,
  title = "",
  insumos,
  setInsumosSeleccionados,
  insumosSeleccionados,
  insumosAgregados,
  setInsumosAgregados,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleAdd = (id) => {
    const insumoSeleccionado = insumos.find((insumo) => insumo.IdInsumos === id);
    if (insumoSeleccionado) {
      setInsumosSeleccionados([...insumosSeleccionados, insumoSeleccionado]);
      setInsumosAgregados([...insumosAgregados, id]);
    }
  };

  const isInsumoAgregado = (id) => insumosAgregados.includes(id);

  // Crear un mapa de categorías basado en los insumos
  const categoriasMap = insumos.reduce((acc, insumo) => {
    if (!acc[insumo.Idcategoria]) {
      acc[insumo.Idcategoria] = insumo.nombre_categoria; // Asocia ID con nombre de categoría
    }
    return acc;
  }, {});

  // Obtener las categorías únicas de los insumos
  const categorias = [...new Set(insumos.map((insumo) => insumo.nombre_categoria))];

  const filteredInsumos = insumos
    .filter((insumo) => insumo.NombreInsumos.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((insumo) => (selectedCategory ? insumo.nombre_categoria === selectedCategory : true));

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <div style={{ width: '35%' }} className="bg-white text-black rounded-lg shadow-lg p-6 w-[90%] h-full max-h-[90%] flex flex-col relative">
          <button onClick={handleClose} className="absolute top-2 right-2 p-2 text-black hover:text-gray-600">
            <CloseIcon />
          </button>
          <Typography variant="h5" gutterBottom className="text-center mb-6">
            {title}
          </Typography>

          {/* Campos de búsqueda y filtrado */}
          <div className="flex space-x-4 mb-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar insumos"
                aria-label="Buscar"
              />
            </div>
            <FormControl variant="outlined" fullWidth>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full"
                displayEmpty
              >
                <MenuItem value="">
                  <em>Todas las categorías</em>
                </MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Divider sx={{ mt: 2 }} />
          <div className="flex-grow overflow-auto">
            <div className="flex flex-col space-y-4">
              {filteredInsumos.map((insumo) => (
                <div key={insumo.IdInsumos} className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        className="w-20 h-20 rounded-full"
                        src={`http://localhost:5000${insumo.imagen}`}
                        alt={insumo.NombreInsumos}
                      />
                      <div className="flex-1 min-w-0 ms-4">
                        <p className="text-lg font-bold text-gray-900 truncate">{insumo.NombreInsumos}</p>
                        <p className="text-sm text-gray-500 truncate">Cantidad: {insumo.Cantidad}</p>
                        <p className="text-sm text-gray-500 truncate">Precio: {insumo.PrecioUnitario}</p>
                        <p className="text-sm text-gray-500 truncate">Categoría: {categoriasMap[insumo.Idcategoria]}</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-6">
                      <button
                        onClick={() => handleAdd(insumo.IdInsumos)}
                        className={`w-10 h-10 flex items-center justify-center ${isInsumoAgregado(insumo.IdInsumos) ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'} rounded-full`}
                        disabled={isInsumoAgregado(insumo.IdInsumos)}
                      >
                        <i className={`bx bxs-plus-circle text-xl`} style={{ fontSize: '24px' }}></i>
                      </button>
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
  );
};

export default ModalInsumos;
