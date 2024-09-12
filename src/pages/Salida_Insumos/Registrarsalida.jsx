import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalInsumos from "../../components/consts/ModalSalida";

const SalidaInsumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/insumos");
        setInsumos(response.data);
      } catch (error) {
        console.error("Error al obtener los insumos:", error);
      }
    };

    fetchInsumos();
  }, []);

  const handleAgregarInsumo = (insumo) => {
    const insumoExistente = carrito.find(
      (item) => item.IdInsumos === insumo.IdInsumos
    );
    if (insumoExistente) {
      const nuevoCarrito = carrito.map((item) =>
        item.IdInsumos === insumo.IdInsumos
          ? {
              ...item,
              cantidad: item.cantidad + 1,
              total: (item.cantidad + 1) * item.PrecioUnitario,
            }
          : item
      );
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([
        ...carrito,
        { ...insumo, cantidad: 1, total: insumo.PrecioUnitario },
      ]);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const totalInsumos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const filteredInsumos = insumos
    .filter((insumo) =>
      insumo.NombreInsumos.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((insumo) =>
      selectedCategory ? insumo.nombre_categoria === selectedCategory : true
    );

  const categorias = [
    ...new Set(insumos.map((insumo) => insumo.nombre_categoria)),
  ];

  return (
    <div
      style={{
        paddingTop: "7px",
        margin: "0 auto",
        borderRadius: "30px",
        marginTop: "20px",
        position: "fixed",
        right: "20px",
        top: "30px",
        width: "calc(100% - 100px)",
        padding: "10px",
      }}
    >
      <div
        className="p-2 mx-auto mt-6 max-w-screen-xl"
        style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Salida de Insumos
          </h3>
          <div className="relative">
            <button
              onClick={() => setModalOpen(true)}
              className="text-2xl bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <i className="bx bx-cart text-3xl"></i>
              {totalInsumos > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-sm font-semibold text-white bg-red-500 rounded-full">
                  {totalInsumos}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center mb-3 relative ml-4">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Buscar insumo..."
              required
            />
          </div>

          <div className="relative ml-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
          {filteredInsumos.map((insumo) => (
            <div
              className="bg-white border border-gray-200 rounded-lg transition-transform transform hover:scale-105"
              style={{
                maxWidth: "220px",
                boxShadow: "0 10px 20px rgba(128, 0, 128, 0.3)",
                borderRadius: "15px", // Borde suavizado
              }}
            >
              <img
                src={`http://localhost:5000${insumo.imagen}`}
                alt={insumo.NombreInsumos}
                className="h-40 w-full object-cover rounded-t-lg" // Controla la altura de la imagen
              />
              <div className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {insumo.NombreInsumos}
                  </h5>
                  <span className="font-bold text-md text-gray-900 dark:text-gray-300">
                    ${insumo.PrecioUnitario}
                  </span>
                </div>
                <p className="font-medium text-xs text-gray-600 dark:text-gray-400">
                  Cantidad en stock: {insumo.Cantidad}
                </p>
                <div className="mt-3 flex justify-center">
                  {insumo.Estado !== "Agotado" && insumo.Cantidad > 0 ? (
                    <button
                      className="px-3 py-1.5 text-white rounded-md shadow-lg focus:outline-none focus:ring-2 transition"
                      style={{
                        backgroundColor: "#6F8EE0",
                        borderColor: "#6CC1FF",
                      }}
                      onClick={() => handleAgregarInsumo(insumo)}
                    >
                      <span className="ml-1.5 align-middle">Sacar insumo</span>
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1.5 text-white rounded-md shadow-lg focus:outline-none focus:ring-2 transition"
                      style={{
                        backgroundColor: "#4E8AD9",
                        borderColor: "#6CC1FF",
                      }}
                      onClick={() => handleAgregarInsumo(insumo)}
                    >
                      <span className="ml-1.5 align-middle">Sacar insumo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalInsumos
        open={modalOpen}
        handleClose={handleCloseModal}
        title="Carrito de Insumos"
        carrito={carrito}
        actualizarCarrito={setCarrito}
      />
    </div>
  );
};

export default SalidaInsumos;
